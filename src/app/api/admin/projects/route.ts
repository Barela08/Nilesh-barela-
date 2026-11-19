import { NextRequest, NextResponse } from 'next/server';
import { dbProjects, PortfolioProject } from '@/lib/db';
import { authenticateAdminRequest, cleanText } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    if (!authenticateAdminRequest(req)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const projects = dbProjects.getAll();
    return NextResponse.json({ success: true, projects });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!authenticateAdminRequest(req)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const title = cleanText(body.title, 150);
    const category = cleanText(body.category, 100);
    const summary = cleanText(body.summary, 600);
    const client = cleanText(body.client, 120) || 'HackifyPro Client';
    const market = cleanText(body.market, 120) || 'India';
    const problemSolved = cleanText(body.problemSolved, 600);
    const image = cleanText(body.image, 300) || '/assets/hackifypro-workspace.png';
    const demoUrl = cleanText(body.demoUrl, 300);
    const status = cleanText(body.status, 100) || 'Live & Deployed Demonstration';

    if (!title || !category || !summary) {
      return NextResponse.json(
        { error: 'Title, Category, and Summary are required.' },
        { status: 400 }
      );
    }

    // Process mainFeatures
    let mainFeatures: string[] = [];
    if (Array.isArray(body.mainFeatures)) {
      mainFeatures = body.mainFeatures.map((f: any) => cleanText(f, 250)).filter(Boolean);
    } else if (typeof body.mainFeatures === 'string') {
      mainFeatures = body.mainFeatures
        .split('\n')
        .map((f: string) => cleanText(f, 250))
        .filter(Boolean);
    }
    if (mainFeatures.length === 0) {
      mainFeatures = ['Production quality architecture', 'Fully responsive and high-speed UI'];
    }

    // Process techStack
    let techStack: string[] = [];
    if (Array.isArray(body.techStack)) {
      techStack = body.techStack.map((t: any) => cleanText(t, 50)).filter(Boolean);
    } else if (typeof body.techStack === 'string') {
      techStack = body.techStack
        .split(',')
        .map((t: string) => cleanText(t.trim(), 50))
        .filter(Boolean);
    }
    if (techStack.length === 0) {
      techStack = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'];
    }

    const newProject = dbProjects.create({
      title,
      category,
      summary,
      client,
      market,
      problemSolved: problemSolved || 'Streamlined manual operations into high-performance digital workflows.',
      mainFeatures,
      techStack,
      image,
      demoUrl: demoUrl || undefined,
      hasDemo: Boolean(demoUrl && demoUrl.trim().length > 0),
      status,
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating project:', err);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!authenticateAdminRequest(req)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object' || !body.id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const id = cleanText(body.id, 60);
    const existing = dbProjects.getById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updates: Partial<PortfolioProject> = {};

    if (body.title !== undefined) updates.title = cleanText(body.title, 150);
    if (body.category !== undefined) updates.category = cleanText(body.category, 100);
    if (body.summary !== undefined) updates.summary = cleanText(body.summary, 600);
    if (body.client !== undefined) updates.client = cleanText(body.client, 120);
    if (body.market !== undefined) updates.market = cleanText(body.market, 120);
    if (body.problemSolved !== undefined) updates.problemSolved = cleanText(body.problemSolved, 600);
    if (body.image !== undefined) updates.image = cleanText(body.image, 300);
    if (body.demoUrl !== undefined) {
      updates.demoUrl = cleanText(body.demoUrl, 300);
      updates.hasDemo = Boolean(updates.demoUrl && updates.demoUrl.trim().length > 0);
    }
    if (body.status !== undefined) updates.status = cleanText(body.status, 100);

    if (body.mainFeatures !== undefined) {
      if (Array.isArray(body.mainFeatures)) {
        updates.mainFeatures = body.mainFeatures.map((f: any) => cleanText(f, 250)).filter(Boolean);
      } else if (typeof body.mainFeatures === 'string') {
        updates.mainFeatures = body.mainFeatures
          .split('\n')
          .map((f: string) => cleanText(f, 250))
          .filter(Boolean);
      }
    }

    if (body.techStack !== undefined) {
      if (Array.isArray(body.techStack)) {
        updates.techStack = body.techStack.map((t: any) => cleanText(t, 50)).filter(Boolean);
      } else if (typeof body.techStack === 'string') {
        updates.techStack = body.techStack
          .split(',')
          .map((t: string) => cleanText(t.trim(), 50))
          .filter(Boolean);
      }
    }

    const updated = dbProjects.update(id, updates);
    return NextResponse.json({ success: true, project: updated });
  } catch (err: any) {
    console.error('Error updating project:', err);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!authenticateAdminRequest(req)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await req.json().catch(() => null);
      if (body && body.id) {
        id = body.id;
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const deleted = dbProjects.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting project:', err);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

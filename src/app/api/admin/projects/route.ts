import { NextRequest, NextResponse } from 'next/server';
import { dbProjects, dbAdminActivity, PortfolioProject } from '@/lib/db';
import { authenticateAdminRequest, verifyAdminSessionToken, cleanText, isSafeUrl } from '@/lib/security';

export const dynamic = 'force-dynamic';

function sanitizeProjectUrl(raw: unknown, maxLen: number = 300): string {
  const cleaned = cleanText(raw, maxLen);
  if (!cleaned) return '';
  return isSafeUrl(cleaned) ? cleaned : '';
}

function getAdminEmail(req: NextRequest): string {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || req.cookies.get('hp_admin_auth')?.value;
  if (token) {
    const verified = verifyAdminSessionToken(token);
    if (verified.valid && verified.email) return verified.email;
  }
  return 'admin@hackifypro.com';
}

export async function GET(req: NextRequest) {
  try {
    const auth = authenticateAdminRequest(req);
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized. Admin session required.' }, { status: auth.status || 401 });
    }

    const projects = dbProjects.getAll();
    return NextResponse.json({ success: true, projects });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = authenticateAdminRequest(req, 'manage_projects');
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized. Admin session required.' }, { status: auth.status || 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const title = cleanText(body.title, 150);
    const category = cleanText(body.category, 100) || 'Web Application & SaaS';
    const summary = cleanText(body.summary, 800) || '';
    const client = cleanText(body.client, 120) || 'HackifyPro Client';
    const market = cleanText(body.market, 120) || 'India & Global';
    const problemSolved = cleanText(body.problemSolved, 800) || '';
    const image = sanitizeProjectUrl(body.image, 300) || '/assets/hackifypro-workspace.png';
    const demoUrl = sanitizeProjectUrl(body.demoUrl, 300);
    const status = cleanText(body.status, 100) || 'Live & Deployed Demonstration';

    if (!title) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    }

    // Extended fields
    const projectType = cleanText(body.projectType, 100) || 'Web Application';
    const targetAudience = cleanText(body.targetAudience, 150) || 'Modern Businesses';
    const visibility: 'published' | 'draft' | 'archived' =
      body.visibility === 'draft' ? 'draft' : body.visibility === 'archived' ? 'archived' : 'published';
    const featured = body.featured !== undefined ? Boolean(body.featured) : true;
    const completionDate = cleanText(body.completionDate, 50) || new Date().toISOString().split('T')[0];
    const location = cleanText(body.location, 100) || 'Maharashtra, India';
    const shortDescription = cleanText(body.shortDescription, 400) || summary;
    const fullDescription = typeof body.fullDescription === 'string' ? body.fullDescription : '';
    const githubUrl = sanitizeProjectUrl(body.githubUrl, 300);
    const seoTitle = cleanText(body.seoTitle, 150) || `${title} | HackifyPro Software Portfolio`;
    const seoDescription = cleanText(body.seoDescription, 250) || summary;

    // Gallery array
    let gallery = [];
    if (Array.isArray(body.gallery)) {
      gallery = body.gallery.map((g: any, idx: number) => ({
        id: g.id || `img-${Date.now().toString(36)}-${idx}`,
        url: sanitizeProjectUrl(g.url, 400),
        alt: cleanText(g.alt, 200) || title,
        caption: cleanText(g.caption, 250) || '',
        order: typeof g.order === 'number' ? g.order : idx + 1,
      })).filter((g: any) => Boolean(g.url));
    }

    // Videos array
    let videos = [];
    if (Array.isArray(body.videos)) {
      videos = body.videos.map((v: any, idx: number) => ({
        id: v.id || `vid-${Date.now().toString(36)}-${idx}`,
        title: cleanText(v.title, 150) || `${title} Video`,
        url: sanitizeProjectUrl(v.url, 400),
        poster: sanitizeProjectUrl(v.poster, 400),
        type: v.type === 'file' ? 'file' : v.type === 'vimeo' ? 'vimeo' : v.type === 'youtube' ? 'youtube' : 'other',
        order: typeof v.order === 'number' ? v.order : idx + 1,
        position: v.position === 'before' ? 'before' : 'after',
      })).filter((v: any) => Boolean(v.url));
    }

    // External URLs
    let externalUrls = [];
    if (Array.isArray(body.externalUrls)) {
      externalUrls = body.externalUrls.map((u: any) => ({
        label: cleanText(u.label, 100) || 'External Link',
        url: sanitizeProjectUrl(u.url, 300),
      })).filter((u: any) => Boolean(u.url));
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
      status,
      projectType,
      targetAudience,
      visibility,
      featured,
      completionDate,
      location,
      shortDescription,
      fullDescription,
      githubUrl,
      externalUrls,
      seoTitle,
      seoDescription,
      gallery,
      videos,
    });

    dbAdminActivity.log({
      action: 'CREATE_PROJECT',
      targetType: 'project',
      targetId: newProject.id,
      description: `Created new project: ${newProject.title} (${newProject.category})`,
      adminEmail: getAdminEmail(req),
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating project:', err);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = authenticateAdminRequest(req, 'manage_projects');
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized. Admin session required.' }, { status: auth.status || 401 });
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
    if (body.summary !== undefined) updates.summary = cleanText(body.summary, 800);
    if (body.client !== undefined) updates.client = cleanText(body.client, 120);
    if (body.market !== undefined) updates.market = cleanText(body.market, 120);
    if (body.problemSolved !== undefined) updates.problemSolved = cleanText(body.problemSolved, 800);
    if (body.image !== undefined) updates.image = sanitizeProjectUrl(body.image, 300) || existing.image;
    if (body.demoUrl !== undefined) updates.demoUrl = sanitizeProjectUrl(body.demoUrl, 300);
    if (body.status !== undefined) updates.status = cleanText(body.status, 100);

    if (body.projectType !== undefined) updates.projectType = cleanText(body.projectType, 100);
    if (body.targetAudience !== undefined) updates.targetAudience = cleanText(body.targetAudience, 150);
    if (body.visibility !== undefined) {
      updates.visibility = body.visibility === 'draft' ? 'draft' : body.visibility === 'archived' ? 'archived' : 'published';
    }
    if (body.featured !== undefined) updates.featured = Boolean(body.featured);
    if (body.completionDate !== undefined) updates.completionDate = cleanText(body.completionDate, 50);
    if (body.location !== undefined) updates.location = cleanText(body.location, 100);
    if (body.shortDescription !== undefined) updates.shortDescription = cleanText(body.shortDescription, 400);
    if (body.fullDescription !== undefined) updates.fullDescription = typeof body.fullDescription === 'string' ? body.fullDescription : '';
    if (body.githubUrl !== undefined) updates.githubUrl = sanitizeProjectUrl(body.githubUrl, 300);
    if (body.seoTitle !== undefined) updates.seoTitle = cleanText(body.seoTitle, 150);
    if (body.seoDescription !== undefined) updates.seoDescription = cleanText(body.seoDescription, 250);

    if (body.gallery !== undefined && Array.isArray(body.gallery)) {
      updates.gallery = body.gallery.map((g: any, idx: number) => ({
        id: g.id || `img-${Date.now().toString(36)}-${idx}`,
        url: sanitizeProjectUrl(g.url, 400),
        alt: cleanText(g.alt, 200),
        caption: cleanText(g.caption, 250),
        order: typeof g.order === 'number' ? g.order : idx + 1,
      })).filter((g: any) => Boolean(g.url));
    }

    if (body.videos !== undefined && Array.isArray(body.videos)) {
      updates.videos = body.videos.map((v: any, idx: number) => ({
        id: v.id || `vid-${Date.now().toString(36)}-${idx}`,
        title: cleanText(v.title, 150),
        url: sanitizeProjectUrl(v.url, 400),
        poster: sanitizeProjectUrl(v.poster, 400),
        type: v.type === 'file' ? 'file' : v.type === 'vimeo' ? 'vimeo' : v.type === 'youtube' ? 'youtube' : 'other',
        order: typeof v.order === 'number' ? v.order : idx + 1,
        position: v.position === 'before' ? 'before' : 'after',
      })).filter((v: any) => Boolean(v.url));
    }

    if (body.externalUrls !== undefined && Array.isArray(body.externalUrls)) {
      updates.externalUrls = body.externalUrls.map((u: any) => ({
        label: cleanText(u.label, 100),
        url: sanitizeProjectUrl(u.url, 300),
      })).filter((u: any) => Boolean(u.url));
    }

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

    dbAdminActivity.log({
      action: 'UPDATE_PROJECT',
      targetType: 'project',
      targetId: id,
      description: `Updated project: ${updated?.title}`,
      adminEmail: getAdminEmail(req),
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (err: any) {
    console.error('Error updating project:', err);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = authenticateAdminRequest(req, 'manage_projects');
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized. Admin session required.' }, { status: auth.status || 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Reorder action
    if (body.action === 'reorder' && Array.isArray(body.orderedIds)) {
      const reordered = dbProjects.reorder(body.orderedIds);
      dbAdminActivity.log({
        action: 'REORDER_PROJECTS',
        targetType: 'project',
        description: `Reordered ${body.orderedIds.length} projects`,
        adminEmail: getAdminEmail(req),
      });
      return NextResponse.json({ success: true, projects: reordered });
    }

    // Fast status / visibility / featured toggle
    if (body.id) {
      const updates: Partial<PortfolioProject> = {};
      if (body.visibility !== undefined) updates.visibility = body.visibility;
      if (body.featured !== undefined) updates.featured = Boolean(body.featured);
      if (body.status !== undefined) updates.status = cleanText(body.status, 100);

      const updated = dbProjects.update(body.id, updates);
      if (!updated) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      dbAdminActivity.log({
        action: 'TOGGLE_PROJECT_STATUS',
        targetType: 'project',
        targetId: body.id,
        description: `Toggled status/visibility on: ${updated.title}`,
        adminEmail: getAdminEmail(req),
      });

      return NextResponse.json({ success: true, project: updated });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    console.error('Error in project PATCH:', err);
    return NextResponse.json({ error: 'Failed to patch project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = authenticateAdminRequest(req, 'manage_projects');
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized. Admin session required.' }, { status: auth.status || 401 });
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

    const projectToDelete = dbProjects.getById(id);
    const title = projectToDelete?.title || id;

    const deleted = dbProjects.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found or already deleted' }, { status: 404 });
    }

    dbAdminActivity.log({
      action: 'DELETE_PROJECT',
      targetType: 'project',
      targetId: id,
      description: `Deleted project: ${title}`,
      adminEmail: getAdminEmail(req),
    });

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting project:', err);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

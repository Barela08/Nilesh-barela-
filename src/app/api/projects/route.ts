import { NextResponse } from 'next/server';
import { dbProjects } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = dbProjects.getAll();
    return NextResponse.json({ success: true, projects });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

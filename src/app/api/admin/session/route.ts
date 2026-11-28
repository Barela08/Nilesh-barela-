import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest, getAdminUsers } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = authenticateAdminRequest(req);
  if (!auth.authenticated || !auth.user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const users = getAdminUsers();
  const matched = users.find((u) => u.email === auth.user?.email);

  return NextResponse.json({
    authenticated: true,
    user: {
      id: matched?.id || 'usr-owner-01',
      name: matched?.name || 'Nilesh Barela (Owner)',
      email: auth.user.email,
      role: auth.user.role,
    },
  });
}

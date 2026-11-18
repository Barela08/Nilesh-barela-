import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || 'hackifypro@gmail.com';
    const expectedPass = process.env.ADMIN_PASSWORD || 'HackifyPro@2026!';

    if (email === expectedEmail && password === expectedPass) {
      // In production, sign a JWT or secure session cookie
      const token = `hp_admin_session_${Date.now()}`;
      
      const response = NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
        user: { email: expectedEmail, role: 'admin' },
        token,
      });

      response.cookies.set('hp_admin_auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid administrator credentials.' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Authentication failed.' },
      { status: 500 }
    );
  }
}

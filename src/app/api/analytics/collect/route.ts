import { NextRequest, NextResponse } from 'next/server';
import { dbAnalytics, dbProjects } from '@/lib/db';
import { cleanText } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const visitorId = cleanText(body.visitorId, 64) || 'anon_visitor';
    const sessionId = cleanText(body.sessionId, 64) || 'anon_session';
    const type = body.type === 'heartbeat' ? 'heartbeat' : body.type === 'conversion' ? 'conversion' : 'pageview';
    const path = cleanText(body.path, 200) || '/';
    const title = cleanText(body.title, 200);
    const referrer = cleanText(body.referrer, 300);
    
    let device: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    if (body.device === 'mobile' || body.device === 'tablet') {
      device = body.device;
    } else {
      const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';
      if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
        device = 'tablet';
      } else if (/mobile|iphone|ipod|android|blackberry|iemobile/i.test(userAgent)) {
        device = 'mobile';
      }
    }

    const browser = cleanText(body.browser, 50);
    const os = cleanText(body.os, 50);
    const utmSource = cleanText(body.utmSource, 100);
    const utmMedium = cleanText(body.utmMedium, 100);
    const utmCampaign = cleanText(body.utmCampaign, 100);

    const event = dbAnalytics.recordEvent({
      visitorId,
      sessionId,
      type,
      path,
      title,
      referrer,
      device,
      browser,
      os,
      utmSource,
      utmMedium,
      utmCampaign,
    });

    // If it's a project page view, check if we can increment project views
    if (type === 'pageview') {
      const projects = dbProjects.getAll();
      for (const p of projects) {
        if (path === `/portfolio/${p.slug}` || path.includes(p.slug)) {
          dbProjects.incrementViews(p.id);
          break;
        }
      }
    }

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (err: any) {
    console.error('Analytics collector error:', err);
    return NextResponse.json({ error: 'Failed to record analytics event' }, { status: 500 });
  }
}

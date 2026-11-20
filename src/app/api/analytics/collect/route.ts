import { NextRequest, NextResponse } from 'next/server';
import { dbAnalytics, dbProjects } from '@/lib/db';
import { dbVisitorIntelligence } from '@/lib/visitorIntelligence';
import { cleanText } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const visitorId = cleanText(body.visitorId, 64) || 'anon_visitor';
    const sessionId = cleanText(body.sessionId, 64) || 'anon_session';
    const type = cleanText(body.type, 30) || 'pageview';
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

    // 1. Handle Interaction Events (WhatsApp, Call, Demo clicks)
    if (type === 'interaction' && body.interactionType) {
      dbVisitorIntelligence.recordInteraction({
        visitorId,
        type: body.interactionType,
        targetUrl: cleanText(body.targetUrl, 300) || '',
        page: path,
      });
      return NextResponse.json({ success: true, message: 'Interaction recorded' });
    }

    // 2. Handle Form Conversion Funnel Events (viewed, started, abandoned, submitted)
    if (type === 'form_stage' && body.formType && body.stage) {
      const record = dbVisitorIntelligence.recordFormStage({
        visitorId,
        sessionId,
        formType: body.formType,
        formPage: path,
        stage: body.stage,
        leadId: body.leadId ? cleanText(body.leadId, 64) : undefined,
      });
      return NextResponse.json({ success: true, formRecordId: record.id });
    }

    // 3. Regular Pageview / Heartbeat Event
    const event = dbAnalytics.recordEvent({
      visitorId,
      sessionId,
      type: type === 'heartbeat' ? 'heartbeat' : type === 'conversion' ? 'conversion' : 'pageview',
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

    // Record to Visitor Intelligence Profile
    dbVisitorIntelligence.recordVisit({
      visitorId,
      sessionId,
      path,
      title,
      referrer,
      device,
      browser,
      os,
    });

    // Increment Project Views if project page
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

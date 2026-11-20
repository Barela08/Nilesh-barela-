import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { dbMedia, dbAdminActivity } from '@/lib/db';
import { verifyAdminSessionToken, cleanText } from '@/lib/security';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  // Videos
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska',
  // Documents
  'application/pdf',
]);

const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_VIDEO_SIZE = 60 * 1024 * 1024; // 60MB

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || req.cookies.get('hp_admin_auth')?.value;
    const authCheck = verifyAdminSessionToken(token || '');

    if (!token || !authCheck.valid) {
      return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
    }

    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const file = formData.get('file') as File | null;
    const titleCustom = cleanText(formData.get('title') as string, 150);
    const altCustom = cleanText(formData.get('altText') as string, 200);
    const captionCustom = cleanText(formData.get('caption') as string, 300);

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No valid file provided' }, { status: 400 });
    }

    // Validate MIME type
    const mimeType = file.type || 'application/octet-stream';
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: `Unsupported file type (${mimeType}). Supported: PNG, JPG, WebP, SVG, MP4, WebM, PDF.` },
        { status: 400 }
      );
    }

    // Validate file size
    const isVideo = mimeType.startsWith('video/');
    const isDoc = mimeType === 'application/pdf';
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      const mb = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { error: `File too large. Maximum allowed size is ${mb}MB.` },
        { status: 400 }
      );
    }

    // Sanitize filename & create unique name
    const originalName = file.name || 'upload';
    const ext = path.extname(originalName).toLowerCase() || (isVideo ? '.mp4' : isDoc ? '.pdf' : '.png');
    const baseClean = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'file';
    
    const uniqueFilename = `${baseClean}-${Date.now().toString(36)}${ext}`;
    const destinationPath = path.join(UPLOADS_DIR, uniqueFilename);

    // Write file to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destinationPath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;
    const mediaType: 'image' | 'video' | 'document' | 'other' = isVideo
      ? 'video'
      : isDoc
      ? 'document'
      : mimeType.startsWith('image/')
      ? 'image'
      : 'other';

    // Store in Media Database
    const mediaItem = dbMedia.create({
      filename: uniqueFilename,
      url: publicUrl,
      storagePath: `public/uploads/${uniqueFilename}`,
      mediaType,
      mimeType,
      fileSize: file.size,
      title: titleCustom || baseClean.replace(/-/g, ' ').toUpperCase(),
      altText: altCustom || `${baseClean.replace(/-/g, ' ')} asset`,
      caption: captionCustom || '',
    });

    dbAdminActivity.log({
      action: 'UPLOAD_MEDIA',
      targetType: 'media',
      targetId: mediaItem.id,
      description: `Uploaded new ${mediaType}: ${uniqueFilename} (${(file.size / 1024).toFixed(1)} KB)`,
      adminEmail: authCheck.email || 'admin@hackifypro.com',
    });

    return NextResponse.json({
      success: true,
      media: mediaItem,
    });
  } catch (err: any) {
    console.error('Upload media error:', err);
    return NextResponse.json({ error: 'Failed to upload media file' }, { status: 500 });
  }
}

interface RateLimitRecord {
  count: number;
  firstRequest: number;
  lastRequest: number;
  lastHash?: string;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up old entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now - record.lastRequest > 3600000) { // 1 hour
      rateLimitMap.delete(key);
    }
  }
}, 900000);

export function checkRateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 10 * 60 * 1000 // 10 minutes
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    });
    return { allowed: true, remaining: limit - 1 };
  }

  // Reset window if expired
  if (now - record.firstRequest > windowMs) {
    record.count = 1;
    record.firstRequest = now;
    record.lastRequest = now;
    return { allowed: true, remaining: limit - 1 };
  }

  // Check limit
  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  record.lastRequest = now;
  return { allowed: true, remaining: limit - record.count };
}

export function checkDuplicateSubmission(
  ip: string,
  submissionHash: string,
  cooldownMs: number = 60 * 1000 // 1 minute duplicate lock
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) return false;

  if (record.lastHash === submissionHash && now - record.lastRequest < cooldownMs) {
    return true; // Is duplicate
  }

  record.lastHash = submissionHash;
  return false;
}

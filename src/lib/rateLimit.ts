interface RateLimitRecord {
  count: number;
  firstRequest: number;
  lastRequest: number;
  lastHash?: string;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const loginFailedAttemptsMap = new Map<string, { attempts: number; lockedUntil: number }>();

// Periodic memory hygiene: sweeps records older than 1 hour every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now - record.lastRequest > 3600000) {
        rateLimitMap.delete(key);
      }
    }
    for (const [ip, lock] of loginFailedAttemptsMap.entries()) {
      if (now > lock.lockedUntil && lock.attempts === 0) {
        loginFailedAttemptsMap.delete(ip);
      }
    }
  }, 600000);
}

/**
 * IP rate limiter with sliding window.
 */
export function checkRateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 10 * 60 * 1000
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

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  record.lastRequest = now;
  return { allowed: true, remaining: limit - record.count };
}

/**
 * Checks for identical spam submissions within cooldown window.
 */
export function checkDuplicateSubmission(
  ip: string,
  submissionHash: string,
  cooldownMs: number = 60 * 1000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) return false;

  if (record.lastHash === submissionHash && now - record.lastRequest < cooldownMs) {
    return true;
  }

  record.lastHash = submissionHash;
  return false;
}

/**
 * Strict Anti-Brute-Force Lockout for Admin Authentication.
 * Locks out an IP for 15 minutes after 5 consecutive failed login attempts.
 */
export function checkLoginBruteForce(ip: string): { locked: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const record = loginFailedAttemptsMap.get(ip);

  if (!record) return { locked: false, retryAfterSeconds: 0 };

  if (now < record.lockedUntil) {
    const remaining = Math.ceil((record.lockedUntil - now) / 1000);
    return { locked: true, retryAfterSeconds: remaining };
  }

  return { locked: false, retryAfterSeconds: 0 };
}

export function recordLoginAttempt(ip: string, success: boolean): void {
  const now = Date.now();
  if (success) {
    loginFailedAttemptsMap.delete(ip);
    return;
  }

  const record = loginFailedAttemptsMap.get(ip) || { attempts: 0, lockedUntil: 0 };
  record.attempts += 1;

  if (record.attempts >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000; // 15-minute lock
    record.attempts = 0; // reset for next round after lockout expires
  }

  loginFailedAttemptsMap.set(ip, record);
}

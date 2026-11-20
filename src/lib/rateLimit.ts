interface RateLimitRecord {
  count: number;
  firstRequest: number;
  lastRequest: number;
  lastHash?: string;
}

interface BruteForceRecord {
  attempts: number;
  lockedUntil: number;
  lastAttempt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const loginFailedAttemptsMap = new Map<string, BruteForceRecord>();

// Periodic memory hygiene: sweeps records older than 1 hour every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now - record.lastRequest > 3600000) {
        rateLimitMap.delete(key);
      }
    }
    for (const [key, lock] of loginFailedAttemptsMap.entries()) {
      if (now > lock.lockedUntil && now - lock.lastAttempt > 3600000) {
        loginFailedAttemptsMap.delete(key);
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
 * Checks for duplicate spam submissions within cooldown window.
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
 * Progressive Cooldown & Account-Level Anti-Brute-Force Protection.
 * 1-3 attempts: Instant retry allowed
 * 4 attempts: 30-second cooldown
 * 5-6 attempts: 2-minute cooldown
 * 7-9 attempts: 5-minute cooldown
 * 10+ attempts: 15-minute lock
 */
export function checkLoginBruteForce(
  ip: string,
  accountEmail?: string
): { locked: boolean; retryAfterSeconds: number; attempts: number } {
  const now = Date.now();
  const ipRecord = loginFailedAttemptsMap.get(ip);
  const accountKey = accountEmail ? `acct:${accountEmail.toLowerCase()}` : null;
  const acctRecord = accountKey ? loginFailedAttemptsMap.get(accountKey) : null;

  // Check IP lock
  if (ipRecord && now < ipRecord.lockedUntil) {
    const remaining = Math.ceil((ipRecord.lockedUntil - now) / 1000);
    return { locked: true, retryAfterSeconds: remaining, attempts: ipRecord.attempts };
  }

  // Check Account lock
  if (acctRecord && now < acctRecord.lockedUntil) {
    const remaining = Math.ceil((acctRecord.lockedUntil - now) / 1000);
    return { locked: true, retryAfterSeconds: remaining, attempts: acctRecord.attempts };
  }

  return { locked: false, retryAfterSeconds: 0, attempts: Math.max(ipRecord?.attempts || 0, acctRecord?.attempts || 0) };
}

export function recordLoginAttempt(ip: string, accountEmail?: string, success: boolean = false): void {
  const now = Date.now();
  const accountKey = accountEmail ? `acct:${accountEmail.toLowerCase()}` : null;

  if (success) {
    loginFailedAttemptsMap.delete(ip);
    if (accountKey) loginFailedAttemptsMap.delete(accountKey);
    return;
  }

  // Increment IP failed attempts
  const ipRec = loginFailedAttemptsMap.get(ip) || { attempts: 0, lockedUntil: 0, lastAttempt: now };
  ipRec.attempts += 1;
  ipRec.lastAttempt = now;

  let cooldownMs = 0;
  if (ipRec.attempts === 4) cooldownMs = 30 * 1000; // 30 sec
  else if (ipRec.attempts >= 5 && ipRec.attempts <= 6) cooldownMs = 2 * 60 * 1000; // 2 min
  else if (ipRec.attempts >= 7 && ipRec.attempts <= 9) cooldownMs = 5 * 60 * 1000; // 5 min
  else if (ipRec.attempts >= 10) cooldownMs = 15 * 60 * 1000; // 15 min

  if (cooldownMs > 0) {
    ipRec.lockedUntil = now + cooldownMs;
  }
  loginFailedAttemptsMap.set(ip, ipRec);

  // Increment Account failed attempts if account provided
  if (accountKey) {
    const acctRec = loginFailedAttemptsMap.get(accountKey) || { attempts: 0, lockedUntil: 0, lastAttempt: now };
    acctRec.attempts += 1;
    acctRec.lastAttempt = now;
    if (cooldownMs > 0) acctRec.lockedUntil = now + cooldownMs;
    loginFailedAttemptsMap.set(accountKey, acctRec);
  }
}

/**
 * Emergency Unlock Mechanism for Owner Recovery.
 */
export function unlockAdminAccount(identifier?: string): void {
  if (!identifier) {
    loginFailedAttemptsMap.clear();
    return;
  }
  loginFailedAttemptsMap.delete(identifier);
  loginFailedAttemptsMap.delete(`acct:${identifier.toLowerCase()}`);
}

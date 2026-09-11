/**
 * Rate limit по ключу (обычно IP) — в памяти процесса. Достаточно для одного
 * сервера/долгоживущего рантайма; на serverless с несколькими холодными
 * инстансами не даёт единой картины — это осознанное упрощение, реальная
 * защита на масштабе потребует общего хранилища (Redis/Upstash), что сейчас
 * не подключено (новая зависимость не входила в задачу этапа).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX = 5;
const MAX_TRACKED_KEYS = 5000;

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs?: number;
}

function pruneExpired(now: number): void {
  if (buckets.size < MAX_TRACKED_KEYS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  options: { windowMs?: number; max?: number } = {},
): RateLimitResult {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const max = options.max ?? DEFAULT_MAX;
  const now = Date.now();

  pruneExpired(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= max) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true };
}

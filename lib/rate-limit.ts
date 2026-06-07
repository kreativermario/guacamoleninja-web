const requests = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const LIMIT = 10;

export function checkRateLimit(userId: string): void {
  const now = Date.now();
  const prev = requests.get(userId) ?? [];
  const recent = prev.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    throw new Error("Too many requests. Please wait before trying again.");
  }
  requests.set(userId, [...recent, now]);
}

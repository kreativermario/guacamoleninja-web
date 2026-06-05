type Level = "info" | "warn" | "error";

function log(level: Level, ctx: string, msg: string, meta?: Record<string, unknown>): void {
  const entry: Record<string, unknown> = { ts: new Date().toISOString(), level, ctx, msg };
  if (meta) entry.meta = meta;
  if (level === "error") console.error(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}

export const logger = {
  info:  (ctx: string, msg: string, meta?: Record<string, unknown>) => log("info",  ctx, msg, meta),
  warn:  (ctx: string, msg: string, meta?: Record<string, unknown>) => log("warn",  ctx, msg, meta),
  error: (ctx: string, msg: string, meta?: Record<string, unknown>) => log("error", ctx, msg, meta),
};

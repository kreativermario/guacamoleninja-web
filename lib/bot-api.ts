import { logger } from "./logger";

const BOT_API_URL    = (process.env.BOT_API_URL ?? "http://localhost:3002").replace(/\/$/, "");
const BOT_API_SECRET = process.env.BOT_API_SECRET ?? "";

export type BotGuildConfig = {
  guildId: string;
  prefix: string;
  timezone: string;
  disabledCommands: string[];
  updatedAt: string;
};

export type BotGuild = {
  id: string;
  name: string;
  iconHash: string | null;
  joinedAt: string;
  leftAt: null;
  config: BotGuildConfig | null;
};

export type BotGuildIdsResult =
  | { ok: true; ids: Set<string> }
  | { ok: false; error: string };

function headers() {
  return {
    Authorization: `Bearer ${BOT_API_SECRET}`,
    "Content-Type": "application/json",
  };
}

/** Returns the set of guild IDs where the bot is currently active. */
export async function getBotGuildIds(): Promise<BotGuildIdsResult> {
  const t = Date.now();
  try {
    const res = await fetch(`${BOT_API_URL}/guilds`, {
      headers: headers(),
      cache: "no-store",
    });
    const ms = Date.now() - t;
    if (res.status === 401) {
      logger.warn("bot-api", "unauthorized — check BOT_API_SECRET", { ms });
      return { ok: false, error: "Bot API: unauthorized (check BOT_API_SECRET)" };
    }
    if (!res.ok) {
      logger.warn("bot-api", "getBotGuildIds non-ok", { status: res.status, ms });
      return { ok: false, error: `Bot API: HTTP ${res.status}` };
    }
    const data = (await res.json()) as { guilds: { id: string }[] };
    logger.info("bot-api", "getBotGuildIds ok", { count: data.guilds.length, ms });
    return { ok: true, ids: new Set(data.guilds.map((g) => g.id)) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error("bot-api", "getBotGuildIds failed", { err: msg, ms: Date.now() - t });
    return { ok: false, error: `Bot API unreachable: ${msg}` };
  }
}

/** Returns guild + config, or null if the bot is not in that guild. */
export async function getBotGuild(guildId: string): Promise<BotGuild | null> {
  const t = Date.now();
  try {
    const res = await fetch(`${BOT_API_URL}/guilds/${guildId}`, {
      headers: headers(),
      cache: "no-store",
    });
    const ms = Date.now() - t;
    if (res.status === 404) {
      logger.info("bot-api", "getBotGuild not found", { guildId, ms });
      return null;
    }
    if (!res.ok) {
      logger.warn("bot-api", "getBotGuild non-ok", { guildId, status: res.status, ms });
      return null;
    }
    logger.info("bot-api", "getBotGuild ok", { guildId, ms });
    return ((await res.json()) as { guild: BotGuild }).guild;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error("bot-api", "getBotGuild failed", { guildId, err: msg, ms: Date.now() - t });
    return null;
  }
}

/** Updates one or more config fields for a guild. */
export async function patchBotGuildConfig(
  guildId: string,
  data: Partial<Pick<BotGuildConfig, "prefix" | "timezone" | "disabledCommands">>
): Promise<BotGuildConfig> {
  const t = Date.now();
  const res = await fetch(`${BOT_API_URL}/guilds/${guildId}/config`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const ms = Date.now() - t;
  if (!res.ok) {
    const msg = await res.text().catch(() => res.status.toString());
    logger.error("bot-api", "patchBotGuildConfig failed", { guildId, status: res.status, err: msg, ms });
    throw new Error(`Bot API error: ${msg}`);
  }
  logger.info("bot-api", "patchBotGuildConfig ok", { guildId, ms });
  return ((await res.json()) as { config: BotGuildConfig }).config;
}

const BOT_API_URL = (process.env.BOT_API_URL ?? "http://localhost:3002").replace(/\/$/, "");
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

function headers() {
  return {
    Authorization: `Bearer ${BOT_API_SECRET}`,
    "Content-Type": "application/json",
  };
}

export type BotGuildIdsResult =
  | { ok: true; ids: Set<string> }
  | { ok: false; error: string };

/** Returns the set of guild IDs where the bot is currently active. */
export async function getBotGuildIds(): Promise<BotGuildIdsResult> {
  try {
    const res = await fetch(`${BOT_API_URL}/guilds`, {
      headers: headers(),
      cache: "no-store",
    });
    if (res.status === 401) return { ok: false, error: "Bot API: unauthorized (check BOT_API_SECRET)" };
    if (!res.ok) return { ok: false, error: `Bot API: HTTP ${res.status}` };
    const data = (await res.json()) as { guilds: { id: string }[] };
    return { ok: true, ids: new Set(data.guilds.map((g) => g.id)) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[bot-api] getBotGuildIds failed:", msg);
    return { ok: false, error: `Bot API unreachable: ${msg}` };
  }
}

/** Returns guild + config, or null if the bot is not in that guild. */
export async function getBotGuild(guildId: string): Promise<BotGuild | null> {
  try {
    const res = await fetch(`${BOT_API_URL}/guilds/${guildId}`, {
      headers: headers(),
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Bot API ${res.status}`);
    return ((await res.json()) as { guild: BotGuild }).guild;
  } catch (err) {
    console.error("[bot-api] getBotGuild failed:", err);
    return null;
  }
}

/** Updates one or more config fields for a guild. */
export async function patchBotGuildConfig(
  guildId: string,
  data: Partial<Pick<BotGuildConfig, "prefix" | "timezone" | "disabledCommands">>
): Promise<BotGuildConfig> {
  const res = await fetch(`${BOT_API_URL}/guilds/${guildId}/config`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(data),
    cache: "no-store",
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.status.toString());
    throw new Error(`Bot API error: ${msg}`);
  }
  return ((await res.json()) as { config: BotGuildConfig }).config;
}

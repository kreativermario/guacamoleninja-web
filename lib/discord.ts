import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { logger } from "./logger";

const MANAGE_GUILD = BigInt(0x20);
const DISCORD_CLIENT_ID     = process.env.DISCORD_CLIENT_ID ?? "";
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET ?? "";

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  permissions: string;
}

/**
 * Refreshes the Discord OAuth token if it expires within 5 minutes.
 * Returns the current (or freshly refreshed) access token.
 */
async function maybeRefreshToken(userId: string): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "discord" },
    select: { id: true, access_token: true, refresh_token: true, expires_at: true },
  });
  if (!account?.access_token) return null;

  const expiresAt = account.expires_at ?? 0;
  const bufferSecs = 300; // refresh 5 min early
  if (expiresAt > Math.floor(Date.now() / 1000) + bufferSecs) {
    return account.access_token;
  }
  if (!account.refresh_token) {
    logger.warn("discord", "token expired but no refresh_token", { userId });
    return account.access_token;
  }

  try {
    const t = Date.now();
    const res = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id:     DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type:    "refresh_token",
        refresh_token: account.refresh_token,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const ms = Date.now() - t;

    if (!res.ok) {
      logger.warn("discord", "token refresh failed", { userId, status: res.status, ms });
      return account.access_token;
    }

    const data = (await res.json()) as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };

    await prisma.account.update({
      where: { id: account.id },
      data: {
        access_token:  data.access_token,
        refresh_token: data.refresh_token,
        expires_at:    Math.floor(Date.now() / 1000) + data.expires_in,
      },
    });

    logger.info("discord", "token refreshed", { userId, ms });
    return data.access_token;
  } catch (err) {
    logger.error("discord", "token refresh error", { userId, err: String(err) });
    return account.access_token;
  }
}

// Fetches from Discord — throws on error so unstable_cache does not store failures.
const fetchManagedGuilds = unstable_cache(
  async (userId: string, accessToken: string): Promise<DiscordGuild[]> => {
    const t = Date.now();
    const res = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const ms = Date.now() - t;

    if (!res.ok) {
      logger.warn("discord", "getUserGuilds non-ok", { userId, status: res.status, ms });
      throw new Error(`Discord API ${res.status}`);
    }

    const guilds: DiscordGuild[] = await res.json();
    const filtered = guilds.filter(
      (g) => (BigInt(g.permissions) & MANAGE_GUILD) === MANAGE_GUILD,
    );
    logger.info("discord", "getUserGuilds ok", { userId, total: guilds.length, managed: filtered.length, ms });
    return filtered;
  },
  ["discord-managed-guilds"],
  { revalidate: 60 },
);

export async function getUserGuilds(userId: string): Promise<DiscordGuild[]> {
  const accessToken = await maybeRefreshToken(userId);
  if (!accessToken) return [];

  try {
    return await fetchManagedGuilds(userId, accessToken);
  } catch {
    return [];
  }
}

export function guildIconUrl(id: string, hash: string | null): string | null {
  if (!hash) return null;
  const ext = hash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/icons/${id}/${hash}.${ext}`;
}

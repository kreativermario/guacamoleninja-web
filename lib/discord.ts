import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { logger } from "./logger";

const MANAGE_GUILD = BigInt(0x20);

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  permissions: string;
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
  const account = await prisma.account.findFirst({
    where: { userId, provider: "discord" },
    select: { access_token: true },
  });
  if (!account?.access_token) return [];

  try {
    return await fetchManagedGuilds(userId, account.access_token);
  } catch {
    return [];
  }
}

export function guildIconUrl(id: string, hash: string | null): string | null {
  if (!hash) return null;
  const ext = hash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/icons/${id}/${hash}.${ext}`;
}

import { prisma } from "./prisma";

const MANAGE_GUILD = BigInt(0x20);

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  permissions: string;
}

export async function getUserGuilds(userId: string): Promise<DiscordGuild[]> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "discord" },
    select: { access_token: true },
  });
  if (!account?.access_token) return [];

  const res = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: { Authorization: `Bearer ${account.access_token}` },
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return [];

  const guilds: DiscordGuild[] = await res.json();
  return guilds.filter(
    (g) => (BigInt(g.permissions) & MANAGE_GUILD) === MANAGE_GUILD,
  );
}

export function guildIconUrl(id: string, hash: string | null): string | null {
  if (!hash) return null;
  const ext = hash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/icons/${id}/${hash}.${ext}`;
}

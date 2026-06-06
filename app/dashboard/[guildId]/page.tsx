import { auth } from "@/auth";
import { getUserGuilds, guildIconUrl } from "@/lib/discord";
import { getBotGuild, getBotGuildChannels, getBotGuildStats, getBotAuditLog } from "@/lib/bot-api";
import { redirect, notFound } from "next/navigation";
import { GuildLayout } from "./_components/GuildLayout";

export const dynamic = "force-dynamic";

export default async function GuildPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [guilds, botGuild, channels, stats, auditLog] = await Promise.all([
    getUserGuilds(session.user.id),
    getBotGuild(guildId),
    getBotGuildChannels(guildId),
    getBotGuildStats(guildId),
    getBotAuditLog(guildId),
  ]);

  if (!guilds.some((g) => g.id === guildId)) notFound();
  if (!botGuild) notFound();

  const config = botGuild.config ?? null;
  const welcome = botGuild.welcomeConfig ?? null;
  const icon = guildIconUrl(guildId, botGuild.iconHash);

  return (
    <GuildLayout
      guildId={guildId}
      guildName={botGuild.name}
      guildIconUrl={icon}
      config={config ? {
        prefix: config.prefix ?? "!",
        timezone: config.timezone ?? "UTC",
        disabledCommands: config.disabledCommands ?? [],
      } : null}
      welcome={welcome ? {
        enabled: welcome.enabled ?? false,
        channelId: welcome.channelId ?? null,
        message: welcome.message ?? "",
      } : null}
      channels={channels.map((ch) => ({ id: ch.id, name: ch.name }))}
      stats={stats ? {
        total: stats.total,
        commands: stats.commands.map((c) => ({ name: c.name, count: c.count })),
      } : null}
      auditLog={auditLog.map((e) => ({
        id: e.id,
        action: e.action,
        actorName: e.actorName,
        createdAt: new Date(e.createdAt as string | Date).toISOString(),
        changes: e.changes as Record<string, unknown>,
      }))}
      userName={session.user.name ?? ""}
      userImage={session.user.image ?? null}
    />
  );
}

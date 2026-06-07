import { auth } from "@/auth";
import { getUserGuilds, guildIconUrl } from "@/lib/discord";
import { getBotGuild, getBotGuildChannels, getBotGuildIds } from "@/lib/bot-api";
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

  const [guilds, botGuild, channels, botGuildIdsResult] = await Promise.all([
    getUserGuilds(session.user.id),
    getBotGuild(guildId),
    getBotGuildChannels(guildId),
    getBotGuildIds(),
  ]);

  const botGuildIds = botGuildIdsResult.ok ? botGuildIdsResult.ids : new Set<string>();
  const switcherGuilds = guilds
    .filter((g) => botGuildIds.has(g.id))
    .map((g) => ({ id: g.id, name: g.name, iconUrl: guildIconUrl(g.id, g.icon) }));

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
      guilds={switcherGuilds}
      channels={channels.map((ch) => ({ id: ch.id, name: ch.name }))}
      userName={session.user.name ?? ""}
      userImage={session.user.image ?? null}
    />
  );
}

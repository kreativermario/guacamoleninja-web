"use server";

import { auth } from "@/auth";
import { getUserGuilds } from "@/lib/discord";
import { patchBotGuildConfig, patchBotWelcomeConfig, getBotGuildStats, getBotAuditLog } from "@/lib/bot-api";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const ALL_COMMANDS = ["weather", "server", "config", "uptime"] as const;

const SettingsSchema = z.object({
  guildId: z.string().min(1),
  prefix: z.string().min(1).max(5),
  timezone: z.string().min(1).max(64),
});

const WelcomeSchema = z.object({
  guildId: z.string().min(1),
  enabled: z.enum(["on", "off"]).transform((v) => v === "on"),
  channelId: z.string().max(100),
  message: z.string().min(1).max(500),
});

async function assertAccess(userId: string, guildId: string) {
  const guilds = await getUserGuilds(userId);
  if (!guilds.some((g) => g.id === guildId)) throw new Error("No access to this server");
}

async function getActor(): Promise<{ actorId: string; actorName: string } | undefined> {
  const session = await auth();
  const discordId = (session?.user as { id?: string; discordId?: string } | undefined)?.discordId;
  if (!discordId) return undefined;
  return { actorId: discordId, actorName: session?.user?.name ?? "Unknown" };
}

export async function fetchGuildStats(guildId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await assertAccess(session.user.id, guildId);
  const stats = await getBotGuildStats(guildId);
  if (!stats) return null;
  return { total: stats.total, commands: stats.commands.map((c) => ({ name: c.name, count: c.count })) };
}

export async function fetchGuildAuditLog(guildId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await assertAccess(session.user.id, guildId);
  const logs = await getBotAuditLog(guildId);
  return logs.map((e) => ({
    id: e.id,
    action: e.action,
    actorName: e.actorName,
    createdAt: new Date(e.createdAt as string | Date).toISOString(),
    changes: e.changes as Record<string, unknown>,
  }));
}

export async function updateGuildConfig(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  checkRateLimit(session.user.id);

  const parsed = SettingsSchema.safeParse({
    guildId: formData.get("guildId"),
    prefix: formData.get("prefix"),
    timezone: formData.get("timezone"),
  });
  if (!parsed.success) throw new Error("Invalid input");

  const { guildId, prefix, timezone } = parsed.data;
  await assertAccess(session.user.id, guildId);

  const actor = await getActor();
  await patchBotGuildConfig(guildId, { prefix, timezone }, actor);

  revalidatePath(`/dashboard/${guildId}`);
}

export async function updateCommandsConfig(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  checkRateLimit(session.user.id);

  const guildId = formData.get("guildId");
  if (typeof guildId !== "string" || !guildId) throw new Error("Missing guildId");

  await assertAccess(session.user.id, guildId);

  const enabledCommands = formData.getAll("command") as string[];
  const disabledCommands = ALL_COMMANDS.filter((c) => !enabledCommands.includes(c));

  const actor = await getActor();
  await patchBotGuildConfig(guildId, { disabledCommands }, actor);

  revalidatePath(`/dashboard/${guildId}`);
}

export async function updateWelcomeConfig(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  checkRateLimit(session.user.id);

  const parsed = WelcomeSchema.safeParse({
    guildId: formData.get("guildId"),
    enabled: formData.get("enabled") ?? "off",
    channelId: formData.get("channelId") ?? "",
    message: formData.get("message"),
  });
  if (!parsed.success) throw new Error("Invalid input");

  const { guildId, enabled, channelId, message } = parsed.data;
  await assertAccess(session.user.id, guildId);

  const actor = await getActor();
  await patchBotWelcomeConfig(guildId, { enabled, channelId, message }, actor);

  revalidatePath(`/dashboard/${guildId}`);
}

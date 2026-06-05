"use server";

import { auth } from "@/auth";
import { getUserGuilds } from "@/lib/discord";
import { patchBotGuildConfig, patchBotWelcomeConfig } from "@/lib/bot-api";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

export async function updateGuildConfig(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

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

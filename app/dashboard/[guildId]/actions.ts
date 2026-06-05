"use server";

import { auth } from "@/auth";
import { getUserGuilds } from "@/lib/discord";
import { patchBotGuildConfig } from "@/lib/bot-api";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ALL_COMMANDS = ["weather", "server", "config", "uptime"] as const;

const SettingsSchema = z.object({
  guildId: z.string().min(1),
  prefix: z.string().min(1).max(5),
  timezone: z.string().min(1).max(64),
});

async function assertAccess(userId: string, guildId: string) {
  const guilds = await getUserGuilds(userId);
  if (!guilds.some((g) => g.id === guildId)) throw new Error("No access to this server");
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
  await patchBotGuildConfig(guildId, { prefix, timezone });

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

  await patchBotGuildConfig(guildId, { disabledCommands });

  revalidatePath(`/dashboard/${guildId}`);
}

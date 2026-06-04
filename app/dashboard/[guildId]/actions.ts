"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserGuilds } from "@/lib/discord";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ConfigSchema = z.object({
  guildId: z.string().min(1),
  prefix: z.string().min(1).max(5),
  timezone: z.string().min(1).max(64),
});

export async function updateGuildConfig(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = {
    guildId: formData.get("guildId"),
    prefix: formData.get("prefix"),
    timezone: formData.get("timezone"),
  };

  const parsed = ConfigSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid input");

  const { guildId, prefix, timezone } = parsed.data;

  const guilds = await getUserGuilds(session.user.id);
  const hasAccess = guilds.some((g) => g.id === guildId);
  if (!hasAccess) throw new Error("No access to this server");

  await prisma.guildConfig.upsert({
    where: { guildId },
    update: { prefix, timezone },
    create: { guildId, prefix, timezone },
  });

  revalidatePath(`/dashboard/${guildId}`);
}

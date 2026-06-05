import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify guilds" } },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      const account = await prisma.account.findFirst({
        where: { userId: user.id, provider: "discord" },
        select: { providerAccountId: true },
      });
      (session.user as { id: string; discordId?: string }).discordId = account?.providerAccountId;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

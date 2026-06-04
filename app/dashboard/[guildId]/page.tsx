import { auth } from "@/auth";
import { getUserGuilds, guildIconUrl } from "@/lib/discord";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { updateGuildConfig } from "./actions";

export default async function GuildPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const guilds = await getUserGuilds(session.user.id);
  const guild = guilds.find((g) => g.id === guildId);
  if (!guild) notFound();

  const [dbGuild, config] = await Promise.all([
    prisma.guild.findUnique({ where: { id: guildId } }),
    prisma.guildConfig.findUnique({ where: { guildId } }),
  ]);

  const icon = guildIconUrl(guildId, guild.icon);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        borderBottom: "1px solid var(--border)",
        background: "rgba(13,13,13,0.9)", backdropFilter: "blur(12px)",
        padding: "0 1.5rem",
        display: "flex", alignItems: "center", gap: "1rem",
        height: "56px",
      }}>
        <Link href="/dashboard" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.85rem" }}>
          ← Servers
        </Link>
        <span style={{ color: "var(--border)" }}>/</span>
        {icon && <img src={icon} alt="" style={{ width: 22, height: 22, borderRadius: "50%" }} />}
        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{guild.name}</span>
      </nav>

      <main style={{ flex: 1, maxWidth: "560px", margin: "0 auto", padding: "2.5rem 1.5rem", width: "100%" }}>
        {!dbGuild ? (
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "10px", padding: "1.5rem", textAlign: "center",
          }}>
            <p style={{ color: "var(--muted)", marginBottom: "1rem", fontSize: "0.9rem" }}>
              The bot hasn&apos;t joined this server yet, or hasn&apos;t synced its data.
            </p>
            <a
              href={`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=66448710&scope=bot+applications.commands&guild_id=${guildId}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "var(--primary-dark)", color: "#fff",
                padding: "0.5rem 1rem", borderRadius: "7px",
                textDecoration: "none", fontWeight: 600, fontSize: "0.875rem",
              }}
            >
              Add Bot to Server
            </a>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.35rem" }}>
              Server Settings
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
              Changes take effect within a few seconds on the bot.
            </p>

            <form action={updateGuildConfig} style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "10px", padding: "1.5rem",
              display: "flex", flexDirection: "column", gap: "1.25rem",
            }}>
              <input type="hidden" name="guildId" value={guildId} />

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>
                  Prefix
                </label>
                <input
                  name="prefix"
                  defaultValue={config?.prefix ?? "!"}
                  maxLength={5}
                  required
                  style={{
                    background: "var(--bg)", border: "1px solid var(--border)",
                    borderRadius: "6px", padding: "0.55rem 0.75rem",
                    color: "var(--text)", fontSize: "0.9rem", fontFamily: "inherit",
                    width: "100%",
                  }}
                />
                <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>1–5 characters</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>
                  Timezone
                </label>
                <input
                  name="timezone"
                  defaultValue={config?.timezone ?? "UTC"}
                  maxLength={64}
                  required
                  placeholder="e.g. Europe/Lisbon"
                  style={{
                    background: "var(--bg)", border: "1px solid var(--border)",
                    borderRadius: "6px", padding: "0.55rem 0.75rem",
                    color: "var(--text)", fontSize: "0.9rem", fontFamily: "inherit",
                    width: "100%",
                  }}
                />
                <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                  IANA timezone name — see{" "}
                  <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>
                    timezone list
                  </a>
                </span>
              </div>

              <button
                type="submit"
                style={{
                  background: "var(--primary-dark)", color: "#fff",
                  padding: "0.6rem 1.25rem", borderRadius: "7px",
                  border: "none", cursor: "pointer",
                  fontWeight: 700, fontSize: "0.875rem",
                  fontFamily: "inherit", alignSelf: "flex-start",
                }}
              >
                Save Changes
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

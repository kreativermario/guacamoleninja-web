import { auth } from "@/auth";
import { getUserGuilds, guildIconUrl } from "@/lib/discord";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? "";
const INVITE_BASE = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=66448710&scope=bot+applications.commands`;

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [guilds, botGuilds] = await Promise.all([
    getUserGuilds(session.user.id),
    prisma.guild.findMany({ where: { leftAt: null }, select: { id: true } }),
  ]);

  const botGuildIds = new Set(botGuilds.map((g) => g.id));

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        borderBottom: "1px solid var(--border)",
        background: "rgba(13,13,13,0.9)", backdropFilter: "blur(12px)",
        padding: "0 1.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "56px",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "inherit" }}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
            style={{ width: 22, height: 22, color: "var(--primary)" }} aria-hidden="true">
            <polygon points="50,4 62,38 96,50 62,62 50,96 38,62 4,50 38,38" fill="currentColor" />
            <circle cx="50" cy="50" r="11" fill="var(--bg)" />
            <circle cx="50" cy="50" r="5.5" fill="currentColor" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>guacamoleninja</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {session.user.image && (
            <img
              src={session.user.image}
              alt={session.user.name ?? ""}
              style={{ width: 28, height: 28, borderRadius: "50%", border: "1.5px solid var(--border)" }}
            />
          )}
          <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{session.user.name}</span>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button type="submit" style={{
              background: "none", border: "1px solid var(--border)", color: "var(--muted)",
              padding: "0.3rem 0.7rem", borderRadius: "6px", cursor: "pointer",
              fontSize: "0.8rem", fontFamily: "inherit",
            }}>Sign out</button>
          </form>
        </div>
      </nav>

      <main style={{ flex: 1, maxWidth: "960px", margin: "0 auto", padding: "2.5rem 1.5rem", width: "100%" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.4rem" }}>
          Your Servers
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
          Servers where you have Manage Server permission.
        </p>

        {guilds.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            No servers found, or your Discord token has expired.{" "}
            <Link href="/login" style={{ color: "var(--primary)" }}>Sign in again</Link>
          </p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}>
            {guilds.map((guild) => {
              const hasBot = botGuildIds.has(guild.id);
              const icon = guildIconUrl(guild.id, guild.icon);
              return (
                <div key={guild.id} style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px", padding: "1.1rem",
                  display: "flex", alignItems: "center", gap: "1rem",
                }}>
                  {icon ? (
                    <img src={icon} alt="" style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                      background: "var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "1rem", color: "var(--muted)",
                    }}>
                      {guild.name[0].toUpperCase()}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 600, fontSize: "0.9rem",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {guild.name}
                    </div>
                    <div style={{ marginTop: "0.5rem" }}>
                      {hasBot ? (
                        <Link href={`/dashboard/${guild.id}`} style={{
                          display: "inline-block",
                          background: "var(--primary-dark)", color: "#fff",
                          padding: "0.3rem 0.75rem", borderRadius: "6px",
                          textDecoration: "none", fontWeight: 600, fontSize: "0.78rem",
                        }}>
                          Manage
                        </Link>
                      ) : (
                        <a
                          href={`${INVITE_BASE}&guild_id=${guild.id}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{
                            display: "inline-block",
                            border: "1px solid var(--border)", color: "var(--muted)",
                            padding: "0.3rem 0.75rem", borderRadius: "6px",
                            textDecoration: "none", fontWeight: 600, fontSize: "0.78rem",
                          }}
                        >
                          Add Bot
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

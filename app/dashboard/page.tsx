import { auth } from "@/auth";
import { getUserGuilds, guildIconUrl } from "@/lib/discord";
import { getBotGuildIds } from "@/lib/bot-api";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

const CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? "";
const INVITE_BASE = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=66448710&scope=bot+applications.commands`;

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [guilds, botResult] = await Promise.all([
    getUserGuilds(session.user.id),
    getBotGuildIds(),
  ]);
  const botGuildIds = botResult.ok ? botResult.ids : new Set<string>();
  const botApiError = botResult.ok ? null : botResult.error;

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <nav
        role="navigation"
        aria-label="Dashboard navigation"
        style={{
          position: "sticky", top: 0, zIndex: 40,
          borderBottom: "1px solid var(--border)",
          background: "rgba(2,6,23,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "0 1.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "56px",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <svg width="20" height="20" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ color: "var(--primary)" }} aria-hidden="true">
            <polygon points="50,4 62,38 96,50 62,62 50,96 38,62 4,50 38,38" fill="currentColor" opacity="0.92" />
            <circle cx="50" cy="50" r="10" fill="var(--bg)" />
            <circle cx="50" cy="50" r="5" fill="currentColor" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: "0.925rem", letterSpacing: "-0.02em" }}>guacamoleninja</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User avatar"}
              width={30} height={30}
              style={{ borderRadius: "50%", border: "1.5px solid var(--border-hover)" }}
            />
          )}
          <span style={{
            fontSize: "0.85rem", color: "var(--muted)",
            maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {session.user.name}
          </span>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button type="submit" className="btn-signout">Sign out</button>
          </form>
        </div>
      </nav>

      <main style={{ flex: 1, maxWidth: "1024px", margin: "0 auto", padding: "2.5rem 1.5rem", width: "100%" }}>

        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.375rem" }}>
            Your Servers
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
            Servers where you have Manage Server permission.
          </p>
        </div>

        {botApiError && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: "0.75rem",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px",
            padding: "0.875rem 1rem",
            marginBottom: "1.5rem",
            fontSize: "0.825rem",
            color: "#fca5a5",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "0.1rem" }} aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>
              <strong style={{ color: "#f87171" }}>Bot API unavailable</strong> — bot status may be inaccurate.{" "}
              <span style={{ opacity: 0.75 }}>{botApiError}</span>
            </span>
          </div>
        )}

        {guilds.length === 0 ? (
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "3rem 1.5rem",
            textAlign: "center",
          }}>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
              No servers found, or your Discord token has expired.
            </p>
            <Link href="/login" className="btn-sm-primary">Sign in again</Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "0.875rem",
          }}>
            {guilds.map((guild) => {
              const hasBot = botGuildIds.has(guild.id);
              const icon = guildIconUrl(guild.id, guild.icon);
              return (
                <div key={guild.id} className="card-server">
                  {/* Icon */}
                  {icon ? (
                    <Image src={icon} alt="" width={44} height={44}
                      style={{ borderRadius: "12px", flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 44, height: 44, borderRadius: "12px", flexShrink: 0,
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "1rem", color: "var(--muted)",
                    }}>
                      {guild.name[0].toUpperCase()}
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 600, fontSize: "0.9rem",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      marginBottom: "0.5rem",
                    }}>
                      {guild.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {hasBot ? (
                        <>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: "0.3rem",
                            fontSize: "0.72rem", fontWeight: 500,
                            color: "var(--primary)",
                            background: "var(--primary-dim)",
                            padding: "0.15rem 0.5rem", borderRadius: "999px",
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--primary)", display: "inline-block" }} />
                            Bot active
                          </span>
                          <Link href={`/dashboard/${guild.id}`} className="btn-sm-primary">
                            Manage
                          </Link>
                        </>
                      ) : (
                        <a
                          href={`${INVITE_BASE}&guild_id=${guild.id}`}
                          target="_blank" rel="noopener noreferrer"
                          className="btn-sm-outline"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
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

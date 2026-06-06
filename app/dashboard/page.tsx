import { auth } from "@/auth";
import { getUserGuilds, guildIconUrl } from "@/lib/discord";
import { getBotGuildIds } from "@/lib/bot-api";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MobileNav } from "@/app/_components/MobileNav";

export const dynamic = "force-dynamic";

const CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? "";
const INVITE_BASE = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=66448710&scope=bot+applications.commands`;
const DOCS_URL = "https://docs.guacamoleninja.com";

const BANNER_GRADIENTS = [
  "linear-gradient(135deg,#1a3020,#0d1e14)",
  "linear-gradient(135deg,#1a1d3a,#10132a)",
  "linear-gradient(135deg,#2a1a1a,#1e1010)",
  "linear-gradient(135deg,#1a2030,#0e1423)",
  "linear-gradient(135deg,#1a2820,#0d1e18)",
  "linear-gradient(135deg,#2a2010,#1e1808)",
];

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
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg-feat)" }}>

      {/* Nav */}
      <nav
        role="navigation"
        aria-label="Dashboard navigation"
        style={{
          height: 76, background: "rgba(30,32,48,0.95)",
          backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", padding: "0 3rem",
          position: "sticky", top: 0, zIndex: 100,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text)" }}>
          <Image src="/mascot.jpg" alt="guacamoleninja" width={44} height={44}
            style={{ borderRadius: "50%", border: "2px solid rgba(255,255,255,0.12)", flexShrink: 0 }} />
          <span className="nav-logo-name">guacamoleninja</span>
        </Link>

        <div className="nav-center-links">
          <a className="nav-link" href={DOCS_URL} target="_blank" rel="noopener noreferrer">Docs</a>
          <Link className="nav-link" href="/dashboard">Dashboard</Link>
        </div>

        <div className="nav-right-links" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {session.user.image && (
            <Image src={session.user.image} alt={session.user.name ?? ""} width={34} height={34}
              style={{ borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.12)", flexShrink: 0 }} />
          )}
          <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {session.user.name}
          </span>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button type="submit" className="btn-signout">Sign out</button>
          </form>
        </div>

        <MobileNav docsUrl={DOCS_URL} />
      </nav>

      <main style={{ flex: 1, padding: "4rem 2rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.04em", textAlign: "center", marginBottom: "3rem" }}>
          Select a server
        </h1>

        {botApiError && (
          <div style={{
            maxWidth: 980, margin: "0 auto 2rem",
            display: "flex", alignItems: "flex-start", gap: "0.75rem",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10, padding: "0.875rem 1rem", fontSize: "0.825rem", color: "#fca5a5",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "0.1rem" }} aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>
              <strong style={{ color: "#f87171" }}>Bot API unavailable</strong> — status may be inaccurate.{" "}
              <span style={{ opacity: 0.75 }}>{botApiError}</span>
            </span>
          </div>
        )}

        {guilds.length === 0 ? (
          <div style={{ maxWidth: 980, margin: "0 auto", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>No servers found, or your Discord token has expired.</p>
            <Link href="/login" className="btn-sm-primary">Sign in again</Link>
          </div>
        ) : (
          <div className="db-server-grid">
            {guilds.map((guild) => {
              const hasBot = botGuildIds.has(guild.id);
              const icon = guildIconUrl(guild.id, guild.icon);
              const grad = BANNER_GRADIENTS[guild.id.charCodeAt(0) % BANNER_GRADIENTS.length];

              return (
                <div key={guild.id} className="db-server-card">
                  <div className="db-card-banner">
                    <div className="db-card-banner-fill" style={{ background: grad }} />
                    {!icon && (
                      <div className="db-card-banner-letter">{guild.name[0]}</div>
                    )}
                    <div className="db-card-icon-outer">
                      {icon ? (
                        <Image src={icon} alt="" width={52} height={52}
                          style={{ borderRadius: "50%", objectFit: "cover", width: "100%", height: "100%" }} />
                      ) : (
                        <div className="db-card-icon-letter">{guild.name[0].toUpperCase()}</div>
                      )}
                    </div>
                  </div>

                  <div className="db-card-body">
                    <div className="db-card-name">{guild.name}</div>
                    <div className="db-card-meta">Manage Server</div>
                    {hasBot ? (
                      <Link href={`/dashboard/${guild.id}`} className="db-btn-manage">
                        Manage
                      </Link>
                    ) : (
                      <a href={`${INVITE_BASE}&guild_id=${guild.id}`} target="_blank" rel="noopener noreferrer" className="db-btn-add">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                        Add Bot
                      </a>
                    )}
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

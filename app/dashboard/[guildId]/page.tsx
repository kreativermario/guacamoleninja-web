import { auth } from "@/auth";
import { getUserGuilds, guildIconUrl } from "@/lib/discord";
import { getBotGuild } from "@/lib/bot-api";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { updateGuildConfig, updateCommandsConfig } from "./actions";

const COMMANDS = [
  {
    name: "weather",
    label: "/weather",
    description: "Current conditions and forecasts for any city via Open-Meteo",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
      </svg>
    ),
  },
  {
    name: "server",
    label: "/server",
    description: "Server info — member count, creation date, and server ID",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    name: "config",
    label: "/config",
    description: "Per-server timezone and prefix settings — requires Manage Server",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    name: "uptime",
    label: "/uptime",
    description: "Check how long the bot has been running",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

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

  const botGuild = await getBotGuild(guildId);
  const config = botGuild?.config ?? null;

  const icon = guildIconUrl(guildId, guild.icon);
  const disabledCommands = config?.disabledCommands ?? [];

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <nav
        role="navigation"
        aria-label="Server settings navigation"
        style={{
          position: "sticky", top: 0, zIndex: 40,
          borderBottom: "1px solid var(--border)",
          background: "rgba(2,6,23,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "0 1.5rem",
          display: "flex", alignItems: "center", gap: "0.5rem",
          height: "56px",
          fontSize: "0.875rem",
        }}
      >
        <Link href="/dashboard" className="nav-link-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Servers
        </Link>
        <span style={{ color: "var(--border-hover)" }}>/</span>
        {icon && (
          <Image src={icon} alt="" width={20} height={20} style={{ borderRadius: "6px" }} />
        )}
        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{guild.name}</span>
      </nav>

      <main style={{ flex: 1, maxWidth: "600px", margin: "0 auto", padding: "2.5rem 1.5rem", width: "100%" }}>

        {!botGuild ? (
          /* Bot not in server */
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "2.5rem 1.5rem",
            textAlign: "center",
          }}>
            <div style={{
              width: 48, height: 48,
              borderRadius: "12px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#EF4444",
              margin: "0 auto 1.25rem",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p style={{ fontWeight: 600, marginBottom: "0.375rem", color: "var(--text)" }}>Bot not in this server</p>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              The bot hasn&apos;t joined this server yet, or hasn&apos;t synced its data.
            </p>
            <a
              href={`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=66448710&scope=bot+applications.commands&guild_id=${guildId}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-save"
            >
              Add Bot to Server
            </a>
          </div>
        ) : (
          <>
            {/* ── General Settings ────────────────────────────── */}
            <div style={{ marginBottom: "1.75rem" }}>
              <h1 style={{
                fontSize: "1.375rem", fontWeight: 800,
                letterSpacing: "-0.03em", marginBottom: "0.375rem",
                color: "var(--text)",
              }}>
                Server Settings
              </h1>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                Changes take effect within a few seconds on the bot.
              </p>
            </div>

            <form
              action={updateGuildConfig}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "2.5rem",
              }}
            >
              <input type="hidden" name="guildId" value={guildId} />

              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label htmlFor="prefix" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                    Prefix
                  </label>
                  <input
                    id="prefix"
                    name="prefix"
                    defaultValue={config?.prefix ?? "!"}
                    maxLength={5}
                    required
                    className="input-field"
                  />
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.5 }}>
                    1–5 characters. Used to trigger legacy text commands.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label htmlFor="timezone" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                    Timezone
                  </label>
                  <input
                    id="timezone"
                    name="timezone"
                    defaultValue={config?.timezone ?? "UTC"}
                    maxLength={64}
                    required
                    placeholder="e.g. Europe/Lisbon"
                    className="input-field"
                  />
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.5 }}>
                    IANA timezone name —{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
                      target="_blank" rel="noopener noreferrer"
                      className="link-primary"
                    >
                      view full list
                    </a>
                  </p>
                </div>

              </div>

              <div style={{
                borderTop: "1px solid var(--border)",
                padding: "1rem 1.5rem",
                display: "flex", justifyContent: "flex-end",
                background: "rgba(0,0,0,0.15)",
              }}>
                <button type="submit" className="btn-save">Save Changes</button>
              </div>
            </form>

            {/* ── Commands ────────────────────────────────────── */}
            <div style={{ marginBottom: "1.75rem" }}>
              <h2 style={{
                fontSize: "1.125rem", fontWeight: 700,
                letterSpacing: "-0.02em", marginBottom: "0.375rem",
                color: "var(--text)",
              }}>
                Commands
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                Enable or disable slash commands for this server.
              </p>
            </div>

            <form action={updateCommandsConfig}>
              <input type="hidden" name="guildId" value={guildId} />

              <div style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "0",
              }}>
                {COMMANDS.map((cmd, i) => (
                  <div
                    key={cmd.name}
                    style={{
                      display: "flex", alignItems: "center", gap: "1rem",
                      padding: "1rem 1.25rem",
                      borderBottom: i < COMMANDS.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: 36, height: 36, borderRadius: "9px", flexShrink: 0,
                      background: "var(--primary-dim)",
                      border: "1px solid rgba(120,168,106,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--primary)",
                    }}>
                      {cmd.icon}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 700, fontSize: "0.875rem",
                        fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                        color: "var(--text)", marginBottom: "0.15rem",
                      }}>
                        {cmd.label}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.4 }}>
                        {cmd.description}
                      </div>
                    </div>

                    {/* Toggle */}
                    <label className="cmd-toggle" aria-label={`Toggle ${cmd.label}`}>
                      <input
                        type="checkbox"
                        name="command"
                        value={cmd.name}
                        defaultChecked={!disabledCommands.includes(cmd.name)}
                      />
                      <span className="cmd-toggle-track" />
                    </label>
                  </div>
                ))}
              </div>

              <div style={{
                borderTop: "1px solid var(--border)",
                padding: "1rem 0",
                display: "flex", justifyContent: "flex-end",
              }}>
                <button type="submit" className="btn-save">Save Commands</button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

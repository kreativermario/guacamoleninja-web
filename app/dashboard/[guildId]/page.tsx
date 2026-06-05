import { auth } from "@/auth";
import { getUserGuilds, guildIconUrl } from "@/lib/discord";
import { getBotGuild, getBotGuildChannels, getBotGuildStats, getBotAuditLog } from "@/lib/bot-api";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { updateGuildConfig, updateCommandsConfig, updateWelcomeConfig } from "./actions";

export const dynamic = "force-dynamic";

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

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ marginBottom: "1.75rem" }}>
      <h2 style={{
        fontSize: "1.125rem", fontWeight: 700,
        letterSpacing: "-0.02em", marginBottom: "0.375rem",
        color: "var(--text)",
      }}>
        {title}
      </h2>
      <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>{description}</p>
    </div>
  );
}

export default async function GuildPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [guilds, botGuild, channels, stats, auditLog] = await Promise.all([
    getUserGuilds(session.user.id),
    getBotGuild(guildId),
    getBotGuildChannels(guildId),
    getBotGuildStats(guildId),
    getBotAuditLog(guildId),
  ]);

  if (!guilds.some((g) => g.id === guildId)) notFound();
  if (!botGuild) notFound();

  const config = botGuild.config ?? null;
  const welcome = botGuild.welcomeConfig;
  const icon = guildIconUrl(guildId, botGuild.iconHash);
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
        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{botGuild.name}</span>
      </nav>

      <main style={{ flex: 1, maxWidth: "600px", margin: "0 auto", padding: "2.5rem 1.5rem", width: "100%" }}>

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
        <SectionHeader
          title="Commands"
          description="Enable or disable slash commands for this server."
        />

        <form action={updateCommandsConfig}>
          <input type="hidden" name="guildId" value={guildId} />

          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            overflow: "hidden",
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
                <div style={{
                  width: 36, height: 36, borderRadius: "9px", flexShrink: 0,
                  background: "var(--primary-dim)",
                  border: "1px solid rgba(120,168,106,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--primary)",
                }}>
                  {cmd.icon}
                </div>

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

        {/* ── Welcome Messages ─────────────────────────────── */}
        <SectionHeader
          title="Welcome Messages"
          description="Send a message when a new member joins your server."
        />

        <form
          action={updateWelcomeConfig}
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

            {/* Enabled toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.2rem" }}>
                  Enable welcome messages
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                  Send a message when a new member joins.
                </div>
              </div>
              <label className="cmd-toggle" aria-label="Enable welcome messages">
                <input
                  type="checkbox"
                  name="enabled"
                  value="on"
                  defaultChecked={welcome?.enabled ?? false}
                />
                <span className="cmd-toggle-track" />
              </label>
            </div>

            {/* Channel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label htmlFor="welcome-channel" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                Channel
              </label>
              {channels.length > 0 ? (
                <select
                  id="welcome-channel"
                  name="channelId"
                  defaultValue={welcome?.channelId ?? ""}
                  className="input-field"
                >
                  <option value="">— select a channel —</option>
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>#{ch.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  id="welcome-channel"
                  name="channelId"
                  defaultValue={welcome?.channelId ?? ""}
                  placeholder="Channel ID"
                  className="input-field"
                />
              )}
            </div>

            {/* Message */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label htmlFor="welcome-message" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                Message
              </label>
              <textarea
                id="welcome-message"
                name="message"
                defaultValue={welcome?.message ?? "Welcome {user} to **{server}**! You are member #{memberCount}."}
                maxLength={500}
                rows={3}
                className="input-field"
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.5 }}>
                Variables: <code style={{ fontSize: "0.75rem", color: "var(--primary)" }}>{"{user}"}</code>{" "}
                <code style={{ fontSize: "0.75rem", color: "var(--primary)" }}>{"{username}"}</code>{" "}
                <code style={{ fontSize: "0.75rem", color: "var(--primary)" }}>{"{server}"}</code>{" "}
                <code style={{ fontSize: "0.75rem", color: "var(--primary)" }}>{"{memberCount}"}</code>
              </p>
            </div>

          </div>

          <div style={{
            borderTop: "1px solid var(--border)",
            padding: "1rem 1.5rem",
            display: "flex", justifyContent: "flex-end",
            background: "rgba(0,0,0,0.15)",
          }}>
            <button type="submit" className="btn-save">Save Welcome</button>
          </div>
        </form>

        {/* ── Command Usage Stats ──────────────────────────── */}
        <SectionHeader
          title="Command Usage"
          description="Top commands used in the last 30 days."
        />

        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "2.5rem",
        }}>
          {!stats || stats.total === 0 ? (
            <div style={{ padding: "2rem 1.5rem", textAlign: "center", color: "var(--muted)", fontSize: "0.875rem" }}>
              No commands used in the last 30 days.
            </div>
          ) : (
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {stats.commands.slice(0, 8).map((cmd) => {
                const pct = Math.round((cmd.count / stats.total) * 100);
                return (
                  <div key={cmd.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <span style={{
                        fontSize: "0.8125rem", fontWeight: 600,
                        fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                        color: "var(--text)",
                      }}>
                        /{cmd.name}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                        {cmd.count} use{cmd.count !== 1 ? "s" : ""} · {pct}%
                      </span>
                    </div>
                    <div style={{ height: 6, background: "var(--bg-surface)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: "var(--primary)",
                        borderRadius: 3,
                        transition: "width 0.3s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                {stats.total} total uses across {stats.commands.length} command{stats.commands.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>

        {/* ── Audit Log ───────────────────────────────────── */}
        <SectionHeader
          title="Audit Log"
          description="Recent configuration changes made via the dashboard."
        />

        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "2.5rem",
        }}>
          {auditLog.length === 0 ? (
            <div style={{ padding: "2rem 1.5rem", textAlign: "center", color: "var(--muted)", fontSize: "0.875rem" }}>
              No changes recorded yet.
            </div>
          ) : (
            <div>
              {auditLog.slice(0, 20).map((entry, i) => (
                <div
                  key={entry.id}
                  style={{
                    padding: "0.875rem 1.25rem",
                    borderBottom: i < Math.min(auditLog.length, 20) - 1 ? "1px solid var(--border)" : "none",
                    display: "flex", flexDirection: "column", gap: "0.25rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                    <span style={{
                      fontSize: "0.8125rem", fontWeight: 600,
                      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                      color: "var(--primary)",
                    }}>
                      {entry.action}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)", whiteSpace: "nowrap" }}>
                      {new Date(entry.createdAt).toLocaleString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                    by <strong style={{ color: "var(--text-secondary)" }}>{entry.actorName}</strong>
                    {Object.keys(entry.changes).length > 0 && (
                      <span> · {Object.keys(entry.changes).join(", ")}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  updateGuildConfig,
  updateCommandsConfig,
  updateWelcomeConfig,
  fetchGuildStats,
  fetchGuildAuditLog,
} from "../actions";

/* ── Types ───────────────────────────────────────── */
interface GuildConfig {
  prefix: string;
  timezone: string;
  disabledCommands: string[];
}
interface WelcomeConfig {
  enabled: boolean;
  channelId: string | null;
  message: string;
}
interface Channel { id: string; name: string; }
interface StatsCommand { name: string; count: number; }
interface Stats { total: number; commands: StatsCommand[]; }
interface AuditEntry {
  id: string;
  action: string;
  actorName: string;
  createdAt: string;
  changes: Record<string, unknown>;
}

export interface GuildLayoutProps {
  guildId: string;
  guildName: string;
  guildIconUrl: string | null;
  guilds: { id: string; name: string; iconUrl: string | null }[];
  config: GuildConfig | null;
  welcome: WelcomeConfig | null;
  channels: Channel[];
  userName: string;
  userImage: string | null;
}

type Section = "general" | "commands" | "welcome" | "stats" | "audit";

const COMMANDS = [
  { name: "weather", label: "/weather", description: "Current conditions for any city via Open-Meteo",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg> },
  { name: "server", label: "/server", description: "Server info — member count, creation date, and server ID",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { name: "config", label: "/config", description: "Per-server timezone and prefix settings — requires Manage Server",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> },
  { name: "uptime", label: "/uptime", description: "Check how long the bot has been running",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
] as const;

/* ── Hoisted sidebar icons (rendering-hoist-jsx) ─── */
const ICON_GENERAL = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const ICON_COMMANDS = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
  </svg>
);
const ICON_WELCOME = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);
const ICON_STATS = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const ICON_AUDIT = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const ICON_BACK = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

function DiscordIcon() {
  return (
    <svg width="20" height="15" viewBox="0 0 127.14 96.36" fill="currentColor" aria-hidden="true">
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
  );
}

/* ── Toggle component ────────────────────────────── */
function Toggle({ name, defaultChecked, ariaLabel }: { name: string; defaultChecked: boolean; ariaLabel: string }) {
  return (
    <label className="cmd-toggle" aria-label={ariaLabel}>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span className="cmd-toggle-track" />
    </label>
  );
}

/* ── Sidebar nav item ────────────────────────────── */
function SbItem({ section, active, icon, label, onClick }: {
  section: Section; active: boolean; icon: React.ReactNode; label: string; onClick: (s: Section) => void;
}) {
  return (
    <div className={`sb-item${active ? " active" : ""}`} onClick={() => onClick(section)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClick(section)}>
      {icon}
      {label}
    </div>
  );
}

/* ── Collapsible sidebar group ───────────────────── */
function SbGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`sb-group${open ? "" : " collapsed"}`}>
      <div className="sb-group-hdr" onClick={() => setOpen((v) => !v)}>
        <span className="sb-group-label">{label}</span>
        <span className="sb-group-chevron">▾</span>
      </div>
      <div className="sb-group-items">{children}</div>
    </div>
  );
}

/* ── Main component ──────────────────────────────── */
export function GuildLayout({
  guildId, guildName, guildIconUrl: iconUrl,
  guilds, config, welcome, channels,
  userName, userImage,
}: GuildLayoutProps) {
  const [section, setSection] = useState<Section>("general");
  const [open, setOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const switcherRef = useRef<HTMLDivElement>(null);

  function openSection(s: Section) {
    setSection(s);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (!switcherOpen) return;
    function handleClick(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [switcherOpen]);

  const disabledCommands = config?.disabledCommands ?? [];

  function renderSection() {
    let content: React.ReactNode;
    switch (section) {
      case "general":  content = <SectionGeneral guildId={guildId} config={config} />; break;
      case "commands": content = <SectionCommands guildId={guildId} disabledCommands={disabledCommands} />; break;
      case "welcome":  content = <SectionWelcome guildId={guildId} welcome={welcome} channels={channels} />; break;
      case "stats":    content = <SectionStats guildId={guildId} />; break;
      case "audit":    content = <SectionAudit guildId={guildId} />; break;
    }
    return <div key={section} className="section-enter">{content}</div>;
  }

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Server settings navigation"
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

        <div className="nav-right-links" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {userImage && (
            <Image src={userImage} alt={userName} width={34} height={34}
              style={{ borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.12)", flexShrink: 0 }} />
          )}
          <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {userName}
          </span>
        </div>

        {/* Hamburger — opens the sidebar on mobile */}
        <button
          className={`nav-hamburger${open ? " open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Sidebar overlay */}
      <div
        className={`guild-sidebar-overlay${open ? " show" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div className="guild-layout">
        {/* Sidebar */}
        <aside className={`guild-sidebar${open ? " open" : ""}`}>
          <div ref={switcherRef} className="anim-fade-up anim-delay-1">
            <div
              className="sb-server-hdr sb-server-hdr-btn"
              onClick={() => setSwitcherOpen((v) => !v)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setSwitcherOpen((v) => !v)}
              aria-expanded={switcherOpen}
              aria-label="Switch server"
            >
              {iconUrl ? (
                <div className="sb-server-icon" style={{ padding: 0 }}>
                  <Image src={iconUrl} alt="" width={38} height={38} style={{ borderRadius: "50%", objectFit: "cover" }} />
                </div>
              ) : (
                <div className="sb-server-icon">{guildName[0].toUpperCase()}</div>
              )}
              <span className="sb-server-name">{guildName}</span>
              <svg
                className={`sb-switcher-chevron${switcherOpen ? " open" : ""}`}
                width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {switcherOpen && (
              <div className="sb-server-dropdown">
                {guilds.map((g) => (
                  <Link
                    key={g.id}
                    href={`/dashboard/${g.id}`}
                    className={`sb-server-option${g.id === guildId ? " active" : ""}`}
                    onClick={() => setSwitcherOpen(false)}
                  >
                    <div className="sb-server-opt-icon">
                      {g.iconUrl ? (
                        <Image src={g.iconUrl} alt="" width={28} height={28} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                      ) : (
                        g.name[0].toUpperCase()
                      )}
                    </div>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {g.name}
                    </span>
                    {g.id === guildId && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <nav className="sb-nav anim-fade-up anim-delay-2">
            <SbGroup label="Configuration">
              <SbItem section="general" active={section === "general"} onClick={openSection} label="General Settings" icon={ICON_GENERAL} />
              <SbItem section="commands" active={section === "commands"} onClick={openSection} label="Commands" icon={ICON_COMMANDS} />
              <SbItem section="welcome" active={section === "welcome"} onClick={openSection} label="Welcome Messages" icon={ICON_WELCOME} />
            </SbGroup>

            <SbGroup label="Analytics">
              <SbItem section="stats" active={section === "stats"} onClick={openSection} label="Command Stats" icon={ICON_STATS} />
              <SbItem section="audit" active={section === "audit"} onClick={openSection} label="Audit Log" icon={ICON_AUDIT} />
            </SbGroup>
          </nav>

          <Link href="/dashboard" className="sb-back anim-fade-up anim-delay-3">
            {ICON_BACK}
            All servers
          </Link>
        </aside>

        {/* Main content */}
        <main className="guild-main">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

/* ── Section: General Settings ───────────────────── */
function SectionGeneral({ guildId, config }: { guildId: string; config: GuildConfig | null }) {
  return (
    <>
      <div className="guild-section-hdr">
        <h1 className="guild-section-title">General Settings</h1>
        <p className="guild-section-desc">Configure timezone and command prefix for this server.</p>
      </div>
      <form action={updateGuildConfig}>
        <input type="hidden" name="guildId" value={guildId} />
        <div className="guild-form-card">
          <div className="guild-form-card-hdr">Server Configuration</div>
          <div className="guild-form-card-body">
            <div>
              <label htmlFor="prefix" className="guild-field-label">Prefix</label>
              <input id="prefix" name="prefix" defaultValue={config?.prefix ?? "!"} maxLength={5} required className="input-field" style={{ maxWidth: 180 }} />
              <p className="guild-field-hint">1–5 characters. Used to trigger legacy text commands.</p>
            </div>
            <div>
              <label htmlFor="timezone" className="guild-field-label">Timezone</label>
              <input id="timezone" name="timezone" defaultValue={config?.timezone ?? "UTC"} maxLength={64} required placeholder="e.g. Europe/Lisbon" className="input-field" />
              <p className="guild-field-hint">
                IANA timezone name —{" "}
                <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones" target="_blank" rel="noopener noreferrer" className="link-primary">
                  view full list
                </a>
              </p>
            </div>
          </div>
          <div className="guild-form-card-footer">
            <button type="submit" className="btn-save">Save Changes</button>
          </div>
        </div>
      </form>
    </>
  );
}

/* ── Section: Commands ───────────────────────────── */
function SectionCommands({ guildId, disabledCommands }: { guildId: string; disabledCommands: string[] }) {
  const disabled = new Set(disabledCommands);
  return (
    <>
      <div className="guild-section-hdr">
        <h1 className="guild-section-title">Commands</h1>
        <p className="guild-section-desc">Enable or disable slash commands for this server.</p>
      </div>
      <form action={updateCommandsConfig}>
        <input type="hidden" name="guildId" value={guildId} />
        <div className="guild-cmd-card">
          {COMMANDS.map((cmd, i) => (
            <div key={cmd.name} className="guild-cmd-row" style={i < COMMANDS.length - 1 ? {} : { borderBottom: "none" }}>
              <div className="guild-cmd-icon">{cmd.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="guild-cmd-name">{cmd.label}</div>
                <div className="guild-cmd-desc">{cmd.description}</div>
              </div>
              <Toggle name="command" defaultChecked={!disabled.has(cmd.name)} ariaLabel={`Toggle ${cmd.label}`} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2rem" }}>
          <button type="submit" className="btn-save">Save Commands</button>
        </div>
      </form>
    </>
  );
}

/* ── Section: Welcome Messages ───────────────────── */
function SectionWelcome({ guildId, welcome, channels }: { guildId: string; welcome: WelcomeConfig | null; channels: Channel[] }) {
  return (
    <>
      <div className="guild-section-hdr">
        <h1 className="guild-section-title">Welcome Messages</h1>
        <p className="guild-section-desc">Send a message when a new member joins your server.</p>
      </div>
      <form action={updateWelcomeConfig}>
        <input type="hidden" name="guildId" value={guildId} />
        <div className="guild-form-card">
          <div className="guild-form-card-hdr">Welcome Configuration</div>
          <div className="guild-form-card-body">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
              <div>
                <div className="guild-field-label" style={{ marginBottom: "0.2rem" }}>Enable welcome messages</div>
                <div className="guild-field-hint" style={{ marginTop: 0 }}>Send a message when a new member joins.</div>
              </div>
              <Toggle name="enabled" defaultChecked={welcome?.enabled ?? false} ariaLabel="Enable welcome messages" />
            </div>
            <div>
              <label htmlFor="welcome-channel" className="guild-field-label">Channel</label>
              {channels.length > 0 ? (
                <select id="welcome-channel" name="channelId" defaultValue={welcome?.channelId ?? ""} className="input-field">
                  <option value="">— select a channel —</option>
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>#{ch.name}</option>
                  ))}
                </select>
              ) : (
                <input id="welcome-channel" name="channelId" defaultValue={welcome?.channelId ?? ""} placeholder="Channel ID" className="input-field" />
              )}
            </div>
            <div>
              <label htmlFor="welcome-message" className="guild-field-label">Message</label>
              <textarea
                id="welcome-message" name="message"
                defaultValue={welcome?.message ?? "Welcome {user} to **{server}**! You are member #{memberCount}."}
                maxLength={500} rows={3} className="input-field"
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
              <p className="guild-field-hint">
                Variables: <code style={{ fontSize: "0.75rem", color: "var(--primary)" }}>{"{user}"}</code>{" "}
                <code style={{ fontSize: "0.75rem", color: "var(--primary)" }}>{"{username}"}</code>{" "}
                <code style={{ fontSize: "0.75rem", color: "var(--primary)" }}>{"{server}"}</code>{" "}
                <code style={{ fontSize: "0.75rem", color: "var(--primary)" }}>{"{memberCount}"}</code>
              </p>
            </div>
          </div>
          <div className="guild-form-card-footer">
            <button type="submit" className="btn-save">Save Welcome</button>
          </div>
        </div>
      </form>
    </>
  );
}

/* ── Section: Command Stats ──────────────────────── */
function SectionStats({ guildId }: { guildId: string }) {
  const [stats, setStats] = useState<Stats | null | "loading">("loading");

  useEffect(() => {
    fetchGuildStats(guildId).then(setStats).catch(() => setStats(null));
  }, [guildId]);

  return (
    <>
      <div className="guild-section-hdr">
        <h1 className="guild-section-title">Command Stats</h1>
        <p className="guild-section-desc">Top commands used in the last 30 days.</p>
      </div>
      <div className="guild-form-card">
        {stats === "loading" ? (
          <div style={{ padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[78, 54, 33, 18].map((pct, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="skel" style={{ height: 10, width: 70 }} />
                  <div className="skel" style={{ height: 8, width: 55 }} />
                </div>
                <div style={{ height: 10, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  <div className="skel" style={{ height: "100%", width: `${pct}%`, borderRadius: 99 }} />
                </div>
              </div>
            ))}
            <div className="skel" style={{ height: 8, width: 130, marginTop: "0.25rem" }} />
          </div>
        ) : !stats || stats.total === 0 ? (
          <div style={{ padding: "2rem 1.75rem", textAlign: "center", color: "var(--muted)", fontSize: "0.9375rem" }}>
            No commands used in the last 30 days.
          </div>
        ) : (
          <div style={{ padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {stats.commands.slice(0, 8).map((cmd) => {
              const pct = Math.round((cmd.count / stats.total) * 100);
              return (
                <div key={cmd.name} className="guild-stat-row">
                  <div className="guild-stat-labels">
                    <span style={{ fontWeight: 600, fontFamily: "'Fira Code','Cascadia Code',monospace" }}>/{cmd.name}</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{cmd.count} use{cmd.count !== 1 ? "s" : ""} · {pct}%</span>
                  </div>
                  <div className="guild-stat-bar">
                    <div className="guild-stat-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.25rem" }}>
              {stats.total} total uses across {stats.commands.length} command{stats.commands.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/* ── Section: Audit Log ──────────────────────────── */
function SectionAudit({ guildId }: { guildId: string }) {
  const [auditLog, setAuditLog] = useState<AuditEntry[] | null>(null);

  useEffect(() => {
    fetchGuildAuditLog(guildId).then(setAuditLog).catch(() => setAuditLog([]));
  }, [guildId]);

  return (
    <>
      <div className="guild-section-hdr">
        <h1 className="guild-section-title">Audit Log</h1>
        <p className="guild-section-desc">Recent configuration changes made via the dashboard.</p>
      </div>
      <div className="guild-form-card">
        {auditLog === null ? (
          <div>
            {[{ w: 110, a: 155 }, { w: 90, a: 130 }, { w: 120, a: 100 }].map(({ w, a }, i) => (
              <div
                key={i}
                style={{
                  padding: "0.875rem 1.75rem",
                  borderBottom: i < 2 ? "1px solid var(--border)" : undefined,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="skel" style={{ height: 11, width: w }} />
                  <div className="skel" style={{ height: 9, width: 72 }} />
                </div>
                <div className="skel" style={{ height: 9, width: a }} />
              </div>
            ))}
          </div>
        ) : auditLog.length === 0 ? (
          <div style={{ padding: "2rem 1.75rem", textAlign: "center", color: "var(--muted)", fontSize: "0.9375rem" }}>
            No changes recorded yet.
          </div>
        ) : (
          <>
            {auditLog.slice(0, 20).map((entry, i) => (
              <div key={entry.id} className="guild-audit-entry" style={i === Math.min(auditLog.length, 20) - 1 ? { borderBottom: "none" } : {}}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 700, fontFamily: "'Fira Code','Cascadia Code',monospace", color: "var(--primary)", fontSize: "0.875rem" }}>
                    {entry.action}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", whiteSpace: "nowrap" }}>
                    {new Date(entry.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                  by <strong style={{ color: "var(--text-secondary)" }}>{entry.actorName}</strong>
                  {Object.keys(entry.changes).length > 0 && (
                    <span> · {Object.keys(entry.changes).join(", ")}</span>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "./_components/MobileNav";
import { ScrollReveal } from "./_components/ScrollReveal";
import { DOCS_URL, GITHUB_URL } from "@/lib/config";

// Force SSR so DISCORD_CLIENT_ID is read from the runtime environment,
// not baked in as empty string during the Docker build.
export const dynamic = "force-dynamic";

const CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? "";
const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=66448710&scope=bot+applications.commands`;

function DiscordIcon({ size = 22 }: { size?: number }) {
  const h = Math.round(size * (96.36 / 127.14));
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 127.14 96.36"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* ── Nav ───────────────────────────────────── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          height: 76,
          background: "rgba(30,32,48,0.95)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          padding: "0 3rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <MobileNav docsUrl={DOCS_URL} />

        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text)" }}
        >
          <Image
            src="/mascot.jpg"
            alt="guacamoleninja"
            width={44}
            height={44}
            style={{
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.12)",
              flexShrink: 0,
            }}
          />
          <span className="nav-logo-name">guacamoleninja</span>
        </Link>

        <div className="nav-center-links">
          <a className="nav-link" href={DOCS_URL} target="_blank" rel="noopener noreferrer">
            Docs
          </a>
          <Link className="nav-link" href="/dashboard">
            Dashboard
          </Link>
        </div>

        <div className="nav-right-links">
          <Link className="btn-nav-login" href="/login">
            <DiscordIcon size={20} />
            Login with Discord
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────── */}
      <section
        style={{
          minHeight: "100dvh",
          background: "linear-gradient(180deg, #191c2e 0%, var(--bg-feat) 100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="hero-grid"
          style={{
            flex: 1,
            maxWidth: 1300,
            margin: "0 auto",
            width: "100%",
            padding: "0 3rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            gap: "3rem",
          }}
        >
          <div>
            <h1
              className="anim-fade-up anim-delay-2"
              style={{
                fontSize: "clamp(2.75rem, 5vw, 4rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.04,
                marginBottom: "1.375rem",
              }}
            >
              The utility bot
              <br />
              for{" "}
              <em style={{ fontStyle: "normal", color: "var(--primary)" }}>your</em>{" "}
              server
            </h1>
            <p
              className="anim-fade-up anim-delay-3"
              style={{
                fontFamily: "var(--font-open-sans), sans-serif",
                fontSize: "1.125rem",
                color: "var(--muted)",
                lineHeight: 1.7,
                maxWidth: 430,
                marginBottom: "2.5rem",
              }}
            >
              Weather, polls, reminders, and server tools. Built for small
              communities who want something reliable without the bloat.
            </p>
            <div
              className="hero-cta anim-pop anim-delay-4"
              style={{ display: "flex", gap: "0.875rem", alignItems: "center", flexWrap: "wrap" }}
            >
              <a
                className="btn-hero-primary"
                href={INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DiscordIcon size={22} />
                Add to Discord
              </a>
              <a className="btn-hero-secondary" href="#features">
                See features
              </a>
            </div>
          </div>

          <div
            className="hero-mascot anim-fade-in anim-delay-3"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "3rem 0",
            }}
          >
            <Image
              src="/mascot.jpg"
              alt="guacamoleninja mascot"
              width={280}
              height={280}
              className="mascot-img"
              style={{ borderRadius: "24px", objectFit: "cover" }}
              priority
            />
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "1.75rem 0 2.25rem" }}>
          <div className="scroll-chevron" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      {/* ── Feature sections ──────────────────────── */}
      <section id="features" aria-label="Features" style={{ background: "var(--bg-feat)" }}>

        {/* Weather */}
        <div style={{ padding: "6rem 2rem" }}>
          <ScrollReveal>
          <div
            className="feat-card-grid"
            style={{
              maxWidth: 1300,
              margin: "0 auto",
              borderRadius: 32,
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              minHeight: 560,
              boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="feat-visual"
              style={{
                background: "linear-gradient(140deg, #0b1e14 0%, #14301e 55%, #1c4028 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3rem 2.5rem",
                overflow: "hidden",
              }}
            >
              <FeatureWeatherMock />
            </div>
            <div
              className="feat-text-pad"
              style={{
                background: "#252839",
                padding: "4rem 3.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="feat-eyebrow">Weather</div>
              <h2 className="feat-title">
                Real-time
                <br />
                weather
                <br />
                anywhere
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-open-sans), sans-serif",
                  fontSize: "1.075rem",
                  color: "var(--muted)",
                  lineHeight: 1.75,
                  maxWidth: 380,
                }}
              >
                Current conditions and forecasts for any city in the world.
                Powered by Open-Meteo, no API key needed.
              </p>
            </div>
          </div>
          </ScrollReveal>
        </div>

        {/* Dashboard */}
        <div style={{ padding: "6rem 2rem" }}>
          <ScrollReveal>
          <div
            className="feat-card-grid"
            style={{
              maxWidth: 1300,
              margin: "0 auto",
              borderRadius: 32,
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "0.9fr 1.1fr",
              minHeight: 560,
              boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="feat-text-pad"
              style={{
                background: "#252839",
                padding: "4rem 3.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="feat-eyebrow">Dashboard</div>
              <h2 className="feat-title">
                Configure
                <br />
                from
                <br />
                the web
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-open-sans), sans-serif",
                  fontSize: "1.075rem",
                  color: "var(--muted)",
                  lineHeight: 1.75,
                  maxWidth: 380,
                  marginBottom: "2rem",
                }}
              >
                Toggle commands, set timezones and manage welcome messages.
                All from a clean web dashboard.
              </p>
              <Link className="btn-feat" href="/dashboard">
                Open Dashboard
              </Link>
            </div>
            <div
              className="feat-visual"
              style={{
                background: "linear-gradient(140deg, #10132a 0%, #181d3e 55%, #20254e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3rem 2.5rem",
                overflow: "hidden",
              }}
            >
              <FeatureDashboardMock />
            </div>
          </div>
          </ScrollReveal>
        </div>

        {/* Welcome messages */}
        <div style={{ padding: "6rem 2rem" }}>
          <ScrollReveal>
          <div
            className="feat-card-grid"
            style={{
              maxWidth: 1300,
              margin: "0 auto",
              borderRadius: 32,
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              minHeight: 560,
              boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="feat-visual"
              style={{
                background: "linear-gradient(140deg, #0d1e18 0%, #132a1e 55%, #1a3626 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3rem 2.5rem",
                overflow: "hidden",
              }}
            >
              <FeatureWelcomeMock />
            </div>
            <div
              className="feat-text-pad"
              style={{
                background: "#252839",
                padding: "4rem 3.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="feat-eyebrow">Welcome Messages</div>
              <h2 className="feat-title">
                Greet every
                <br />
                new
                <br />
                member
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-open-sans), sans-serif",
                  fontSize: "1.075rem",
                  color: "var(--muted)",
                  lineHeight: 1.75,
                  maxWidth: 380,
                }}
              >
                Personalised welcome messages with{" "}
                <code style={{ color: "var(--primary)" }}>{"{user}"}</code>,{" "}
                <code style={{ color: "var(--primary)" }}>{"{server}"}</code>, and{" "}
                <code style={{ color: "var(--primary)" }}>{"{memberCount}"}</code>.
                Configurable per server.
              </p>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────── */}
      <ScrollReveal>
      <section
        style={{
          background: "linear-gradient(135deg, #2d5038 0%, #4a7c59 50%, #3a6647 100%)",
          padding: "7rem 2.5rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "#fff",
            marginBottom: "2.25rem",
          }}
        >
          Build a better Discord
          <br />
          server for free
        </h2>
        <a
          className="btn-cta-white"
          href={INVITE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <DiscordIcon size={22} />
          Add to Discord
        </a>
      </section>
      </ScrollReveal>

      {/* ── Footer ────────────────────────────────── */}
      <ScrollReveal>
      <footer
        style={{
          background: "#191c2e",
          borderTop: "1px solid var(--border)",
          padding: "5rem 3rem 3rem",
        }}
      >
        <div
          className="footer-top-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "4rem",
            marginBottom: "3.5rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                marginBottom: "1rem",
              }}
            >
              <Image
                src="/mascot.jpg"
                alt=""
                width={32}
                height={32}
                style={{ borderRadius: "50%" }}
              />
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  letterSpacing: "-0.02em",
                }}
              >
                guacamoleninja
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-open-sans), sans-serif",
                fontSize: "1rem",
                color: "var(--muted)",
                lineHeight: 1.65,
                maxWidth: 240,
              }}
            >
              A utility Discord bot for small communities. Open source and
              self-hostable.
            </p>
          </div>

          <div
            className="footer-cols-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "2.5rem",
            }}
          >
            <FooterCol
              title="Resources"
              links={[
                { label: "Documentation", href: DOCS_URL, external: true },
                { label: "GitHub", href: GITHUB_URL, external: true },
                { label: "Self-hosting", href: `${DOCS_URL}/contributing`, external: true },
                { label: "Contributing", href: `${DOCS_URL}/contributing`, external: true },
              ]}
            />
            <FooterCol
              title="Project"
              links={[
                { label: "Changelog", href: GITHUB_URL, external: true },
                { label: "Bot API", href: `${DOCS_URL}/bot-api`, external: true },
                { label: "Support", href: GITHUB_URL, external: true },
                { label: "Add to Discord", href: INVITE_URL, external: true },
              ]}
            />
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.95rem",
            color: "var(--muted)",
          }}
        >
          <span>© 2026 guacamoleninja-bot</span>
          <span>Open source · MIT License</span>
        </div>
      </footer>
      </ScrollReveal>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────── */

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <h4
        style={{
          fontSize: "1.05rem",
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: "1.25rem",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h4>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="footer-link"
              style={{ fontSize: "0.975rem" }}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MockPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "rgba(18,20,38,0.94)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 16,
        overflow: "hidden",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.35)",
          padding: "0.75rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ed4245",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#faa61a",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#3ba55c",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: "0.72rem", color: "var(--muted)", marginLeft: "0.3rem" }}>
          {title}
        </span>
      </div>
      <div style={{ padding: "1.25rem 1.25rem 1.5rem" }}>{children}</div>
    </div>
  );
}

function ChatMsg({
  avatar,
  name,
  isBot,
  children,
}: {
  avatar: string;
  name: string;
  isBot?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        marginBottom: "1rem",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          flexShrink: 0,
          background: isBot ? "rgba(120,168,106,0.22)" : "rgba(88,101,242,0.3)",
          color: isBot ? "var(--primary)" : "#818cf8",
          fontSize: "0.68rem",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {avatar}
      </div>
      <div>
        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            marginBottom: "0.15rem",
            color: isBot ? "var(--primary)" : "var(--text)",
          }}
        >
          {name}
        </div>
        {children}
      </div>
    </div>
  );
}

function Embed({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: "0.4rem",
        background: "rgba(255,255,255,0.03)",
        borderLeft: "3px solid var(--primary)",
        borderRadius: "0 7px 7px 0",
        padding: "0.575rem 0.875rem",
        fontSize: "0.8rem",
        lineHeight: 1.55,
        color: "#b9bbbe",
      }}
    >
      {children}
    </div>
  );
}

function DiscordEmbed({
  title,
  description,
  fields,
  footer,
}: {
  title: string;
  description?: string;
  fields?: { name: string; value: string; icon: string }[];
  footer?: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        borderLeft: "4px solid #4f545c",
        borderRadius: "0 6px 6px 0",
        padding: "0.75rem 1rem",
        marginTop: "0.25rem",
        maxWidth: "100%",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#f2f3f5", marginBottom: description ? "0.25rem" : "0.625rem" }}>
        {title}
      </div>
      {description && (
        <div style={{ fontSize: "0.8rem", color: "#b9bbbe", marginBottom: "0.625rem" }}>
          {description}
        </div>
      )}
      {fields && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "0.625rem" }}>
          {fields.map((f) => (
            <div key={f.name}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#b9bbbe", marginBottom: "0.15rem" }}>
                {f.icon} {f.name}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#dcddde" }}>{f.value}</div>
            </div>
          ))}
        </div>
      )}
      {footer && (
        <div style={{ fontSize: "0.68rem", color: "#72767d", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.5rem", marginTop: "0.25rem" }}>
          {footer}
        </div>
      )}
    </div>
  );
}

function DiscordCmdUsage({ user, command }: { user: string; command: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem", opacity: 0.6 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(88,101,242,0.4)", flexShrink: 0, fontSize: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}>
        {user[0].toUpperCase()}
      </div>
      <span style={{ fontSize: "0.72rem", color: "#8e9297" }}>
        <strong style={{ color: "#b9bbbe" }}>{user}</strong> used{" "}
        <span style={{ background: "rgba(88,101,242,0.2)", color: "#818cf8", padding: "0 0.3rem", borderRadius: 3, fontWeight: 600 }}>
          /{command}
        </span>
      </span>
    </div>
  );
}

function FeatureWeatherMock() {
  return (
    <MockPanel title="#general">
      <DiscordCmdUsage user="casey" command="weather" />
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: "rgba(120,168,106,0.25)",
          border: "1.5px solid rgba(120,168,106,0.4)",
          overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.8rem", fontWeight: 800, color: "var(--primary)",
        }}>
          GN
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f2f3f5" }}>Guacamole Ninja</span>
            <span style={{ fontSize: "0.6rem", fontWeight: 700, background: "#5865f2", color: "#fff", padding: "1px 5px", borderRadius: 3 }}>APP</span>
            <span style={{ fontSize: "0.7rem", color: "#72767d" }}>Today at 14:32</span>
          </div>
          <DiscordEmbed
            title="🌤 Lisbon, Lisbon District, Portugal"
            description="Partly cloudy"
            fields={[
              { icon: "🌡", name: "Temperature", value: "22°C (feels like 21°C)" },
              { icon: "💧", name: "Humidity", value: "58%" },
              { icon: "🌬", name: "Wind", value: "14 km/h NW" },
            ]}
            footer="Open-Meteo • Today at 14:32"
          />
        </div>
      </div>

      <DiscordCmdUsage user="riley" command="weather" />
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: "rgba(120,168,106,0.25)",
          border: "1.5px solid rgba(120,168,106,0.4)",
          overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.8rem", fontWeight: 800, color: "var(--primary)",
        }}>
          GN
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f2f3f5" }}>Guacamole Ninja</span>
            <span style={{ fontSize: "0.6rem", fontWeight: 700, background: "#5865f2", color: "#fff", padding: "1px 5px", borderRadius: 3 }}>APP</span>
            <span style={{ fontSize: "0.7rem", color: "#72767d" }}>Today at 14:33</span>
          </div>
          <DiscordEmbed
            title="⛅ Tokyo, Tokyo Metropolis, Japan"
            description="Overcast"
            fields={[
              { icon: "🌡", name: "Temperature", value: "18°C (feels like 17°C)" },
              { icon: "💧", name: "Humidity", value: "72%" },
              { icon: "🌬", name: "Wind", value: "8 km/h E" },
            ]}
            footer="Open-Meteo • Today at 14:33"
          />
        </div>
      </div>
    </MockPanel>
  );
}

const DASHBOARD_COMMANDS = [
  { name: "/weather", desc: "Conditions for any city", on: true },
  { name: "/poll",    desc: "Community votes",          on: true },
  { name: "/remind",  desc: "Personal reminders",       on: false },
  { name: "/server",  desc: "Server info",              on: true },
] as const;

function FeatureDashboardMock() {
  return (
    <MockPanel title="Server Settings">
      <div
        style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "0.625rem",
        }}
      >
        Commands
      </div>
      {DASHBOARD_COMMANDS.map((cmd, i) => (
        <div
          key={cmd.name}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 0",
            borderBottom:
              i < DASHBOARD_COMMANDS.length - 1
                ? "1px solid rgba(255,255,255,0.05)"
                : "none",
            fontSize: "0.82rem",
          }}
        >
          <div>
            <div style={{ color: "#dcddde", fontWeight: 500 }}>{cmd.name}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.1rem" }}>
              {cmd.desc}
            </div>
          </div>
          <div
            style={{
              width: 38,
              height: 21,
              borderRadius: 999,
              background: cmd.on ? "var(--primary)" : "rgba(255,255,255,0.15)",
              flexShrink: 0,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 15,
                height: 15,
                borderRadius: "50%",
                background: "#fff",
                top: 3,
                right: cmd.on ? 3 : "auto",
                left: cmd.on ? "auto" : 3,
                boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
              }}
            />
          </div>
        </div>
      ))}
    </MockPanel>
  );
}

function FeatureWelcomeMock() {
  return (
    <MockPanel title="#welcome">
      <div
        style={{
          background: "rgba(120,168,106,0.07)",
          border: "1px solid rgba(120,168,106,0.18)",
          borderRadius: 10,
          padding: "1rem 1.125rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(120,168,106,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              flexShrink: 0,
            }}
          >
            👋
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>guacamoleninja</div>
            <div style={{ fontSize: "0.67rem", color: "var(--muted)" }}>Today at 14:32</div>
          </div>
        </div>
        <div style={{ fontSize: "0.85rem", color: "#b9bbbe", lineHeight: 1.55 }}>
          Hey{" "}
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>@taylor</span>,
          welcome to{" "}
          <span style={{ color: "var(--text)", fontWeight: 600 }}>My Community</span>!
          You are member{" "}
          <span style={{ color: "var(--text)", fontWeight: 600 }}>#42</span>. Make sure
          to check out #rules.
        </div>
      </div>
      <div
        style={{
          fontSize: "0.78rem",
          color: "var(--muted)",
          marginTop: "1rem",
          fontFamily: "var(--font-open-sans), sans-serif",
          lineHeight: 1.5,
        }}
      >
        Configure channel, message, and variables from the dashboard.
      </div>
    </MockPanel>
  );
}

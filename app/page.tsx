import Image from "next/image";

const CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? "";
const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=66448710&scope=bot+applications.commands`;
const DOCS_URL = "https://docs.guacamoleninja.com";
const GITHUB_URL = "https://github.com/kreativermario/guacamoleninja-bot";

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
      </svg>
    ),
    title: "Weather",
    description: "Current conditions and forecasts for any city via /weather.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: "Polls",
    description: "Reaction-based polls with /poll — quick community votes.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
      </svg>
    ),
    title: "Reminders",
    description: "Set personal reminders with /remind. Never miss a thing.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 1.8 14.14A10 10 0 1 1 4.93 4.93a10 10 0 0 1 14.14 0"/>
      </svg>
    ),
    title: "Per-server config",
    description: "Timezone, prefix, and more via /config — per-server settings.",
  },
];

const SETUP_STEPS = [
  { step: "1", title: "Add to your server", description: "Invite the bot and select your Discord server." },
  { step: "2", title: "Configure (optional)", description: "Run /config set timezone to match your server." },
  { step: "3", title: "Use it", description: "Try /weather, /poll, or any other command." },
];


export default function Home() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <nav
        role="navigation"
        aria-label="Main navigation"
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Image src="/mascot.jpg" alt="" width={24} height={24} style={{ borderRadius: "6px", flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: "0.925rem", letterSpacing: "-0.02em" }}>
            guacamoleninja
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.125rem" }}>
          <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="nav-link">Docs</a>
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href={INVITE_URL} target="_blank" rel="noopener noreferrer" className="nav-invite">
            Add to Discord
          </a>
        </div>
      </nav>

      <main style={{ flex: 1 }}>

        {/* Hero */}
        <section style={{
          textAlign: "center",
          padding: "7rem 1.5rem 5rem",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem",
        }}>
          {/* Mascot */}
          <div style={{
            width: 88, height: 88,
            borderRadius: "22px",
            overflow: "hidden",
            border: "2px solid var(--border)",
          }}>
            <Image
              src="/mascot.jpg"
              alt="guacamoleninja mascot"
              width={88} height={88}
              style={{ display: "block", objectFit: "cover" }}
            />
          </div>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            background: "var(--primary-dim)",
            border: "1px solid rgba(120,168,106,0.2)",
            color: "var(--primary)",
            padding: "0.25rem 0.75rem",
            borderRadius: "999px",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--primary)", display: "inline-block", flexShrink: 0 }} />
            Open source · Self-hostable
          </div>

          <h1 style={{
            fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.04em",
            marginTop: "-0.5rem",
          }}>
            guacamoleninja&#8209;bot
          </h1>

          <p style={{
            fontSize: "1.125rem",
            color: "var(--muted)",
            maxWidth: "460px",
            lineHeight: 1.65,
          }}>
            A utility Discord bot for small communities.
            Weather, polls, reminders, and server tools — all in one place.
          </p>

          <div
            className="hero-actions"
            style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.5rem" }}
          >
            <a href={INVITE_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Add to Discord
            </a>
            <a href="/dashboard" className="btn-outline">
              Dashboard
            </a>
            <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Docs →
            </a>
          </div>
        </section>

        {/* Features */}
        <section
          aria-label="Features"
          style={{ padding: "2rem 1.5rem 3rem", maxWidth: "960px", margin: "0 auto" }}
        >
          <p style={{
            textAlign: "center",
            fontSize: "0.72rem", fontWeight: 600,
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: "var(--muted)", marginBottom: "1.5rem",
          }}>
            What it does
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "1px",
            background: "var(--border)",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid var(--border)",
          }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ background: "var(--bg-card)", padding: "1.5rem" }}>
                <div style={{
                  width: 40, height: 40,
                  borderRadius: "10px",
                  background: "var(--primary-dim)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--primary)",
                  marginBottom: "1rem",
                }}>
                  {f.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.375rem", letterSpacing: "-0.01em" }}>
                  {f.title}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                  {f.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Setup */}
        <section
          aria-label="Get started"
          style={{ padding: "2rem 1.5rem 6rem", maxWidth: "560px", margin: "0 auto" }}
        >
          <p style={{
            textAlign: "center",
            fontSize: "0.72rem", fontWeight: 600,
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: "var(--muted)", marginBottom: "1.5rem",
          }}>
            Get started in 3 steps
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {SETUP_STEPS.map((s) => (
              <div key={s.step} className="card-step">
                <div style={{
                  width: 28, height: 28, borderRadius: "8px", flexShrink: 0,
                  background: "var(--primary-dim)",
                  border: "1px solid rgba(120,168,106,0.2)",
                  color: "var(--primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "0.8rem",
                }}>
                  {s.step}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.2rem" }}>{s.title}</div>
                  <div style={{ fontSize: "0.8375rem", color: "var(--muted)", lineHeight: 1.5 }}>{s.description}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="link-primary" style={{ fontSize: "0.875rem" }}>
              Full documentation at docs.guacamoleninja.com →
            </a>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "1.5rem",
        display: "flex", flexWrap: "wrap", gap: "1rem",
        alignItems: "center", justifyContent: "space-between",
        fontSize: "0.8rem", color: "var(--muted)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Image src="/mascot.jpg" alt="" width={16} height={16} style={{ borderRadius: "4px", flexShrink: 0 }} />
          <span>guacamoleninja-bot</span>
        </div>
        <nav aria-label="Footer links" style={{ display: "flex", gap: "1.25rem" }}>
          <a href={INVITE_URL} target="_blank" rel="noopener noreferrer" className="footer-link">Invite</a>
          <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="footer-link">Docs</a>
          <a href="/dashboard" className="footer-link">Dashboard</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
        </nav>
      </footer>
    </div>
  );
}

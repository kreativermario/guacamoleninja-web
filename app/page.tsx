const CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? "";
const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=66448710&scope=bot+applications.commands`;

const DOCS_URL = "https://docs.guacamoleninja.com";
const DASHBOARD_URL = "/dashboard";
const GITHUB_URL = "https://github.com/kreativermario/guacamoleninja-bot";

const FEATURES = [
  {
    icon: "🌤",
    title: "Weather",
    description: "Current conditions and forecasts for any city via /weather.",
  },
  {
    icon: "📊",
    title: "Polls",
    description: "Reaction-based polls with /poll — quick community votes.",
  },
  {
    icon: "⏰",
    title: "Reminders",
    description: "Set personal reminders with /remind. Never miss a thing.",
  },
  {
    icon: "⚙️",
    title: "Per-server config",
    description: "Timezone, prefix, and more via /config — per-server settings.",
  },
];

const SETUP_STEPS = [
  { step: "1", title: "Add to your server", description: "Click the invite button and select your server." },
  { step: "2", title: "Configure (optional)", description: "Run /config set timezone to set your server timezone." },
  { step: "3", title: "Use it", description: "Try /weather, /poll, or any other command." },
];

function ShurikenIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polygon points="50,5 61,39 95,50 61,61 50,95 39,61 5,50 39,39" fill="currentColor" opacity="0.9" />
      <circle cx="50" cy="50" r="10" fill="var(--bg)" />
      <circle cx="50" cy="50" r="5" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        borderBottom: "1px solid var(--border)",
        background: "rgba(13,13,13,0.9)", backdropFilter: "blur(12px)",
        padding: "0 1.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "56px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ShurikenIcon style={{ width: "22px", height: "22px", color: "var(--primary)" }} />
          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>guacamoleninja-bot</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "0.875rem" }}>
          <a href={DOCS_URL} target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--muted)", textDecoration: "none" }}>
            docs
          </a>
          <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--muted)", textDecoration: "none" }}>
            dashboard
          </a>
          <a href={INVITE_URL} target="_blank" rel="noopener noreferrer"
            style={{
              background: "var(--primary-dark)", color: "#fff",
              padding: "0.35rem 0.85rem", borderRadius: "6px",
              textDecoration: "none", fontWeight: 600, fontSize: "0.8rem",
            }}>
            Add to Discord
          </a>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        {/* Hero */}
        <section style={{
          textAlign: "center", padding: "6rem 1.5rem 4rem",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem",
        }}>
          <ShurikenIcon style={{ width: "64px", height: "64px", color: "var(--primary)" }} />
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1 }}>
            guacamoleninja&#8209;bot
          </h1>
          <p style={{ fontSize: "1.125rem", color: "var(--muted)", maxWidth: "480px", lineHeight: 1.6 }}>
            A utility Discord bot for small communities. Weather, polls, reminders, and server tools — all in one place.
          </p>
          <div className="hero-actions" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <a href={INVITE_URL} target="_blank" rel="noopener noreferrer"
              style={{
                background: "var(--primary-dark)", color: "#fff",
                padding: "0.75rem 1.5rem", borderRadius: "8px",
                textDecoration: "none", fontWeight: 700, fontSize: "1rem",
              }}>
              Add to Discord
            </a>
            <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer"
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)",
                padding: "0.75rem 1.5rem", borderRadius: "8px",
                textDecoration: "none", fontWeight: 600, fontSize: "1rem",
              }}>
              Dashboard
            </a>
            <a href={DOCS_URL} target="_blank" rel="noopener noreferrer"
              style={{
                border: "1px solid var(--border)", color: "var(--text)",
                padding: "0.75rem 1.5rem", borderRadius: "8px",
                textDecoration: "none", fontWeight: 600, fontSize: "1rem",
              }}>
              Docs →
            </a>
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: "3rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>
            What it does
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "10px", padding: "1.25rem",
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{f.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>{f.title}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.5 }}>{f.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Setup */}
        <section style={{ padding: "3rem 1.5rem 5rem", maxWidth: "640px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>
            Get started in 3 steps
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {SETUP_STEPS.map((s) => (
              <div key={s.step} style={{
                display: "flex", gap: "1rem", alignItems: "flex-start",
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "10px", padding: "1.25rem",
              }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                  background: "var(--primary-dark)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "0.875rem",
                }}>
                  {s.step}
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{s.title}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{s.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <a href={DOCS_URL} target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
              Full documentation at docs.guacamoleninja.com →
            </a>
          </div>
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
          <ShurikenIcon style={{ width: "14px", height: "14px", color: "var(--primary)" }} />
          <span>guacamoleninja-bot</span>
        </div>
        <div style={{ display: "flex", gap: "1.25rem" }}>
          <a href={INVITE_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>Invite</a>
          <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>Docs</a>
          <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>Dashboard</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>GitHub</a>
        </div>
      </footer>
    </div>
  );
}

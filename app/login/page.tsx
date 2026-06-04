import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/dashboard");

  const { callbackUrl } = await searchParams;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "1.5rem",
    }}>
      <div style={{
        width: "100%", maxWidth: "360px", textAlign: "center",
      }}>
        <svg
          viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
          style={{ width: 48, height: 48, color: "var(--primary)", margin: "0 auto 1.25rem" }}
          aria-hidden="true"
        >
          <polygon points="50,4 62,38 96,50 62,62 50,96 38,62 4,50 38,38" fill="currentColor" />
          <circle cx="50" cy="50" r="11" fill="var(--bg)" />
          <circle cx="50" cy="50" r="5.5" fill="currentColor" />
        </svg>

        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
          Sign in to manage your servers
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "2rem", lineHeight: 1.6 }}>
          Connect your Discord account to view and configure servers where you have Manage Server permission.
        </p>

        <form action={async () => {
          "use server";
          await signIn("discord", { redirectTo: callbackUrl ?? "/dashboard" });
        }}>
          <button
            type="submit"
            style={{
              width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
              background: "#5865F2", color: "#fff",
              padding: "0.7rem 1.25rem", borderRadius: "8px",
              border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: "0.95rem",
              fontFamily: "inherit",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.056a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Continue with Discord
          </button>
        </form>
      </div>
    </div>
  );
}

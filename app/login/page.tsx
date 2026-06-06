import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Image from "next/image";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/dashboard");

  const { callbackUrl } = await searchParams;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(180deg, #191c2e 0%, var(--bg) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "2.75rem 2.25rem",
          boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
          textAlign: "center",
        }}
      >
        {/* Mascot */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            overflow: "hidden",
            border: "2.5px solid rgba(120,168,106,0.35)",
            margin: "0 auto 1.75rem",
            flexShrink: 0,
            boxShadow: "0 0 24px rgba(74,124,89,0.2)",
          }}
        >
          <Image
            src="/mascot.jpg"
            alt="guacamoleninja"
            width={88}
            height={88}
            style={{ display: "block", objectFit: "cover" }}
          />
        </div>

        <h1
          style={{
            fontSize: "1.625rem",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            marginBottom: "0.625rem",
          }}
        >
          Sign in
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--muted)",
            lineHeight: 1.65,
            marginBottom: "2.25rem",
            maxWidth: 280,
            margin: "0 auto 2.25rem",
          }}
        >
          Connect your Discord account to manage servers where you have Manage
          Server permission.
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("discord", { redirectTo: callbackUrl ?? "/dashboard" });
          }}
        >
          <button type="submit" className="btn-login-discord">
            <svg
              width="22"
              height="17"
              viewBox="0 0 127.14 96.36"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
            </svg>
            Continue with Discord
          </button>
        </form>
      </div>

      <a
        href="/"
        style={{
          marginTop: "1.5rem",
          fontSize: "0.875rem",
          color: "var(--muted)",
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          transition: "color 150ms",
        }}
        className="link-muted"
      >
        ← Back to home
      </a>
    </div>
  );
}

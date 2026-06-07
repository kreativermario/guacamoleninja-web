import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const buf = await readFile(join(process.cwd(), "public/mascot.jpg"));
  const src = `data:image/jpeg;base64,${buf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e2030",
          gap: 32,
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            overflow: "hidden",
            border: "4px solid rgba(120,168,106,0.5)",
            display: "flex",
          }}
        >
          <img src={src} width={160} height={160} style={{ objectFit: "cover" }} />
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.04em",
          }}
        >
          Guacamole Ninja Bot
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#9ca3af",
          }}
        >
          Manage your Discord server effortlessly
        </div>
      </div>
    ),
    { ...size },
  );
}

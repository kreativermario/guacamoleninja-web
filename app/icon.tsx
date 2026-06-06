import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const buf = await readFile(join(process.cwd(), "public/mascot.jpg"));
  const src = `data:image/jpeg;base64,${buf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          background: "#191c2e",
        }}
      >
        <img src={src} width={32} height={32} style={{ objectFit: "cover" }} />
      </div>
    ),
    { ...size },
  );
}

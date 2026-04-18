import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

/** Apple touch icon — same asset, larger canvas, rounded. */
export default async function AppleIcon() {
  const file = await readFile(
    join(process.cwd(), "Assets", "ScentFormLogo.png"),
  );
  const src = `data:image/png;base64,${file.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e4e4e7",
          borderRadius: 40,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse runtime */}
        <img
          alt=""
          src={src}
          width={150}
          height={150}
          style={{
            objectFit: "contain",
            borderRadius: 28,
          }}
        />
      </div>
    ),
    { ...size },
  );
}

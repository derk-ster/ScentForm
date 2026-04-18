import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

/** Tab favicon — logo scaled/cropped into rounded square (no mat). */
export default async function Icon() {
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
          background: "transparent",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse runtime */}
        <img
          alt=""
          src={src}
          width={44}
          height={44}
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>
    ),
    { ...size },
  );
}

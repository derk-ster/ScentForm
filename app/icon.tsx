import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

/** Tab favicon — logo slightly inset (cover) in rounded square, no mat. */
export default async function Icon() {
  const file = await readFile(
    join(process.cwd(), "Assets", "Allura7Logo.png"),
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
          width={38}
          height={38}
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

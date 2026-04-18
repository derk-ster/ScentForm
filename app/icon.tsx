import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

/** Tab favicon — uses `Assets/ScentFormLogo.png` with rounded frame for all browsers. */
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
          background: "#e4e4e7",
          borderRadius: 8,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse runtime */}
        <img
          alt=""
          src={src}
          width={26}
          height={26}
          style={{
            objectFit: "contain",
            borderRadius: 5,
          }}
        />
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "AI Visibility Audit by Calibre Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ICON = "https://cdn.calibrestudio.co/Branding/CALIBRE-ICON-BLK.png";
const WORDMARK = "https://cdn.calibrestudio.co/Branding/Calibre_Studio-logo.png";

export default async function Image() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "app/og-regular.ttf")),
    readFile(join(process.cwd(), "app/og-bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          position: "relative",
          fontFamily: "Sans",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 8, backgroundColor: "#000000" }} />

        <div style={{ display: "flex", alignItems: "center", marginTop: 84, marginLeft: 80 }}>
          <img src={ICON} width={26} height={26} style={{ width: 26, height: 26, objectFit: "contain" }} />
          <div style={{ display: "flex", marginLeft: 24, fontSize: 28, letterSpacing: 20, color: "#6e6e6e", fontWeight: 400 }}>
            AI VISIBILITY AUDIT
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 46, marginLeft: 80, fontSize: 92, fontWeight: 700, color: "#000000", lineHeight: 1.04, letterSpacing: -2 }}>
          <div style={{ display: "flex" }}>See how AI sees</div>
          <div style={{ display: "flex" }}>your business.</div>
        </div>

        <div style={{ position: "absolute", left: 80, bottom: 54, display: "flex", fontSize: 25, color: "#000000" }}>
          indexed.calibrestudio.co
        </div>

        <img
          src={WORDMARK}
          width={340}
          height={44}
          style={{ position: "absolute", right: 80, bottom: 44, width: 340, height: 44, objectFit: "contain", objectPosition: "right center" }}
        />
      </div>
    ),
    {
      width: size.width,
      height: size.height,
      fonts: [
        { name: "Sans", data: regular, weight: 400, style: "normal" },
        { name: "Sans", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}

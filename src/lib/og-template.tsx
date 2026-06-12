import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";
import type { ReactElement, ReactNode } from "react";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const fontsDir = path.join(process.cwd(), "src", "assets", "fonts");

export function ogImageResponse(element: ReactElement): ImageResponse {
  return new ImageResponse(element, {
    ...OG_SIZE,
    fonts: [
      {
        name: "Geist",
        data: fs.readFileSync(path.join(fontsDir, "Geist-Regular.ttf")),
        weight: 400,
        style: "normal",
      },
      {
        name: "Geist",
        data: fs.readFileSync(path.join(fontsDir, "Geist-Bold.ttf")),
        weight: 700,
        style: "normal",
      },
    ],
  });
}

export const OG_COLORS = {
  bg: "#1c1917",
  bgSoft: "#292524",
  text: "#fafaf9",
  muted: "#a8a29e",
  amber: "#f59e0b",
  amberDark: "#b45309",
};

/** Shared 1200×630 frame: gradient top bar, logo header, centered content, footer. */
export function OgShell({
  children,
  footer,
}: {
  children: ReactNode;
  footer: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${OG_COLORS.bg} 0%, ${OG_COLORS.bgSoft} 100%)`,
        fontFamily: "Geist",
        color: OG_COLORS.text,
      }}
    >
      <div
        style={{
          height: 14,
          width: "100%",
          background: "linear-gradient(90deg, #fbbf24, #f97316, #fb7185)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          padding: "44px 64px 40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 14,
              background: OG_COLORS.amber,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            MA
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>Maker Atlas</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          {children}
        </div>

        <div style={{ display: "flex", fontSize: 24, color: OG_COLORS.muted }}>{footer}</div>
      </div>
    </div>
  );
}

/** Amber score chip, e.g. “8.4/10”. */
export function OgScore({ score, size = 34 }: { score: number; size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        fontWeight: 700,
        color: OG_COLORS.amber,
        fontSize: size,
      }}
    >
      {score.toFixed(1)}
      <div style={{ display: "flex", fontSize: size * 0.55, color: OG_COLORS.muted }}>/10</div>
    </div>
  );
}

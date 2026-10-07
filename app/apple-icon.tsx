import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// The cube mark on white, for home screens.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        <svg width="120" height="120" viewBox="-16 -16 32 32" fill="none">
          <path d="M 0 -14 L 12.1 -7 L 12.1 7 L 0 14 L -12.1 7 L -12.1 -7 Z" stroke="#0a0a0a" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M -12.1 -7 L 0 0 L 12.1 -7 M 0 0 L 0 14" stroke="#0a0a0a" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}

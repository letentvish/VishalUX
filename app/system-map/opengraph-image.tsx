import { OG_SIZE, ogCard } from "@/lib/og";

export const alt = "Workflow canvas: AI is the middle, Vishal Singh designs both ends.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    kicker: "Workflow canvas · interactive 3D",
    title: "AI is the middle. I design both ends.",
    sub: "Input UI → 6 machine layers → an answer people can understand.",
  });
}

import { OG_SIZE, ogCard } from "@/lib/og";

export const alt = "Vishal Singh, agentic UX and AI product designer: I weave loose ideas into systems people can trust.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    kicker: "Portfolio · Delhi, India",
    title: "I weave loose ideas into systems people can trust.",
    sub: "The human side of AI: clear inputs, answers people understand, and the flow between.",
  });
}

import type { Metadata } from "next";
import { SystemMap } from "@/components/SystemMap";

export const metadata: Metadata = {
  title: "Workflow canvas: the human side of AI",
  description:
    "An interactive 3D map of the 6-layer AI workflow behind Vishal Singh's products: input UI, agent router, prompts, retrieval, memory, an auditor, and an answer people can understand.",
  alternates: { canonical: "/system-map" },
  openGraph: { url: "/system-map", title: "Workflow canvas: the human side of AI · Vishal Singh" },
};

export default function Page() {
  return <SystemMap />;
}

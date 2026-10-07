import type { Metadata } from "next";
import { SystemMap } from "@/components/SystemMap";

export const metadata: Metadata = {
  title: "System map · Vishal Singh",
  description: "The frameworks and workflows behind Vishal Singh's projects, on one zoomable canvas.",
};

export default function Page() {
  return <SystemMap />;
}

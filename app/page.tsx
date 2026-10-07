import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Loader } from "@/components/Loader";
import { Principles } from "@/components/Principles";
import { Services } from "@/components/Services";
import { Thread } from "@/components/Thread";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Loader />
      <main className="iso-grid relative">
        <Thread />
        <div className="relative z-10">
          <Hero />
          <About />
          <Work />
          <Services />
          <Principles />
          <Contact />
        </div>
      </main>
    </>
  );
}

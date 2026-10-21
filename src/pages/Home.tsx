import { useEffect } from "react";
import { useLocation } from "react-router";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/anim";
import { setLenis, getLenis, scrollToId } from "@/lib/scroll";
import Cursor from "@/sections/Cursor";
import Navbar from "@/sections/Navbar";
import Hero from "@/sections/Hero";
import Stats from "@/sections/Stats";
import Brands from "@/sections/Brands";
import Manifesto from "@/sections/Manifesto";
import Formats from "@/sections/Formats";
import Clients from "@/sections/Clients";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";
import VelocityMarquee from "@/components/VelocityMarquee";

const CHANNELS = ["Radio", "TV", "Digital","Vía Pública", "Influencers"];

export default function Home() {
  const location = useLocation();

  /* Lenis smooth scroll wired into GSAP ticker */
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <div className="bg-ink min-h-screen">
      <Cursor />
      <Navbar />

      <main>
        <Hero />

        {/* channel marquee */}
        <div className="relative z-10 bg-ink border-y border-white/10 py-5 md:py-7">
          <VelocityMarquee baseSpeed={85}>
            {CHANNELS.map((c) => (
              <span key={c} className="flex items-center shrink-0">
                <span className="font-display uppercase text-[7vw] md:text-[3.2vw] leading-none text-bone/85 px-6 md:px-8">{c}</span>
                <span className="w-2 h-2 md:w-3 md:h-3 bg-red rotate-45 shrink-0" />
              </span>
            ))}
          </VelocityMarquee>
        </div>

        <Stats />
        <Brands />
        <Manifesto />
        <Formats />
        <Clients />
        <Contact />
      </main>

      <Footer />
      <HashScroll hash={location.hash} />
    </div>
  );
}

function HashScroll({ hash }: { hash: string }) {
  useEffect(() => {
    getLenis()?.start();
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (hash) scrollToId(hash.slice(1));
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);
  return null;
}

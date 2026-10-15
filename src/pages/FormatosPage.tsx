import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/anim";
import { setLenis } from "@/lib/scroll";
import { markExperienceLoaded } from "@/lib/experience";
import Navbar from "@/sections/Navbar";
import Cursor from "@/sections/Cursor";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";
import FormatExplorer from "@/components/formats/FormatExplorer";

export default function FormatosPage() {
  useEffect(() => {
    markExperienceLoaded();
    window.scrollTo(0, 0);
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-ink">
      <Cursor />
      <Navbar />

      <main className="bg-ink pt-20 md:pt-24">
        <FormatExplorer />

        <Contact />
      </main>
      <Footer />
    </div>
  );
}

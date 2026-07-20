import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/anim";
import { getLenis, setLenis } from "@/lib/scroll";
import { markExperienceLoaded } from "@/lib/experience";
import Navbar from "@/sections/Navbar";
import Cursor from "@/sections/Cursor";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";
import Magnetic from "@/components/Magnetic";
import FormatExplorer from "@/components/formats/FormatExplorer";

export default function FormatosPage() {
  useEffect(() => {
    markExperienceLoaded();
    const previousTitle = document.title;
    document.title = "Formatos digitales | GRPP Media Kit 2026";
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
      document.title = previousTitle;
    };
  }, []);

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.5 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-[100dvh] bg-ink">
      <Cursor />
      <Navbar />

      <main className="bg-ink pt-20 md:pt-24">
        <FormatExplorer />

        <section className="relative overflow-hidden bg-red px-5 py-24 text-white md:px-10 md:py-36">
          <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-12 md:items-end">
            <p className="font-mono2 text-[10px] uppercase tracking-[0.28em] text-white/55 md:col-span-3">Del formato a la idea</p>
            <div className="md:col-span-9">
              <h2 className="font-display text-[15vw] uppercase leading-[0.84] md:text-[7.4vw]">No elijas un espacio.<br /><span className="text-ink">Diseña una presencia.</span></h2>
              <div className="mt-9 flex flex-col gap-7 border-t border-white/25 pt-7 md:flex-row md:items-center md:justify-between">
                <p className="max-w-xl text-sm leading-relaxed text-white/[0.68] md:text-base">Nuestro equipo puede combinar formatos, señales y momentos de consumo alrededor del objetivo de tu campaña.</p>
                <Magnetic strength={0.2}>
                  <button onClick={() => scrollTo("contacto")} data-cursor="hover" className="rounded-full bg-ink px-6 py-4 font-mono2 text-[9px] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:bg-bone hover:text-ink">Diseñar mi campaña →</button>
                </Magnetic>
              </div>
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </div>
  );
}

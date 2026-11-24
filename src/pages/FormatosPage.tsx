import { useEffect } from "react";
import Lenis from "lenis";
import { useLocation, useParams } from "react-router";
import { gsap, ScrollTrigger } from "@/lib/anim";
import { setLenis } from "@/lib/scroll";
import Navbar from "@/sections/Navbar";
import Cursor from "@/sections/Cursor";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";
import FormatExplorer from "@/components/formats/FormatExplorer";
import { BrandedContentNotFound } from "@/components/formats/BrandedContentDetail";
import { BRANDED_FORMATS } from "@/components/formats/branded-content";

export default function FormatosPage() {
  const { formatSlug } = useParams();
  const location = useLocation();
  const isUnknownBrandedFormat = Boolean(formatSlug && location.pathname.startsWith("/formatos/branded-content/") && !BRANDED_FORMATS.some((format) => format.slug === formatSlug));
  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
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
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-ink">
      <Cursor />
      <Navbar />

      <main className="bg-ink pt-20 md:pt-24">
        {isUnknownBrandedFormat ? <BrandedContentNotFound /> : <FormatExplorer />}

        <Contact />
      </main>
      <Footer />
    </div>
  );
}

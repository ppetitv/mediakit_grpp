import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "@/lib/anim";
import Magnetic from "@/components/Magnetic";

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const q = gsap.utils.selector(rootRef);
    const ctx = gsap.context(() => {
      gsap.to(q(".contact-reveal > span"), {
        y: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: "top 68%" },
      });
      gsap.fromTo(
        q(".contact-fade"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: { trigger: rootRef.current, start: "top 60%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (sent) return;
    const btn = btnRef.current!;
    gsap.timeline()
      .to(btn, { scale: 0.96, duration: 0.12 })
      .to(btn, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.4)" })
      .add(() => setSent(true), 0.15);
  };

  return (
    <section ref={rootRef} id="contacto" className="relative bg-ink py-28 md:py-40 px-5 md:px-10 overflow-hidden">
      {/* red glow */}
      <div className="absolute -top-40 right-0 w-[36rem] h-[36rem] rounded-full bg-red/15 blur-[140px] pointer-events-none" />

      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
        <div>
          <p className="contact-fade font-mono2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-bone/40 mb-8">
            <span className="text-red">05</span> — Contacto
          </p>
          <h2 className="font-display uppercase leading-[0.95] text-[13vw] lg:text-[6.2vw] text-bone">
            <span className="reveal-line contact-reveal"><span>¿Listo para</span></span>
            <span className="reveal-line contact-reveal"><span>impulsar</span></span>
            <span className="reveal-line contact-reveal"><span className="text-red">tu marca?</span></span>
          </h2>
          <p className="contact-fade mt-8 max-w-md text-bone/55 leading-relaxed">
            Cuéntanos tu reto y un especialista de nuestro equipo comercial te contactará con una propuesta a la medida de tu campaña.
          </p>
          <div className="contact-fade mt-12 space-y-5 font-mono2 text-xs tracking-[0.15em] uppercase text-bone/60">
            <p className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-red" /> comercial@grpp.pe</p>
            <p className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-red" /> Lima, Perú — Respuesta en 24h</p>
          </div>
        </div>

        <form onSubmit={submit} className="contact-fade space-y-8 lg:pt-24">
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="field">
              <label htmlFor="f-nombre">Nombre y apellido</label>
              <input id="f-nombre" required placeholder="Ana Torres" data-cursor="hover" />
              <span className="field-bar" />
            </div>
            <div className="field">
              <label htmlFor="f-empresa">Empresa</label>
              <input id="f-empresa" required placeholder="Mi Marca S.A." data-cursor="hover" />
              <span className="field-bar" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="field">
              <label htmlFor="f-email">Correo electrónico</label>
              <input id="f-email" type="email" required placeholder="ana@mimarca.pe" data-cursor="hover" />
              <span className="field-bar" />
            </div>
            <div className="field">
              <label htmlFor="f-cel">Celular</label>
              <input id="f-cel" type="tel" placeholder="+51 999 999 999" data-cursor="hover" />
              <span className="field-bar" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-msg">Mensaje (opcional)</label>
            <textarea id="f-msg" rows={3} placeholder="Quiero lanzar una campaña en…" data-cursor="hover" />
            <span className="field-bar" />
          </div>

          <Magnetic strength={0.25}>
            <button
              ref={btnRef}
              type="submit"
              data-cursor="hover"
              className={`group relative w-full sm:w-auto overflow-hidden rounded-full px-12 py-5 font-mono2 text-[11px] tracking-[0.22em] uppercase transition-colors duration-500 ${
                sent ? "bg-bone text-ink" : "bg-red text-white"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {sent ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                    Mensaje enviado
                  </>
                ) : (
                  <>Enviar mensaje <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span></>
                )}
              </span>
            </button>
          </Magnetic>
          {sent && (
            <p className="font-mono2 text-[10px] tracking-[0.2em] uppercase text-bone/50">
              Gracias — te contactaremos dentro de las próximas 24 horas.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

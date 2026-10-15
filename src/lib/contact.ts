import { ScrollTrigger } from "@/lib/anim";
import { getLenis } from "@/lib/scroll";

export const CONTACT_INTEREST_EVENT = "grpp:contact-interest";

export function requestContact(interest: string) {
  window.dispatchEvent(new CustomEvent<string>(CONTACT_INTEREST_EVENT, { detail: interest }));
  requestAnimationFrame(() => {
    const form = document.querySelector<HTMLFormElement>("#contacto form");
    if (!form) return;
    const offset = -(document.querySelector("header")?.offsetHeight ?? 0) - 24;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const focusForm = () => form.querySelector<HTMLInputElement>("input:not([type=hidden])")?.focus({ preventScroll: true });
    const lenis = getLenis();

    // The inquiry and catalog changes can alter layout before the scroll starts.
    ScrollTrigger.refresh();
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(form, {
        offset,
        duration: 1.4,
        immediate: reduceMotion,
        onComplete: () => {
          // Account for any image layout changes during the journey to the form.
          lenis.resize();
          lenis.scrollTo(form, { offset, immediate: true });
          focusForm();
        },
      });
    } else {
      window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY + offset, behavior: reduceMotion ? "instant" : "smooth" });
      focusForm();
    }
  });
}

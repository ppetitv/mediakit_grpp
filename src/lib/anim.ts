import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Split a string into word spans for scrub reveals */
export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

export const EASE_OUT = "power4.out";
export const EASE_EXPO = "expo.out";

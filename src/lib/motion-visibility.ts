/** Gate animation work on intersection, page visibility and motion preference. */
export function observeMotionVisibility(element: HTMLElement, onChange: (active: boolean) => void) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let intersects = false;
  let active: boolean | undefined;
  const sync = () => {
    const next = intersects && document.visibilityState === "visible" && !motion.matches;
    if (next === active) return;
    active = next;
    element.dataset.motionActive = String(next);
    onChange(next);
  };
  const observer = new IntersectionObserver(([entry]) => {
    intersects = entry.isIntersecting;
    sync();
  });
  sync();
  observer.observe(element);
  document.addEventListener("visibilitychange", sync);
  motion.addEventListener("change", sync);
  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", sync);
    motion.removeEventListener("change", sync);
    element.dataset.motionActive = "false";
    onChange(false);
  };
}

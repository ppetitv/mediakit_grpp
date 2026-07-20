import { createContext, useContext } from "react";

interface PageTransitionValue {
  transitionTo: (path: string) => void;
}

export const PageTransitionContext = createContext<PageTransitionValue | null>(null);

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) throw new Error("usePageTransition must be used inside PageTransition");
  return context;
}

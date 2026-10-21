import { createModuleLoader } from "./async-module";

export const loadFormatsPage = createModuleLoader(() => import("../pages/FormatosPage"));

export function preloadPage(pathname: string): Promise<unknown> {
  return pathname === "/formatos" || pathname.startsWith("/formatos/")
    ? loadFormatsPage()
    : Promise.resolve();
}

export function warmPage(pathname: string) {
  // Intent prefetch is optional. A click will retry and handle a network failure.
  void preloadPage(pathname).catch(() => {});
}

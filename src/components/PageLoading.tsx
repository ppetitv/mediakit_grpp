import { Component, type ReactNode } from "react";

export default function PageLoading() {
  return (
    <div role="status" className="min-h-[100svh] bg-ink px-5 py-4 text-bone md:px-10">
      <img src="/images/grpp.svg" width={64} height={28} alt="GRPP" className="h-8 w-auto md:h-9" />
      <p className="mx-auto mt-[35vh] max-w-sm text-center text-sm text-bone/60">Cargando formatos…</p>
    </div>
  );
}

export class PageLoadBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main role="alert" className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-ink px-6 text-center text-bone">
        <img src="/images/grpp.svg" width={64} height={28} alt="GRPP" className="h-12 w-auto" />
        <h1 className="font-display text-4xl uppercase">No pudimos cargar esta página</h1>
        <p className="max-w-sm text-sm text-bone/60">Comprueba tu conexión y vuelve a intentarlo.</p>
        <button onClick={() => window.location.reload()} className="rounded-full bg-red px-6 py-3 text-sm text-white">Volver a intentar</button>
        <a href="/" className="text-sm underline underline-offset-4">Ir al inicio</a>
      </main>
    );
  }
}

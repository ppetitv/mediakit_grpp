interface FrameTicker {
  add(callback: (time: number, delta: number) => void): void;
  remove(callback: (time: number, delta: number) => void): void;
}

/** Stop ticking as soon as the visual has settled; restarting is idempotent. */
export function createSettlingLoop(ticker: FrameTicker, update: (delta: number) => boolean, onActive: (active: boolean) => void) {
  let active = false;
  const stop = () => {
    if (!active) return;
    active = false;
    ticker.remove(tick);
    onActive(false);
  };
  const tick = (_time: number, delta: number) => { if (!update(delta)) stop(); };
  return {
    start() {
      if (active) return;
      active = true;
      ticker.add(tick);
      onActive(true);
    },
    stop,
  };
}

interface FrameScheduler {
  setTimeout(callback: () => void, delay: number): number;
  clearTimeout(id: number): void;
  requestAnimationFrame(callback: FrameRequestCallback): number;
  cancelAnimationFrame(id: number): void;
}

/** Collapse an asset-load burst into one refresh, away from the load handlers. */
export function createDeferredTask(callback: () => void, scheduler: FrameScheduler = window, delay = 80) {
  let timeout = 0;
  let frame = 0;
  let disposed = false;
  const clear = () => {
    scheduler.clearTimeout(timeout);
    scheduler.cancelAnimationFrame(frame);
    timeout = frame = 0;
  };
  return {
    request() {
      if (disposed) return;
      clear();
      timeout = scheduler.setTimeout(() => {
        timeout = 0;
        frame = scheduler.requestAnimationFrame(() => {
          frame = 0;
          if (!disposed) callback();
        });
      }, delay);
    },
    dispose() { disposed = true; clear(); },
  };
}

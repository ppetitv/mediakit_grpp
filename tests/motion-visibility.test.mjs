import assert from "node:assert/strict";
import { test } from "node:test";
import { observeMotionVisibility } from "../src/lib/motion-visibility.ts";

test("motion follows intersection, tab visibility and preference, then cleans up", () => {
  const originals = new Map(["window", "document", "IntersectionObserver"].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const doc = new EventTarget();
  doc.visibilityState = "visible";
  const motion = new EventTarget();
  motion.matches = false;
  let observer;
  class FakeObserver {
    disconnected = false;
    constructor(callback) { this.callback = callback; observer = this; }
    observe(element) { this.element = element; }
    disconnect() { this.disconnected = true; }
    intersect(value) { this.callback([{ isIntersecting: value }]); }
  }
  Object.defineProperty(globalThis, "window", { configurable: true, value: { matchMedia: () => motion } });
  Object.defineProperty(globalThis, "document", { configurable: true, value: doc });
  Object.defineProperty(globalThis, "IntersectionObserver", { configurable: true, value: FakeObserver });
  try {
    const element = { dataset: {} };
    const changes = [];
    const stop = observeMotionVisibility(element, value => changes.push(value));
    assert.deepEqual(changes, [false]);
    observer.intersect(true);
    assert.equal(element.dataset.motionActive, "true");
    doc.visibilityState = "hidden";
    doc.dispatchEvent(new Event("visibilitychange"));
    doc.dispatchEvent(new Event("visibilitychange"));
    assert.deepEqual(changes, [false, true, false]);
    doc.visibilityState = "visible";
    doc.dispatchEvent(new Event("visibilitychange"));
    motion.matches = true;
    motion.dispatchEvent(new Event("change"));
    assert.equal(element.dataset.motionActive, "false");
    motion.matches = false;
    motion.dispatchEvent(new Event("change"));
    observer.intersect(false);
    assert.deepEqual(changes, [false, true, false, true, false, true, false]);
    stop();
    assert.equal(observer.disconnected, true);
    const finalCount = changes.length;
    doc.dispatchEvent(new Event("visibilitychange"));
    motion.dispatchEvent(new Event("change"));
    assert.equal(changes.length, finalCount);
    assert.equal(element.dataset.motionActive, "false");
  } finally {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});

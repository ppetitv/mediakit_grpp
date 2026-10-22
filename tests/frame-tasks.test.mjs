import assert from "node:assert/strict";
import { test } from "node:test";
import { createDeferredTask, createSettlingLoop } from "../src/lib/frame-tasks.ts";

test("cursor ticker starts once, stops when settled, resumes and disposes", () => {
  const callbacks = new Set();
  const states = [];
  let moving = true;
  const loop = createSettlingLoop({ add: cb => callbacks.add(cb), remove: cb => callbacks.delete(cb) }, () => moving, state => states.push(state));
  assert.equal(callbacks.size, 0);
  loop.start(); loop.start();
  assert.equal(callbacks.size, 1);
  [...callbacks][0](0, 16);
  assert.equal(callbacks.size, 1);
  moving = false;
  [...callbacks][0](0, 16);
  assert.equal(callbacks.size, 0);
  loop.start(); loop.stop(); loop.stop();
  assert.equal(callbacks.size, 0);
  assert.deepEqual(states, [true, false, true, false]);
});

test("image-load bursts collapse into one frame and dispose cancels queued work", () => {
  let id = 0;
  let calls = 0;
  const timers = new Map();
  const frames = new Map();
  const scheduler = {
    setTimeout(cb) { timers.set(++id, cb); return id; },
    clearTimeout(id) { timers.delete(id); },
    requestAnimationFrame(cb) { frames.set(++id, cb); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
  };
  const flush = (queue) => {
    const callbacks = [...queue.values()]; queue.clear(); callbacks.forEach(cb => cb(0));
  };
  const task = createDeferredTask(() => calls++, scheduler);
  for (let n = 0; n < 77; n++) task.request();
  assert.equal(timers.size, 1);
  assert.equal(calls, 0);
  flush(timers);
  assert.equal(frames.size, 1);
  flush(frames);
  assert.equal(calls, 1);
  task.request(); flush(timers);
  task.request();
  assert.equal(frames.size, 0);
  task.dispose();
  assert.equal(timers.size, 0);
  task.request();
  assert.equal(timers.size, 0);
  assert.equal(calls, 1);
});

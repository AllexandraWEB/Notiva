// Ensure browser timing APIs exist during SSR for libraries that depend on them.
const raf = (callback: (time: number) => void): number => {
  return setTimeout(() => callback(Date.now()), 16) as unknown as number;
};

const caf = (handle: number): void => {
  clearTimeout(handle as unknown as ReturnType<typeof setTimeout>);
};

if (typeof globalThis.requestAnimationFrame !== 'function') {
  globalThis.requestAnimationFrame = raf as typeof globalThis.requestAnimationFrame;
}

if (typeof globalThis.cancelAnimationFrame !== 'function') {
  globalThis.cancelAnimationFrame = caf as typeof globalThis.cancelAnimationFrame;
}

const maybeWindow = globalThis as unknown as {
  window?: {
    requestAnimationFrame?: (callback: (time: number) => void) => number;
    cancelAnimationFrame?: (handle: number) => void;
  };
  self?: {
    requestAnimationFrame?: (callback: (time: number) => void) => number;
    cancelAnimationFrame?: (handle: number) => void;
  };
};

if (maybeWindow.window) {
  maybeWindow.window.requestAnimationFrame ??= raf;
  maybeWindow.window.cancelAnimationFrame ??= caf;
}

if (maybeWindow.self) {
  maybeWindow.self.requestAnimationFrame ??= raf;
  maybeWindow.self.cancelAnimationFrame ??= caf;
}
import '@testing-library/jest-dom/vitest'; // oxlint-disable-line import/no-unassigned-import -- registers matchers
import { act, cleanup } from '@testing-library/react';

// RTL only detects fake timers through a global `jest`; without it, user-event under
// vi.useFakeTimers() hangs on RTL's internal setTimeout(0).
// https://github.com/testing-library/react-testing-library/issues/1197
Object.assign(globalThis, {
  jest: { advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms) },
});

// Real implementation, spied so specs can assert positioning options (see `lastFloating`).
vi.mock('@floating-ui/react-dom', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@floating-ui/react-dom')>();
  return { ...mod, useFloating: vi.fn(mod.useFloating) };
});

// useFloating applies positions in `computePosition().then(setState)`, a microtask outside
// act(), so every floating render warns. Run that callback inside act().
vi.mock('@floating-ui/dom', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@floating-ui/dom')>();
  const computePosition: typeof mod.computePosition = (...args) => {
    const result = mod.computePosition(...args);
    return {
      // oxlint-disable-next-line unicorn/no-thenable -- intercepts useFloating's .then(); still a valid thenable
      then: (onFulfilled, onRejected) =>
        result.then(
          onFulfilled &&
            ((data) => {
              let value!: ReturnType<typeof onFulfilled>;
              act(() => {
                value = onFulfilled(data);
              });
              return value;
            }),
          onRejected,
        ),
    } as typeof result;
  };
  return { ...mod, computePosition };
});

afterEach(() => cleanup());

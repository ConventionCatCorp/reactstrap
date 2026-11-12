import '@testing-library/jest-dom/vitest'; // oxlint-disable-line import/no-unassigned-import -- registers matchers
import { cleanup } from '@testing-library/react';

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

afterEach(() => cleanup());

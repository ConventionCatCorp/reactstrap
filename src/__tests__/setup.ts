import '@testing-library/jest-dom/vitest'; // oxlint-disable-line import/no-unassigned-import -- registers matchers
import { cleanup } from '@testing-library/react';

// RTL only detects fake timers through a global `jest`; without it, user-event under
// vi.useFakeTimers() hangs on RTL's internal setTimeout(0).
// https://github.com/testing-library/react-testing-library/issues/1197
Object.assign(globalThis, {
  jest: { advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms) },
});

afterEach(() => cleanup());

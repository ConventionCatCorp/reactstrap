import { createContext } from 'react';

export const InputGroupContext = createContext<{ insideInputGroup?: boolean }>(
  {},
);

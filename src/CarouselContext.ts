import { createContext } from 'react';

export const CarouselContext = createContext<{ direction?: 'start' | 'end' }>(
  {},
);

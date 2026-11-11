import { createContext } from 'react';

export interface AccordionContextValue {
  open?: string | string[];
  toggle?: (id: string) => void;
}

export const AccordionContext = createContext<AccordionContextValue>({});

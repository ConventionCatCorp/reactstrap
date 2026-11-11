import { createContext } from 'react';

export const TabContext = createContext<{ activeTabId?: string | number }>({});

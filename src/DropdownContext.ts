import { createContext, type SyntheticEvent } from 'react';

export type DropdownDirection =
  'up' | 'down' | 'start' | 'end' | 'left' | 'right';

export interface DropdownContextValue {
  toggle: (e?: SyntheticEvent | Event) => void;
  isOpen?: boolean;
  direction: DropdownDirection;
  inNavbar?: boolean;
  disabled?: boolean;
  /** DropdownMenu reports its DOM node, so outside clicks close the dropdown. */
  onMenuRef?: (el: HTMLElement | null) => void;
  onToggleRef?: (el: HTMLElement | null) => void;
  /** The toggle's DOM node; DropdownMenu floats against it. */
  reference?: HTMLElement | null;
  menuRole?: 'listbox' | 'menu' | boolean;
}

export const DropdownContext = createContext<DropdownContextValue>(
  {} as DropdownContextValue,
);

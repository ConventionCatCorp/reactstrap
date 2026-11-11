import { useEffect, useState, type ElementType } from 'react';
import Collapse, {
  type CollapseOwnProps,
  type CollapseProps,
} from './Collapse';
import {
  addMultipleEventListeners,
  defaultToggleEvents,
  findDOMElements,
  type PolymorphicExtras,
} from './utils';

export interface UncontrolledCollapseOwnProps extends CollapseOwnProps {
  /** Set if Collapse is open by default */
  defaultOpen?: boolean;
  /** Selector of the element(s) that should trigger toggle */
  toggler: string;
  /** Events that should trigger the toggle */
  toggleEvents?: string[];
}

export type UncontrolledCollapseProps<T extends ElementType = 'div'> =
  UncontrolledCollapseOwnProps &
    PolymorphicExtras<UncontrolledCollapseOwnProps, T>;

function UncontrolledCollapse<T extends ElementType = 'div'>({
  defaultOpen = false,
  toggler,
  toggleEvents = defaultToggleEvents,
  ...props
}: UncontrolledCollapseProps<T>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(
    () =>
      // A selector resolves to a non-empty NodeList (or throws).
      addMultipleEventListeners(
        findDOMElements(toggler) as ArrayLike<Element>,
        (e) => {
          setIsOpen((open) => !open);
          e.preventDefault();
        },
        toggleEvents,
      ),
    // Listeners are bound once on mount, like the former class component.
    // oxlint-disable-next-line react/exhaustive-deps
    [],
  );

  return <Collapse isOpen={isOpen} {...(props as CollapseProps)} />;
}

export default UncontrolledCollapse;

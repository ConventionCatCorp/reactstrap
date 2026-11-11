import { useState, type ElementType } from 'react';
import Accordion, {
  type AccordionBaseOwnProps,
  type AccordionBaseProps,
} from './Accordion';
import type { PolymorphicExtras } from './utils';

export interface UncontrolledAccordionOwnProps extends AccordionBaseOwnProps {
  /** Item id(s) open on mount */
  defaultOpen?: string | string[];
  /** Allow multiple items to be open at once */
  stayOpen?: boolean;
}

export type UncontrolledAccordionProps<T extends ElementType = 'div'> =
  UncontrolledAccordionOwnProps &
    PolymorphicExtras<UncontrolledAccordionOwnProps, T>;

function UncontrolledAccordion<T extends ElementType = 'div'>({
  defaultOpen,
  stayOpen,
  ...props
}: UncontrolledAccordionProps<T>) {
  const [open, setOpen] = useState<string | string[]>(
    defaultOpen || (stayOpen ? [] : ''),
  );
  const toggle = (id: string) => {
    if (stayOpen) {
      const ids = ([] as string[]).concat(open);
      setOpen(
        ids.includes(id) ? ids.filter((itemId) => itemId !== id) : [...ids, id],
      );
    } else {
      setOpen(open === id ? '' : id);
    }
  };

  return (
    <Accordion {...(props as AccordionBaseProps)} open={open} toggle={toggle} />
  );
}

export default UncontrolledAccordion;

import { useMemo, type ElementType, type Ref } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';
import { AccordionContext } from './AccordionContext';

/** Own props shared by `Accordion` and `UncontrolledAccordion`. */
export interface AccordionBaseOwnProps {
  /** Add custom class */
  className?: string;
  /** Change existing className with a new className */
  cssModule?: CSSModule;
  /** Render accordions edge-to-edge with their parent container */
  flush?: boolean;
  innerRef?: Ref<any>;
}

/** Props shared by `Accordion` and `UncontrolledAccordion`. */
export type AccordionBaseProps<T extends ElementType = 'div'> =
  AccordionBaseOwnProps & PolymorphicExtras<AccordionBaseOwnProps, T>;

export interface AccordionOwnProps extends AccordionBaseOwnProps {
  /** The current active key that corresponds to the currently expanded card */
  open: string | string[];
  /** Function that's triggered on clicking `AccordionHeader` */
  toggle: (targetId: string) => void;
}

export type AccordionProps<T extends ElementType = 'div'> = AccordionOwnProps &
  PolymorphicExtras<AccordionOwnProps, T>;

function Accordion<T extends ElementType = 'div'>({
  flush,
  open,
  toggle,
  className,
  cssModule,
  tag,
  innerRef,
  ref,
  ...attributes
}: AccordionProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const classes = mapToCssModules(
    classNames(className, 'accordion', {
      'accordion-flush': flush,
    }),
    cssModule,
  );

  const accordionContext = useMemo(() => ({ open, toggle }), [open, toggle]);

  return (
    <AccordionContext.Provider value={accordionContext}>
      <Tag {...attributes} className={classes} ref={innerRef ?? ref} />
    </AccordionContext.Provider>
  );
}

export default Accordion;

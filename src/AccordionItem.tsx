import type { ElementType, Ref } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface AccordionItemOwnProps {
  /** To add custom class */
  className?: string;
  /** Change existing base class name with a new class name */
  cssModule?: CSSModule;
  innerRef?: Ref<any>;
}

export type AccordionItemProps<T extends ElementType = 'div'> =
  AccordionItemOwnProps & PolymorphicExtras<AccordionItemOwnProps, T>;

function AccordionItem<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  innerRef,
  ref,
  ...attributes
}: AccordionItemProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const classes = mapToCssModules(
    classNames(className, 'accordion-item'),
    cssModule,
  );

  return <Tag {...attributes} className={classes} ref={innerRef ?? ref} />;
}

export default AccordionItem;

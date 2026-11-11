import { useContext, type ElementType, type Ref } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';
import { AccordionContext } from './AccordionContext';

export interface AccordionHeaderOwnProps {
  /** Add custom class */
  className?: string;
  /** Change existing base class name with a new class name */
  cssModule?: CSSModule;
  innerRef?: Ref<any>;
  /** Unique key used to control item's collapse/expand */
  targetId: string;
}

export type AccordionHeaderProps<T extends ElementType = 'h2'> =
  AccordionHeaderOwnProps & PolymorphicExtras<AccordionHeaderOwnProps, T>;

function AccordionHeader<T extends ElementType = 'h2'>({
  className,
  cssModule,
  tag,
  innerRef,
  ref,
  children,
  targetId,
  ...attributes
}: AccordionHeaderProps<T>) {
  const Tag: ElementType = tag ?? 'h2';
  const { open, toggle } = useContext(AccordionContext);

  const classes = mapToCssModules(
    classNames(className, 'accordion-header'),
    cssModule,
  );

  const buttonClasses = mapToCssModules(
    classNames('accordion-button', {
      collapsed: !(Array.isArray(open)
        ? open.includes(targetId)
        : open === targetId),
    }),
    cssModule,
  );

  return (
    <Tag {...attributes} className={classes} ref={innerRef ?? ref}>
      <button
        type="button"
        className={buttonClasses}
        onClick={() => toggle?.(targetId)}
      >
        {children}
      </button>
    </Tag>
  );
}

export default AccordionHeader;

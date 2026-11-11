import { useContext, type ElementType } from 'react';
import classNames from 'classnames';
import { mapToCssModules } from './utils';
import Collapse, { type CollapseProps } from './Collapse';
import { AccordionContext } from './AccordionContext';

/** Props go to the wrapping `Collapse` (a `div`); `tag` sets the inner body element. */
export interface AccordionBodyProps extends Omit<
  CollapseProps,
  'isOpen' | 'tag'
> {
  /** Unique key used to control item's collapse/expand */
  accordionId: string;
  /** Set a custom element for the body (inside the `Collapse`) */
  tag?: ElementType;
}

function AccordionBody({
  className,
  cssModule,
  tag: Tag = 'div',
  innerRef,
  children,
  accordionId,
  ...attributes
}: AccordionBodyProps) {
  const { open } = useContext(AccordionContext);

  const classes = mapToCssModules(
    classNames(className, 'accordion-collapse'),
    cssModule,
  );

  return (
    <Collapse
      {...attributes}
      className={classes}
      innerRef={innerRef}
      isOpen={
        Array.isArray(open) ? open.includes(accordionId) : open === accordionId
      }
    >
      <Tag className="accordion-body">{children}</Tag>
    </Collapse>
  );
}

export default AccordionBody;

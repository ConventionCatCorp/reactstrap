import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface OffcanvasBodyOwnProps {
  /** Add custom class */
  className?: string;
  /** Change existing className with a new className */
  cssModule?: CSSModule;
}

export type OffcanvasBodyProps<T extends ElementType = 'div'> =
  OffcanvasBodyOwnProps & PolymorphicExtras<OffcanvasBodyOwnProps, T>;

function OffcanvasBody<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  ...attributes
}: OffcanvasBodyProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const classes = mapToCssModules(
    classNames(className, 'offcanvas-body'),
    cssModule,
  );

  return <Tag {...attributes} className={classes} />;
}

export default OffcanvasBody;

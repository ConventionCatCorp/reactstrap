import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface CardFooterOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type CardFooterProps<T extends ElementType = 'div'> =
  CardFooterOwnProps & PolymorphicExtras<CardFooterOwnProps, T>;

function CardFooter<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  ...attributes
}: CardFooterProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'card-footer'),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'div';
  return <Tag {...attributes} className={classes} />;
}

export default CardFooter;

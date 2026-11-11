import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface CardTitleOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type CardTitleProps<T extends ElementType = 'div'> = CardTitleOwnProps &
  PolymorphicExtras<CardTitleOwnProps, T>;

function CardTitle<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  ...attributes
}: CardTitleProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'card-title'),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'div';
  return <Tag {...attributes} className={classes} />;
}

export default CardTitle;

import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface CardTextOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type CardTextProps<T extends ElementType = 'p'> = CardTextOwnProps &
  PolymorphicExtras<CardTextOwnProps, T>;

function CardText<T extends ElementType = 'p'>({
  className,
  cssModule,
  tag,
  ...attributes
}: CardTextProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'card-text'),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'p';
  return <Tag {...attributes} className={classes} />;
}

export default CardText;

import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface CardSubtitleOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type CardSubtitleProps<T extends ElementType = 'div'> =
  CardSubtitleOwnProps & PolymorphicExtras<CardSubtitleOwnProps, T>;

function CardSubtitle<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  ...attributes
}: CardSubtitleProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'card-subtitle'),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'div';
  return <Tag {...attributes} className={classes} />;
}

export default CardSubtitle;

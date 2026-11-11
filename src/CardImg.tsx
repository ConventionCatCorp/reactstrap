import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface CardImgOwnProps {
  /** Add `bottom` prop if image is at bottom of card */
  bottom?: boolean;
  /** Add custom class */
  className?: string;
  /** Change existing className with a new className */
  cssModule?: CSSModule;
  /** Add `top` prop if image is at top of card */
  top?: boolean;
}

export type CardImgProps<T extends ElementType = 'img'> = CardImgOwnProps &
  PolymorphicExtras<CardImgOwnProps, T>;

function CardImg<T extends ElementType = 'img'>({
  className,
  cssModule,
  top,
  bottom,
  tag,
  ...attributes
}: CardImgProps<T>) {
  let cardImgClassName = 'card-img';
  if (top) cardImgClassName = 'card-img-top';
  if (bottom) cardImgClassName = 'card-img-bottom';

  const classes = mapToCssModules(
    classNames(className, cardImgClassName),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'img';

  return <Tag {...attributes} className={classes} />;
}

export default CardImg;

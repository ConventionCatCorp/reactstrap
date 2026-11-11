import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface CardImgOverlayOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type CardImgOverlayProps<T extends ElementType = 'div'> =
  CardImgOverlayOwnProps & PolymorphicExtras<CardImgOverlayOwnProps, T>;

function CardImgOverlay<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  ...attributes
}: CardImgOverlayProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'card-img-overlay'),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'div';
  return <Tag {...attributes} className={classes} />;
}

export default CardImgOverlay;

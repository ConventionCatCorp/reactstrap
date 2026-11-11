import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface CardHeaderOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type CardHeaderProps<T extends ElementType = 'div'> =
  CardHeaderOwnProps & PolymorphicExtras<CardHeaderOwnProps, T>;

function CardHeader<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  ...attributes
}: CardHeaderProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'card-header'),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'div';
  return <Tag {...attributes} className={classes} />;
}

export default CardHeader;

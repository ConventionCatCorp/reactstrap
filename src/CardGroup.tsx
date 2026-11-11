import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface CardGroupOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type CardGroupProps<T extends ElementType = 'div'> = CardGroupOwnProps &
  PolymorphicExtras<CardGroupOwnProps, T>;

function CardGroup<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  ...attributes
}: CardGroupProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'card-group'),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'div';
  return <Tag {...attributes} className={classes} />;
}

export default CardGroup;

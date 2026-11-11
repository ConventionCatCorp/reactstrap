import type { ElementType, Ref } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface CardOwnProps {
  /** Toggles card padding using `.card-body` */
  body?: boolean;
  /** Add custom class */
  className?: string;
  /** Change background color of component */
  color?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  innerRef?: Ref<any>;
  /** Inverts the color */
  inverse?: boolean;
  /** Changes the card to have only outline */
  outline?: boolean;
}

export type CardProps<T extends ElementType = 'div'> = CardOwnProps &
  PolymorphicExtras<CardOwnProps, T>;

function Card<T extends ElementType = 'div'>({
  className,
  cssModule,
  color,
  body,
  inverse,
  outline,
  tag,
  innerRef,
  ref,
  ...attributes
}: CardProps<T>) {
  const classes = mapToCssModules(
    classNames(
      className,
      'card',
      inverse && 'text-white',
      body && 'card-body',
      color && `${outline ? 'border' : 'bg'}-${color}`,
    ),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'div';

  return <Tag {...attributes} className={classes} ref={innerRef ?? ref} />;
}

export default Card;

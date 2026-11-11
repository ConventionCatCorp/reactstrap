import type { ElementType, Ref } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface CardBodyOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  innerRef?: Ref<any>;
}

export type CardBodyProps<T extends ElementType = 'div'> = CardBodyOwnProps &
  PolymorphicExtras<CardBodyOwnProps, T>;

function CardBody<T extends ElementType = 'div'>({
  className,
  cssModule,
  innerRef,
  ref,
  tag,
  ...attributes
}: CardBodyProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'card-body'),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'div';
  return <Tag {...attributes} className={classes} ref={innerRef ?? ref} />;
}

export default CardBody;

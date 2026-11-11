import type { ElementType, Ref } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface CardLinkOwnProps {
  innerRef?: Ref<any>;
  className?: string;
  cssModule?: CSSModule;
}

export type CardLinkProps<T extends ElementType = 'a'> = CardLinkOwnProps &
  PolymorphicExtras<CardLinkOwnProps, T>;

function CardLink<T extends ElementType = 'a'>({
  className,
  cssModule,
  tag,
  innerRef,
  ref,
  ...attributes
}: CardLinkProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'card-link'),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'a';
  return <Tag {...attributes} ref={innerRef ?? ref} className={classes} />;
}

export default CardLink;

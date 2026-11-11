import type { ElementType, Ref } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface BadgeOwnProps {
  /** Add custom class */
  className?: string;
  /** Change background color of Badge */
  color?: string;
  /** Change existing className with a new className */
  cssModule?: CSSModule;
  /** Renders an `<a>` when `tag` is left as `span` */
  href?: string;
  innerRef?: Ref<any>;
  /** Add rounded corners to the Badge */
  pill?: boolean;
}

export type BadgeProps<T extends ElementType = 'span'> = BadgeOwnProps &
  PolymorphicExtras<BadgeOwnProps, T>;

function Badge<T extends ElementType = 'span'>({
  className,
  cssModule,
  color = 'secondary',
  innerRef,
  ref,
  pill = false,
  tag,
  href,
  ...attributes
}: BadgeProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'badge', `bg-${color}`, pill && 'rounded-pill'),
    cssModule,
  );
  const Tag: ElementType = tag ?? (href ? 'a' : 'span');

  return (
    <Tag
      {...attributes}
      href={href}
      className={classes}
      ref={innerRef ?? ref}
    />
  );
}

export default Badge;

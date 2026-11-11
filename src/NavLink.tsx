import type { ElementType, MouseEvent, Ref } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface NavLinkOwnProps {
  /** Add active class to NavLink */
  active?: boolean;
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** Disable the link */
  disabled?: boolean;
  /** `#` prevents the default click */
  href?: string;
  innerRef?: Ref<any>;
  onClick?: (e: MouseEvent<any>) => void;
}

export type NavLinkProps<T extends ElementType = 'a'> = NavLinkOwnProps &
  PolymorphicExtras<NavLinkOwnProps, T>;

function NavLink<T extends ElementType = 'a'>({
  className,
  cssModule,
  active,
  disabled,
  href,
  tag,
  innerRef,
  ref,
  onClick,
  ...attributes
}: NavLinkProps<T>) {
  const Tag: ElementType = tag ?? 'a';
  const handleClick = (e: MouseEvent<any>) => {
    if (disabled || href === '#') e.preventDefault();
    if (!disabled) onClick?.(e);
  };

  const classes = mapToCssModules(
    classNames(className, 'nav-link', { disabled, active }),
    cssModule,
  );

  return (
    <Tag
      {...attributes}
      href={href}
      disabled={disabled}
      ref={innerRef ?? ref}
      onClick={handleClick}
      className={classes}
    />
  );
}

export default NavLink;

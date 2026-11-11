import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface NavItemOwnProps {
  /** Add active class to element */
  active?: boolean;
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type NavItemProps<T extends ElementType = 'li'> = NavItemOwnProps &
  PolymorphicExtras<NavItemOwnProps, T>;

function NavItem<T extends ElementType = 'li'>({
  className,
  cssModule,
  active,
  tag,
  ...attributes
}: NavItemProps<T>) {
  const Tag: ElementType = tag ?? 'li';
  const classes = mapToCssModules(
    classNames(className, 'nav-item', active && 'active'),
    cssModule,
  );

  return <Tag {...attributes} className={classes} />;
}

export default NavItem;

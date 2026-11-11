import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface NavbarTextOwnProps {
  /** Ignored (kept from older versions; not passed to the DOM) */
  active?: boolean;
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type NavbarTextProps<T extends ElementType = 'span'> =
  NavbarTextOwnProps & PolymorphicExtras<NavbarTextOwnProps, T>;

function NavbarText<T extends ElementType = 'span'>({
  className,
  cssModule,
  active: _active, // swallowed so it doesn't reach the DOM
  tag,
  ...attributes
}: NavbarTextProps<T>) {
  const Tag: ElementType = tag ?? 'span';
  const classes = mapToCssModules(
    classNames(className, 'navbar-text'),
    cssModule,
  );

  return <Tag {...attributes} className={classes} />;
}

export default NavbarText;

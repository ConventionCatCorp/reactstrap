import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface NavbarBrandOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type NavbarBrandProps<T extends ElementType = 'a'> =
  NavbarBrandOwnProps & PolymorphicExtras<NavbarBrandOwnProps, T>;

function NavbarBrand<T extends ElementType = 'a'>({
  className,
  cssModule,
  tag,
  ...attributes
}: NavbarBrandProps<T>) {
  const Tag: ElementType = tag ?? 'a';
  const classes = mapToCssModules(
    classNames(className, 'navbar-brand'),
    cssModule,
  );

  return <Tag {...attributes} className={classes} />;
}

export default NavbarBrand;

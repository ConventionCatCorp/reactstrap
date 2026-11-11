import type { ElementType, ReactNode } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface NavbarTogglerOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** Replaces the default `.navbar-toggler-icon` */
  children?: ReactNode;
}

export type NavbarTogglerProps<T extends ElementType = 'button'> =
  NavbarTogglerOwnProps & PolymorphicExtras<NavbarTogglerOwnProps, T>;

function NavbarToggler<T extends ElementType = 'button'>({
  className,
  cssModule,
  children,
  tag,
  ...attributes
}: NavbarTogglerProps<T>) {
  const Tag: ElementType = tag ?? 'button';
  const classes = mapToCssModules(
    classNames(className, 'navbar-toggler'),
    cssModule,
  );

  return (
    <Tag
      aria-label="Toggle navigation"
      type="button"
      {...attributes}
      className={classes}
    >
      {children || (
        <span className={mapToCssModules('navbar-toggler-icon', cssModule)} />
      )}
    </Tag>
  );
}

export default NavbarToggler;

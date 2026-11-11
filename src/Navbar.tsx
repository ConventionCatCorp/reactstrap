import type { ElementType, ReactNode } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface NavbarOwnProps {
  children?: ReactNode;
  /** Add custom class */
  className?: string;
  /** Theme the navbar by adding a background color */
  color?: string;
  /** Use any of the responsive containers to change how wide the content in your navbar is presented. */
  container?: boolean | 'fluid' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** This prop is passed if the background is dark, to make the text lighter */
  dark?: boolean;
  /** Breakpoint from which the navbar expands (`true` = always) */
  expand?: boolean | string;
  /** Make the navbar fixed (`fixed-${fixed}`), e.g. `top`, `bottom` */
  fixed?: string;
  /** Add `.navbar-light` class */
  light?: boolean;
  /** Use `position: sticky` (`sticky-${sticky}`), e.g. `top` */
  sticky?: string;
}

export type NavbarProps<T extends ElementType = 'nav'> = NavbarOwnProps &
  PolymorphicExtras<NavbarOwnProps, T>;

const getExpandClass = (expand: boolean | string) => {
  if (expand === false) return false;
  if (expand === true || expand === 'xs') return 'navbar-expand';
  return `navbar-expand-${expand}`;
};

function Navbar<T extends ElementType = 'nav'>({
  expand = false,
  className,
  cssModule,
  light,
  dark,
  fixed,
  sticky,
  color,
  container = 'fluid',
  tag,
  children,
  ...attributes
}: NavbarProps<T>) {
  const Tag: ElementType = tag ?? 'nav';
  const classes = mapToCssModules(
    classNames(className, 'navbar', getExpandClass(expand), {
      'navbar-light': light,
      'navbar-dark': dark,
      [`bg-${color}`]: color,
      [`fixed-${fixed}`]: fixed,
      [`sticky-${sticky}`]: sticky,
    }),
    cssModule,
  );

  return (
    <Tag {...attributes} className={classes}>
      {container ? (
        <div
          className={
            container === true ? 'container' : `container-${container}`
          }
        >
          {children}
        </div>
      ) : (
        children
      )}
    </Tag>
  );
}

export default Navbar;

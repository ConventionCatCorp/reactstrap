import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface NavOwnProps {
  /** Adding card prop adds `.card-header-tabs` or `.card-header-pills` class */
  card?: boolean;
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** fills the nav to extend to full available width */
  fill?: boolean;
  /** Change the horizontal alignment of your nav (`justify-content-${horizontal}`), e.g. `center`, `end` */
  horizontal?: string;
  /** All horizontal space will be occupied by nav links, but unlike the `fill` above, every nav item will be the same width. */
  justified?: boolean;
  /** Add navbar for a full-height and lightweight navigation */
  navbar?: boolean;
  /** Make NavItems look like pills */
  pills?: boolean;
  /** Make NavItems look like tabs */
  tabs?: boolean;
  /** Stack your navigation by changing the flex item direction; a breakpoint string makes it responsive */
  vertical?: boolean | string;
}

export type NavProps<T extends ElementType = 'ul'> = NavOwnProps &
  PolymorphicExtras<NavOwnProps, T>;

const getVerticalClass = (vertical: boolean | string) => {
  if (vertical === false) return false;
  if (vertical === true || vertical === 'xs') return 'flex-column';
  return `flex-${vertical}-column`;
};

function Nav<T extends ElementType = 'ul'>({
  className,
  cssModule,
  tabs,
  pills,
  vertical = false,
  horizontal,
  justified,
  fill,
  navbar,
  card,
  tag,
  ...attributes
}: NavProps<T>) {
  const Tag: ElementType = tag ?? 'ul';
  const classes = mapToCssModules(
    classNames(
      className,
      navbar ? 'navbar-nav' : 'nav',
      horizontal && `justify-content-${horizontal}`,
      getVerticalClass(vertical),
      {
        'nav-tabs': tabs,
        'card-header-tabs': card && tabs,
        'nav-pills': pills,
        'card-header-pills': card && pills,
        'nav-justified': justified,
        'nav-fill': fill,
      },
    ),
    cssModule,
  );

  return <Tag {...attributes} className={classes} />;
}

export default Nav;

import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface PaginationItemOwnProps {
  /** Set item as active */
  active?: boolean;
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** Set item as disabled */
  disabled?: boolean;
}

export type PaginationItemProps<T extends ElementType = 'li'> =
  PaginationItemOwnProps & PolymorphicExtras<PaginationItemOwnProps, T>;

function PaginationItem<T extends ElementType = 'li'>({
  active,
  className,
  cssModule,
  disabled,
  tag,
  ...attributes
}: PaginationItemProps<T>) {
  const Tag: ElementType = tag ?? 'li';
  const classes = mapToCssModules(
    classNames(className, 'page-item', { active, disabled }),
    cssModule,
  );

  return <Tag {...attributes} className={classes} />;
}

export default PaginationItem;

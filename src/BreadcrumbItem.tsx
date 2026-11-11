import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface BreadcrumbItemOwnProps {
  /** Adds a visual "active" state to a Breadcrumb Item */
  active?: boolean;
  /** Add custom class to the element */
  className?: string;
  /** Change existing className with a new className */
  cssModule?: CSSModule;
}

export type BreadcrumbItemProps<T extends ElementType = 'li'> =
  BreadcrumbItemOwnProps & PolymorphicExtras<BreadcrumbItemOwnProps, T>;

function BreadcrumbItem<T extends ElementType = 'li'>({
  className,
  cssModule,
  active,
  tag,
  ...attributes
}: BreadcrumbItemProps<T>) {
  const Tag: ElementType = tag ?? 'li';
  const classes = mapToCssModules(
    classNames(className, active && 'active', 'breadcrumb-item'),
    cssModule,
  );

  return (
    <Tag
      {...attributes}
      className={classes}
      aria-current={active ? 'page' : undefined}
    />
  );
}

export default BreadcrumbItem;

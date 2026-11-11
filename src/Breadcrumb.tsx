import type { ElementType, ReactNode } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface BreadcrumbOwnProps {
  /** Aria label */
  'aria-label'?: string;
  children?: ReactNode;
  /** Add custom class */
  className?: string;
  /** Change existing className with a new className */
  cssModule?: CSSModule;
  /** Add custom class to list tag */
  listClassName?: string;
  /** Set a custom element for list tag */
  listTag?: ElementType;
}

export type BreadcrumbProps<T extends ElementType = 'nav'> =
  BreadcrumbOwnProps & PolymorphicExtras<BreadcrumbOwnProps, T>;

function Breadcrumb<T extends ElementType = 'nav'>({
  className,
  listClassName,
  cssModule,
  children,
  tag,
  listTag: ListTag = 'ol',
  'aria-label': label = 'breadcrumb',
  ...attributes
}: BreadcrumbProps<T>) {
  const Tag: ElementType = tag ?? 'nav';
  const classes = mapToCssModules(classNames(className), cssModule);
  const listClasses = mapToCssModules(
    classNames('breadcrumb', listClassName),
    cssModule,
  );

  return (
    <Tag {...attributes} className={classes} aria-label={label}>
      <ListTag className={listClasses}>{children}</ListTag>
    </Tag>
  );
}

export default Breadcrumb;

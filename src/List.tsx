import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface ListOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** Type of list `unstyled` or `inline` */
  type?: string;
}

export type ListProps<T extends ElementType = 'ul'> = ListOwnProps &
  PolymorphicExtras<ListOwnProps, T>;

function List<T extends ElementType = 'ul'>({
  className,
  cssModule,
  tag,
  type,
  ...attributes
}: ListProps<T>) {
  const classes = mapToCssModules(
    classNames(className, type && `list-${type}`),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'ul';
  return <Tag {...attributes} className={classes} />;
}

export default List;

import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface ListGroupItemHeadingOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type ListGroupItemHeadingProps<T extends ElementType = 'h5'> =
  ListGroupItemHeadingOwnProps &
    PolymorphicExtras<ListGroupItemHeadingOwnProps, T>;

function ListGroupItemHeading<T extends ElementType = 'h5'>({
  className,
  cssModule,
  tag,
  ...attributes
}: ListGroupItemHeadingProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'list-group-item-heading'),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'h5';
  return <Tag {...attributes} className={classes} />;
}

export default ListGroupItemHeading;

import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface ListGroupItemTextOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type ListGroupItemTextProps<T extends ElementType = 'p'> =
  ListGroupItemTextOwnProps & PolymorphicExtras<ListGroupItemTextOwnProps, T>;

function ListGroupItemText<T extends ElementType = 'p'>({
  className,
  cssModule,
  tag,
  ...attributes
}: ListGroupItemTextProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'list-group-item-text'),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'p';
  return <Tag {...attributes} className={classes} />;
}

export default ListGroupItemText;

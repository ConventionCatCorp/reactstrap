import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface ListInlineItemOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type ListInlineItemProps<T extends ElementType = 'li'> =
  ListInlineItemOwnProps & PolymorphicExtras<ListInlineItemOwnProps, T>;

function ListInlineItem<T extends ElementType = 'li'>({
  className,
  cssModule,
  tag,
  ...attributes
}: ListInlineItemProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'list-inline-item'),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'li';
  return <Tag {...attributes} className={classes} />;
}

export default ListInlineItem;

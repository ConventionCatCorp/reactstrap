import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface ListGroupOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** Remove borders to make the list appear flush */
  flush?: boolean;
  /** Make the list horizontal instead of vertical; pass a breakpoint (e.g. `md`) to make it responsive */
  horizontal?: boolean | string;
  /** Add number to the ListItems */
  numbered?: boolean;
}

export type ListGroupProps<T extends ElementType = 'ul'> = ListGroupOwnProps &
  PolymorphicExtras<ListGroupOwnProps, T>;

const getHorizontalClass = (horizontal: boolean | string) => {
  if (horizontal === false) return false;
  if (horizontal === true || horizontal === 'xs') {
    return 'list-group-horizontal';
  }
  return `list-group-horizontal-${horizontal}`;
};

function ListGroup<T extends ElementType = 'ul'>({
  className,
  cssModule,
  tag,
  flush,
  horizontal = false,
  numbered = false,
  ...attributes
}: ListGroupProps<T>) {
  const classes = mapToCssModules(
    classNames(
      className,
      'list-group',
      // list-group-horizontal cannot currently be mixed with list-group-flush
      // we only try to apply horizontal classes if flush is false
      flush ? 'list-group-flush' : getHorizontalClass(horizontal),
      { 'list-group-numbered': numbered },
    ),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'ul';

  return <Tag {...attributes} className={classes} />;
}

export default ListGroup;

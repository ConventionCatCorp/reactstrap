import type { ElementType, Ref } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface TableOwnProps {
  /** Adds border to all sides of table */
  bordered?: boolean;
  /** Removes all borders */
  borderless?: boolean;
  /** Adds custom class name to component */
  className?: string;
  cssModule?: CSSModule;
  /** Makes the table dark */
  dark?: boolean;
  /** Enables a hover state on the rows within `<tbody>` */
  hover?: boolean;
  innerRef?: Ref<any>;
  /** Responsive tables allow tables to be scrolled horizontally with ease; pass a breakpoint (e.g. `md`) to limit it */
  responsive?: boolean | string;
  /** Element wrapping the table when `responsive` is set */
  responsiveTag?: ElementType;
  /** Make tables more compact by cutting cell padding in half when setting size as sm. */
  size?: string;
  /** Adds zebra-striping to any table row within the `<tbody>` */
  striped?: boolean;
}

export type TableProps<T extends ElementType = 'table'> = TableOwnProps &
  PolymorphicExtras<TableOwnProps, T>;

function Table<T extends ElementType = 'table'>({
  className,
  cssModule,
  size,
  bordered,
  borderless,
  striped,
  dark,
  hover,
  responsive,
  tag,
  responsiveTag: ResponsiveTag = 'div',
  innerRef,
  ref,
  ...attributes
}: TableProps<T>) {
  const classes = mapToCssModules(
    classNames(
      className,
      'table',
      size && `table-${size}`,
      bordered && 'table-bordered',
      borderless && 'table-borderless',
      striped && 'table-striped',
      dark && 'table-dark',
      hover && 'table-hover',
    ),
    cssModule,
  );

  const Tag: ElementType = tag ?? 'table';
  const table = (
    <Tag {...attributes} ref={innerRef ?? ref} className={classes} />
  );

  if (!responsive) return table;

  const responsiveClassName = mapToCssModules(
    responsive === true ? 'table-responsive' : `table-responsive-${responsive}`,
    cssModule,
  );

  return <ResponsiveTag className={responsiveClassName}>{table}</ResponsiveTag>;
}

export default Table;

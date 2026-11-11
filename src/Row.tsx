import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

const rowColWidths = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

type RowCols = number | string;

export interface RowOwnProps {
  className?: string;
  cssModule?: CSSModule;
  /** Columns per row (`.row-cols-*`) */
  xs?: RowCols;
  sm?: RowCols;
  md?: RowCols;
  lg?: RowCols;
  xl?: RowCols;
  xxl?: RowCols;
  /** Custom breakpoint names; the first one is treated as the base breakpoint */
  widths?: string[];
}

export type RowProps<T extends ElementType = 'div'> = RowOwnProps &
  PolymorphicExtras<RowOwnProps, T>;

function Row<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  widths = rowColWidths,
  ...rest
}: RowProps<T>) {
  const attributes: Record<string, any> = rest;
  const colClasses: string[] = [];

  widths.forEach((colWidth, i) => {
    const colSize = attributes[colWidth];
    delete attributes[colWidth];
    if (!colSize) return;
    colClasses.push(
      i ? `row-cols-${colWidth}-${colSize}` : `row-cols-${colSize}`,
    );
  });

  const classes = mapToCssModules(
    classNames(className, 'row', colClasses),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'div';

  return <Tag {...attributes} className={classes} />;
}

export default Row;

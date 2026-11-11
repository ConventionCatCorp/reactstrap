import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  isObject,
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

const colWidths = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

export type ColumnProps =
  | string
  | boolean
  | number
  | {
      size?: boolean | number | string;
      offset?: string | number;
      order?: string | number;
    };

/** Breakpoint column props shared by `Col`, `Placeholder` and `PlaceholderButton`. */
export interface ColumnSizeProps {
  xs?: ColumnProps;
  sm?: ColumnProps;
  md?: ColumnProps;
  lg?: ColumnProps;
  xl?: ColumnProps;
  xxl?: ColumnProps;
  /** Custom breakpoint names; the first one is treated as the base breakpoint */
  widths?: string[];
}

export interface ColOwnProps extends ColumnSizeProps {
  className?: string;
  cssModule?: CSSModule;
}

export type ColProps<T extends ElementType = 'div'> = ColOwnProps &
  PolymorphicExtras<ColOwnProps, T>;

const getColumnSizeClass = (
  isXs: boolean,
  colWidth: string,
  colSize: unknown,
) => {
  if (colSize === true || colSize === '') {
    return isXs ? 'col' : `col-${colWidth}`;
  }
  if (colSize === 'auto') {
    return isXs ? 'col-auto' : `col-${colWidth}-auto`;
  }
  return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
};

/** Strips breakpoint props from `attributes` (mutates it) and returns their classes. */
export const getColumnClasses = <T extends object>(
  modifiedAttributes: T,
  cssModule?: CSSModule,
  widths: string[] = colWidths,
) => {
  const attributes = modifiedAttributes as Record<string, any>;
  const colClasses: string[] = [];

  widths.forEach((colWidth, i) => {
    const columnProp = attributes[colWidth];
    delete attributes[colWidth];

    if (!columnProp && columnProp !== '') return;

    const isXs = !i;

    if (isObject(columnProp)) {
      const { size, order, offset } = columnProp as Exclude<
        ColumnProps,
        string | boolean | number
      >;
      const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
      const colClass = getColumnSizeClass(isXs, colWidth, size);

      colClasses.push(
        mapToCssModules(
          classNames({
            [colClass]: size || size === '',
            [`order${colSizeInterfix}${order}`]: order || order === 0,
            [`offset${colSizeInterfix}${offset}`]: offset || offset === 0,
          }),
          cssModule,
        ),
      );
    } else {
      colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    }
  });

  return { colClasses, modifiedAttributes };
};

function Col<T extends ElementType = 'div'>({
  className,
  cssModule,
  widths = colWidths,
  tag,
  ...attributes
}: ColProps<T>) {
  const { modifiedAttributes, colClasses } = getColumnClasses(
    attributes,
    cssModule,
    widths,
  );

  if (!colClasses.length) {
    colClasses.push('col');
  }

  const classes = mapToCssModules(classNames(className, colClasses), cssModule);
  const Tag: ElementType = tag ?? 'div';

  return <Tag {...modifiedAttributes} className={classes} />;
}

export default Col;

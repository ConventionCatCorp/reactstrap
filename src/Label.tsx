import type { ElementType } from 'react';
import classNames from 'classnames';
import { getColumnClasses, type ColumnSizeProps } from './Col';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface LabelOwnProps extends ColumnSizeProps {
  className?: string;
  /** Visually hide the label (`.visually-hidden`), keeping it for screen readers */
  hidden?: boolean;
  /** Label for a checkbox/radio (`.form-check-label`) */
  check?: boolean;
  /** Horizontal form label size (`col-form-label-${size}`) */
  size?: string;
  /** Alias of `htmlFor` */
  for?: string;
  cssModule?: CSSModule;
}

export type LabelProps<T extends ElementType = 'label'> = LabelOwnProps &
  PolymorphicExtras<LabelOwnProps, T>;

function Label<T extends ElementType = 'label'>({
  className,
  cssModule,
  hidden,
  widths,
  tag,
  check,
  size,
  for: htmlFor,
  ...attributes
}: LabelProps<T>) {
  const Tag: ElementType = tag ?? 'label';
  const { colClasses, modifiedAttributes } = getColumnClasses(
    attributes,
    cssModule,
    widths,
  );
  const colFormLabel = size || colClasses.length;

  const classes = mapToCssModules(
    classNames(
      className,
      hidden && 'visually-hidden',
      check && 'form-check-label',
      size && `col-form-label-${size}`,
      colClasses,
      colFormLabel && 'col-form-label',
      !(check || colFormLabel) && 'form-label',
    ),
    cssModule,
  );

  return <Tag htmlFor={htmlFor} {...modifiedAttributes} className={classes} />;
}

export default Label;

import type { ElementType, Ref } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type ThemeColor,
  type PolymorphicExtras,
} from './utils';
import { getColumnClasses, type ColumnSizeProps } from './Col';

export interface PlaceholderOwnProps extends ColumnSizeProps {
  /** Add custom color to the placeholder */
  color?: ThemeColor;
  /** Apply either `glow` or `wave` animation. */
  animation?: 'glow' | 'wave';
  className?: string;
  cssModule?: CSSModule;
  /** Make the size larger or smaller: `lg`, `sm` or `xs` */
  size?: 'xs' | 'sm' | 'lg';
  innerRef?: Ref<any>;
}

export type PlaceholderProps<T extends ElementType = 'span'> =
  PlaceholderOwnProps & PolymorphicExtras<PlaceholderOwnProps, T>;

function Placeholder<T extends ElementType = 'span'>({
  className,
  cssModule,
  color,
  innerRef,
  ref,
  tag,
  animation,
  size,
  widths,
  ...attributes
}: PlaceholderProps<T>) {
  const { modifiedAttributes, colClasses } = getColumnClasses(
    attributes,
    cssModule,
    widths,
  );

  const classes = mapToCssModules(
    classNames(
      className,
      colClasses,
      animation ? `placeholder-${animation}` : 'placeholder',
      size && `placeholder-${size}`,
      color && `bg-${color}`,
    ),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'span';

  return (
    <Tag {...modifiedAttributes} className={classes} ref={innerRef ?? ref} />
  );
}

export default Placeholder;

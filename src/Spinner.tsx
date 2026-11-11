import type { ElementType, ReactNode } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface SpinnerOwnProps {
  /** Change animation of spinner: `border` or `grow` */
  type?: string;
  /** Change size of spinner (`sm`) */
  size?: string;
  /** Change color of spinner (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`) */
  color?: string;
  /** Add custom class */
  className?: string;
  /** Change existing className with a new className */
  cssModule?: CSSModule;
  /** Visually hidden label, defaults to `Loading...` */
  children?: ReactNode;
}

export type SpinnerProps<T extends ElementType = 'div'> = SpinnerOwnProps &
  PolymorphicExtras<SpinnerOwnProps, T>;

function Spinner<T extends ElementType = 'div'>({
  className,
  cssModule,
  type = 'border',
  size,
  color,
  children = 'Loading...',
  tag,
  ...attributes
}: SpinnerProps<T>) {
  const classes = mapToCssModules(
    classNames(
      className,
      size && `spinner-${type}-${size}`,
      `spinner-${type}`,
      color && `text-${color}`,
    ),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'div';

  return (
    // Bootstrap markup: spinner is a div with role=status; tag is configurable.
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
    <Tag role="status" {...attributes} className={classes}>
      {children && (
        <span className={mapToCssModules('visually-hidden', cssModule)}>
          {children}
        </span>
      )}
    </Tag>
  );
}

export default Spinner;

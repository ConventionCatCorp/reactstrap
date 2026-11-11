import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface ButtonGroupOwnProps {
  /** Aria label */
  'aria-label'?: string;
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** In order for assistive technologies (such as screen readers) to convey that a series of buttons is grouped, an appropriate role attribute needs to be provided. For button groups, this would be role="group", while toolbars should have a role="toolbar". */
  role?: string;
  /** Make the button bigger or smaller */
  size?: string;
  /** Make button group vertical */
  vertical?: boolean;
}

export type ButtonGroupProps<T extends ElementType = 'div'> =
  ButtonGroupOwnProps & PolymorphicExtras<ButtonGroupOwnProps, T>;

function ButtonGroup<T extends ElementType = 'div'>({
  className,
  cssModule,
  size,
  vertical,
  tag,
  ...attributes
}: ButtonGroupProps<T>) {
  const classes = mapToCssModules(
    classNames(
      className,
      size && `btn-group-${size}`,
      vertical ? 'btn-group-vertical' : 'btn-group',
    ),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'div';

  // Bootstrap markup: `.btn-group` is a div with role=group; tag is configurable.
  // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
  return <Tag role="group" {...attributes} className={classes} />;
}

export default ButtonGroup;

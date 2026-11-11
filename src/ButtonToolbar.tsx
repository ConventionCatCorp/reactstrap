import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface ButtonToolbarOwnProps {
  /** Aria label */
  'aria-label'?: string;
  /** Add custom class */
  className?: string;
  /** Change existing className with a new className */
  cssModule?: CSSModule;
  /** In order for assistive technologies (such as screen readers) to convey that a series of buttons is grouped, an appropriate role attribute needs to be provided. For button groups, this would be role="group", while toolbars should have a role="toolbar". */
  role?: string;
}

export type ButtonToolbarProps<T extends ElementType = 'div'> =
  ButtonToolbarOwnProps & PolymorphicExtras<ButtonToolbarOwnProps, T>;

function ButtonToolbar<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  ...attributes
}: ButtonToolbarProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'btn-toolbar'),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'div';

  return <Tag role="toolbar" {...attributes} className={classes} />;
}

export default ButtonToolbar;

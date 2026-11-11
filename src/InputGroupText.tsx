import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface InputGroupTextOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type InputGroupTextProps<T extends ElementType = 'span'> =
  InputGroupTextOwnProps & PolymorphicExtras<InputGroupTextOwnProps, T>;

function InputGroupText<T extends ElementType = 'span'>({
  className,
  cssModule,
  tag,
  ...attributes
}: InputGroupTextProps<T>) {
  const Tag: ElementType = tag ?? 'span';
  const classes = mapToCssModules(
    classNames(className, 'input-group-text'),
    cssModule,
  );

  return <Tag {...attributes} className={classes} />;
}

export default InputGroupText;

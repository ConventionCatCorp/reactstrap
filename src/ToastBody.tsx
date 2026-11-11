import type { ElementType, Ref } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface ToastBodyOwnProps {
  className?: string;
  cssModule?: CSSModule;
  innerRef?: Ref<any>;
}

export type ToastBodyProps<T extends ElementType = 'div'> = ToastBodyOwnProps &
  PolymorphicExtras<ToastBodyOwnProps, T>;

function ToastBody<T extends ElementType = 'div'>({
  className,
  cssModule,
  innerRef,
  ref,
  tag,
  ...attributes
}: ToastBodyProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const classes = mapToCssModules(
    classNames(className, 'toast-body'),
    cssModule,
  );

  return <Tag {...attributes} className={classes} ref={innerRef ?? ref} />;
}

export default ToastBody;

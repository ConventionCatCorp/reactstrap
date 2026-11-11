import type { ElementType, ReactNode, Ref } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';
import Fade, { type FadeProps } from './Fade';

export interface ToastOwnProps {
  children?: ReactNode;
  className?: string;
  cssModule?: CSSModule;
  /** Toggle fade animation */
  fade?: boolean;
  innerRef?: Ref<HTMLElement>;
  /** Control visibility state of Toast */
  isOpen?: boolean;
  /** Props to be passed to `Fade` to modify transition */
  transition?: Partial<FadeProps>;
}

export type ToastProps<T extends ElementType = 'div'> = ToastOwnProps &
  PolymorphicExtras<ToastOwnProps, T>;

function Toast<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  isOpen = true,
  children,
  transition = { unmountOnExit: true },
  fade = true,
  innerRef,
  ref,
  ...attributes
}: ToastProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const classes = mapToCssModules(classNames(className, 'toast'), cssModule);

  const toastTransition = {
    ...transition,
    baseClass: fade ? transition.baseClass : '',
    timeout: fade ? transition.timeout : 0,
  };

  return (
    <Fade
      {...attributes}
      {...toastTransition}
      tag={Tag}
      className={classes}
      in={isOpen}
      role="alert"
      innerRef={innerRef ?? (ref as Ref<HTMLElement> | undefined)}
    >
      {children}
    </Fade>
  );
}

export default Toast;

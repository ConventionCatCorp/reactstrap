import type { ElementType, MouseEventHandler, ReactNode, Ref } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';
import Fade, { type FadeProps } from './Fade';

export interface AlertOwnProps {
  /** Pass children so this component can wrap the child elements */
  children?: ReactNode;
  /** Add custom class */
  className?: string;
  /** Add custom class for close button */
  closeClassName?: string;
  /** Aria label for close button */
  closeAriaLabel?: string;
  /** Change color of alert */
  color?: string;
  /** Change existing className with a new className */
  cssModule?: CSSModule;
  /** Toggle fade animation */
  fade?: boolean;
  innerRef?: Ref<HTMLElement>;
  /** Control visibility state of Alert */
  isOpen?: boolean;
  /** Function to toggle visibility */
  toggle?: MouseEventHandler<any>;
  /** Props to be passed to `Fade` to modify transition */
  transition?: Partial<FadeProps>;
}

export type AlertProps<T extends ElementType = 'div'> = AlertOwnProps &
  PolymorphicExtras<AlertOwnProps, T>;

function Alert<T extends ElementType = 'div'>({
  className,
  closeClassName,
  closeAriaLabel = 'Close',
  cssModule,
  tag,
  color = 'success',
  isOpen = true,
  toggle,
  children,
  transition = { unmountOnExit: true },
  fade = true,
  innerRef,
  ref,
  ...attributes
}: AlertProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const classes = mapToCssModules(
    classNames(className, 'alert', `alert-${color}`, {
      'alert-dismissible': toggle,
    }),
    cssModule,
  );

  const closeClasses = mapToCssModules(
    classNames('btn-close', closeClassName),
    cssModule,
  );

  const alertTransition = {
    ...transition,
    baseClass: fade ? transition.baseClass : '',
    timeout: fade ? transition.timeout : 0,
  };

  return (
    <Fade
      {...attributes}
      {...alertTransition}
      tag={Tag}
      className={classes}
      in={isOpen}
      role="alert"
      innerRef={innerRef ?? (ref as Ref<HTMLElement> | undefined)}
    >
      {toggle ? (
        <button
          type="button"
          className={closeClasses}
          aria-label={closeAriaLabel}
          onClick={toggle}
        />
      ) : null}
      {children}
    </Fade>
  );
}

export default Alert;

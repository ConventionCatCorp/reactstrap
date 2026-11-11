import type {
  ComponentPropsWithRef,
  ElementType,
  MouseEventHandler,
  ReactNode,
} from 'react';
import classNames from 'classnames';
import { mapToCssModules, type CSSModule } from './utils';

/** Props go to the wrapper (`wrapTag`, a `div` by default). */
export interface ToastHeaderProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode;
  className?: string;
  /** Custom close button */
  close?: ReactNode;
  /** Aria label for the default close button */
  closeAriaLabel?: string;
  cssModule?: CSSModule;
  /** Bootstrap color for a square icon, or a custom icon node */
  icon?: string | ReactNode;
  /** Set a custom element for the title */
  tag?: ElementType;
  /** Class name of the title element */
  tagClassName?: string;
  /** Function to be triggered when close button is clicked */
  toggle?: MouseEventHandler<any>;
  /** Set a custom element for the wrapper */
  wrapTag?: ElementType;
}

function ToastHeader({
  className,
  cssModule,
  children,
  toggle,
  tag: Tag = 'strong',
  wrapTag: WrapTag = 'div',
  closeAriaLabel = 'Close',
  close,
  tagClassName = 'me-auto',
  icon: iconProp,
  ...attributes
}: ToastHeaderProps) {
  const classes = mapToCssModules(
    classNames(className, 'toast-header'),
    cssModule,
  );

  const closeButton = !close && toggle && (
    <button
      type="button"
      onClick={toggle}
      className={mapToCssModules('btn-close', cssModule)}
      aria-label={closeAriaLabel}
    />
  );

  const icon =
    typeof iconProp === 'string' ? (
      <svg
        className={mapToCssModules(`rounded text-${iconProp}`)}
        width="20"
        height="20"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- an <svg> needs role="img"
        role="img"
      >
        <rect fill="currentColor" width="100%" height="100%" />
      </svg>
    ) : (
      iconProp || undefined
    );

  return (
    <WrapTag {...attributes} className={classes}>
      {icon}
      <Tag
        className={mapToCssModules(
          classNames(tagClassName, { 'ms-2': icon != null }),
          cssModule,
        )}
      >
        {children}
      </Tag>
      {close || closeButton}
    </WrapTag>
  );
}

export default ToastHeader;

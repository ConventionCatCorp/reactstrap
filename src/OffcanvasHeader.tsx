import type {
  ComponentPropsWithRef,
  ElementType,
  MouseEventHandler,
  ReactNode,
} from 'react';
import classNames from 'classnames';
import { mapToCssModules, type CSSModule } from './utils';

/** Props go to the wrapper (`wrapTag`, a `div` by default). */
export interface OffcanvasHeaderProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode;
  /** Add custom class */
  className?: string;
  /** Custom close button */
  close?: ReactNode;
  /** Aria label for the default close button */
  closeAriaLabel?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** Set a custom element for the title */
  tag?: ElementType;
  /** Function to be triggered when close button is clicked */
  toggle?: MouseEventHandler<any>;
  /** Set a custom element for the wrapper */
  wrapTag?: ElementType;
}

function OffcanvasHeader({
  className,
  cssModule,
  children,
  toggle,
  tag: Tag = 'h5',
  wrapTag: WrapTag = 'div',
  closeAriaLabel = 'Close',
  close,
  ...attributes
}: OffcanvasHeaderProps) {
  const classes = mapToCssModules(
    classNames(className, 'offcanvas-header'),
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

  return (
    <WrapTag {...attributes} className={classes}>
      <Tag className={mapToCssModules('offcanvas-title', cssModule)}>
        {children}
      </Tag>
      {close || closeButton}
    </WrapTag>
  );
}

export default OffcanvasHeader;

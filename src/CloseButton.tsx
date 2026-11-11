import type { ButtonHTMLAttributes, Ref } from 'react';
import classNames from 'classnames';
import { mapToCssModules, type CSSModule } from './utils';

export interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Change the variant to white */
  variant?: 'white';
  className?: string;
  cssModule?: CSSModule;
  innerRef?: Ref<HTMLButtonElement>;
  ref?: Ref<HTMLButtonElement>;
}

function CloseButton({
  className,
  cssModule,
  variant,
  innerRef,
  ref,
  ...attributes
}: CloseButtonProps) {
  const classes = mapToCssModules(
    classNames(className, 'btn-close', variant && `btn-close-${variant}`),
    cssModule,
  );

  return (
    <button
      ref={innerRef ?? ref}
      type="button"
      className={classes}
      aria-label="close"
      {...attributes}
    />
  );
}

export default CloseButton;

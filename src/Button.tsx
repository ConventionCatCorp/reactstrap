import type { ElementType, MouseEvent, Ref } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';
import CloseButton from './CloseButton';

export interface ButtonOwnProps {
  /** Manually set the visual state of the button to active */
  active?: boolean;
  /** Make the button full width (`.d-block.w-100`) */
  block?: boolean;
  /** Add custom class */
  className?: string;
  /** Change existing className with a new className */
  cssModule?: CSSModule;
  /** Use the button as a close button */
  close?: boolean;
  /** Change color of Button to one of the available colors */
  color?: string;
  /** Disables the button */
  disabled?: boolean;
  /** Renders an `<a>` when `tag` is left as `button` */
  href?: string;
  innerRef?: Ref<any>;
  /** Function to be triggered on click */
  onClick?: (e: MouseEvent<any>) => any;
  /** Adds outline to the button */
  outline?: boolean;
  /** Make the button bigger or smaller */
  size?: string;
}

export type ButtonProps<T extends ElementType = 'button'> = ButtonOwnProps &
  PolymorphicExtras<ButtonOwnProps, T>;

function Button<T extends ElementType = 'button'>({
  active,
  block,
  className,
  close,
  cssModule,
  color = 'secondary',
  outline,
  size,
  tag,
  innerRef,
  ref,
  onClick,
  disabled,
  href,
  ...attributes
}: ButtonProps<T>) {
  if (close) {
    return (
      <CloseButton {...attributes} onClick={onClick} disabled={disabled} />
    );
  }

  const handleClick = (e: MouseEvent<any>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    return onClick?.(e);
  };

  const classes = mapToCssModules(
    classNames(
      className,
      'btn',
      `btn${outline ? '-outline' : ''}-${color}`,
      size && `btn-${size}`,
      block && 'd-block w-100',
      { active, disabled },
    ),
    cssModule,
  );

  const Tag: ElementType = tag ?? (href ? 'a' : 'button');

  return (
    <Tag
      type={Tag === 'button' && onClick ? 'button' : undefined}
      {...attributes}
      href={href}
      disabled={disabled}
      className={classes}
      ref={innerRef ?? ref}
      onClick={handleClick}
    />
  );
}

export default Button;

import {
  useState,
  type ElementType,
  type FocusEvent,
  type MouseEvent,
} from 'react';
import classNames from 'classnames';
import Button, { type ButtonOwnProps, type ButtonProps } from './Button';
import { mapToCssModules, type PolymorphicExtras } from './utils';

export interface ButtonToggleOwnProps extends ButtonOwnProps {
  /** Initial toggled (active) state */
  defaultValue?: boolean;
  onBlur?: (e: FocusEvent<any>) => void;
  onFocus?: (e: FocusEvent<any>) => void;
}

export type ButtonToggleProps<T extends ElementType = 'button'> =
  ButtonToggleOwnProps & PolymorphicExtras<ButtonToggleOwnProps, T>;

function ButtonToggle<T extends ElementType = 'button'>({
  className,
  defaultValue = false,
  onClick,
  onBlur,
  onFocus,
  ...attributes
}: ButtonToggleProps<T>) {
  const [toggled, setToggled] = useState(defaultValue);
  const [focus, setFocus] = useState(false);

  const classes = mapToCssModules(
    classNames(className, { focus }),
    attributes.cssModule,
  );

  return (
    <Button
      active={toggled}
      onBlur={(e: FocusEvent<HTMLButtonElement>) => {
        onBlur?.(e);
        setFocus(false);
      }}
      onFocus={(e: FocusEvent<HTMLButtonElement>) => {
        onFocus?.(e);
        setFocus(true);
      }}
      onClick={(e: MouseEvent<any>) => {
        onClick?.(e);
        setToggled((t) => !t);
      }}
      className={classes}
      {...(attributes as ButtonProps<ElementType>)}
    />
  );
}

export default ButtonToggle;

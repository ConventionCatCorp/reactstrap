import type { ElementType, Ref } from 'react';
import Dropdown, { type DropdownProps } from './Dropdown';

/** `Dropdown` rendered as a `.btn-group` (`group` defaults to `true`). */
export type ButtonDropdownProps<T extends ElementType = 'div'> =
  DropdownProps<T> & {
    /** The underlying `Dropdown` instance. */
    ref?: Ref<Dropdown>;
  };

function ButtonDropdown<T extends ElementType = 'div'>(
  props: ButtonDropdownProps<T>,
) {
  return <Dropdown group {...(props as DropdownProps)} />;
}

export default ButtonDropdown;

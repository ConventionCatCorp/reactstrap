import { useState, type ElementType, type Ref } from 'react';
import ButtonDropdown from './ButtonDropdown';
import type {
  default as Dropdown,
  DropdownOwnProps,
  DropdownProps,
} from './Dropdown';
import type { PolymorphicClassExtras } from './utils';

export interface UncontrolledButtonDropdownOwnProps extends DropdownOwnProps {
  /** Initial open state. */
  defaultOpen?: boolean;
  /** The underlying `Dropdown` instance. */
  ref?: Ref<Dropdown>;
}

export type UncontrolledButtonDropdownProps<T extends ElementType = 'div'> =
  UncontrolledButtonDropdownOwnProps &
    PolymorphicClassExtras<UncontrolledButtonDropdownOwnProps, T>;

function UncontrolledButtonDropdown<T extends ElementType = 'div'>({
  defaultOpen = false,
  ...props
}: UncontrolledButtonDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <ButtonDropdown
      isOpen={isOpen}
      toggle={() => setIsOpen((o) => !o)}
      {...(props as DropdownProps)}
    />
  );
}

export default UncontrolledButtonDropdown;

import {
  Component,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
} from 'react';
import Dropdown, {
  type DropdownOwnProps,
  type DropdownProps,
} from './Dropdown';
import { omit, type PolymorphicClassExtras } from './utils';

export interface UncontrolledDropdownOwnProps extends DropdownOwnProps {
  /** Initial open state. */
  defaultOpen?: boolean;
  /** Called after the open state changed. */
  onToggle?: (event: KeyboardEvent | MouseEvent, isOpen: boolean) => void;
}

/** Extra props are typed by `tag` (default `div`); `onToggle` replaces the DOM `toggle` event. */
export type UncontrolledDropdownProps<T extends ElementType = 'div'> =
  UncontrolledDropdownOwnProps &
    PolymorphicClassExtras<UncontrolledDropdownOwnProps, T>;

interface UncontrolledDropdownState {
  isOpen: boolean;
}

class UncontrolledDropdown<T extends ElementType = 'div'> extends Component<
  UncontrolledDropdownProps<T>,
  UncontrolledDropdownState
> {
  // Not `Readonly<P>`: lets JSX infer `T` from a string `tag` (else it widens to `ElementType`).
  declare props: UncontrolledDropdownProps<T>;
  constructor(props: UncontrolledDropdownProps<T>) {
    super(props);
    this.state = { isOpen: props.defaultOpen || false };
  }

  // Class kept so `onToggle` keeps firing after commit (setState callback).
  toggle = (e?: SyntheticEvent | Event) => {
    this.setState(
      ({ isOpen }) => ({ isOpen: !isOpen }),
      () => this.props.onToggle?.(e as MouseEvent, this.state.isOpen),
    );
  };

  override render() {
    return (
      <Dropdown
        isOpen={this.state.isOpen}
        toggle={this.toggle}
        {...(omit(this.props, ['defaultOpen', 'onToggle']) as DropdownProps)}
      />
    );
  }
}

export default UncontrolledDropdown;

import {
  Children,
  cloneElement,
  Component,
  createRef,
  isValidElement,
  type ContextType,
  type ElementType,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import classNames from 'classnames';
import { Manager } from './popper';
import {
  DropdownContext,
  type DropdownContextValue,
  type DropdownDirection,
} from './DropdownContext';
import { InputGroupContext } from './InputGroupContext';
import {
  keyCodes,
  mapToCssModules,
  omit,
  type CSSModule,
  type PolymorphicClassExtras,
} from './utils';

export interface DropdownOwnProps {
  /** Keyboard navigation (tab through items). @default true */
  a11y?: boolean;
  disabled?: boolean;
  /** @default 'down' */
  direction?: DropdownDirection;
  /** Render as `.btn-group` instead of `.dropdown`. */
  group?: boolean;
  isOpen?: boolean;
  /** Render as a nav item (`li.nav-item`). */
  nav?: boolean;
  /** Add `.active` when `nav`. */
  active?: boolean;
  /** Adds `.btn-group-${size}`. */
  size?: string;
  /** Called to open or close the menu. */
  toggle?: KeyboardEventHandler<any> | MouseEventHandler<any>;
  children?: ReactNode;
  className?: string;
  cssModule?: CSSModule;
  /** Shorthand for `direction="up"` (only when direction is `down`). */
  dropup?: boolean;
  /** Render the menu without popper (static positioning). */
  inNavbar?: boolean;
  /** Add `.active` when an item of the second child (the menu) is active. */
  setActiveFromChild?: boolean;
  /** ARIA role of the menu and its items. */
  menuRole?: DropdownContextValue['menuRole'];
}

/** Extra props are typed by `tag` (default `div`, `li` when `nav`). */
export type DropdownProps<T extends ElementType = 'div'> = DropdownOwnProps &
  PolymorphicClassExtras<DropdownOwnProps, T>;

type DropdownImplProps = DropdownOwnProps & {
  tag?: ElementType;
} & HTMLAttributes<HTMLElement>;

type AnyEvent = SyntheticEvent | Event;

const preventDefaultKeys: number[] = [
  keyCodes.space,
  keyCodes.enter,
  keyCodes.up,
  keyCodes.down,
  keyCodes.end,
  keyCodes.home,
];

const openKeys: number[] = [
  keyCodes.space,
  keyCodes.enter,
  keyCodes.up,
  keyCodes.down,
];

const isAlphanumeric = (which: number) => which >= 48 && which <= 90;

const namedKeys: Record<string, number> = {
  Tab: keyCodes.tab,
  Enter: keyCodes.enter,
  Escape: keyCodes.esc,
  ' ': keyCodes.space,
  End: keyCodes.end,
  Home: keyCodes.home,
  ArrowUp: keyCodes.up,
  ArrowDown: keyCodes.down,
};

/** Legacy `which`, derived from `key` when unset (e.g. user-event 14, synthetic events). */
function keyCodeOf(e: { which: number; key?: string }): number {
  if (e.which || !e.key) return e.which;
  if (Object.hasOwn(namedKeys, e.key)) return namedKeys[e.key];
  return /^[a-z0-9]$/i.test(e.key) ? e.key.toUpperCase().charCodeAt(0) : 0;
}

class Dropdown<T extends ElementType = 'div'> extends Component<
  DropdownProps<T>
> {
  // Not `Readonly<P>`: lets JSX infer `T` from a string `tag` (else it widens to `ElementType`).
  declare props: DropdownProps<T>;
  static override contextType = InputGroupContext;
  declare context: ContextType<typeof InputGroupContext>;

  containerRef = createRef<HTMLElement>();
  menuRef = createRef<HTMLElement>();
  toggleRef = createRef<HTMLElement>();
  private menuCtrl: HTMLElement | null = null;

  override componentDidMount() {
    this.handleProps();
  }

  override componentDidUpdate(prevProps: DropdownProps<T>) {
    if (this.props.isOpen !== prevProps.isOpen) this.handleProps();
  }

  override componentWillUnmount() {
    this.removeEvents();
  }

  handleMenuRef = (el: HTMLElement | null) => {
    this.menuRef.current = el;
  };

  handleToggleRef = (el: HTMLElement | null) => {
    this.toggleRef.current = el;
  };

  handleDocumentClick = (e: Event) => {
    const which = keyCodeOf(e as KeyboardEvent);
    if (which === 3 || (e.type === 'keyup' && which !== keyCodes.tab)) return;
    const container = this.containerRef.current;
    const menu = this.menuRef.current;
    const toggle = this.toggleRef.current;
    const target = e.target as HTMLElement;

    // No toggle component in the dropdown: nothing to toggle against.
    if (!toggle) return;

    const targetIsToggle = toggle.contains(target);
    const clickIsInMenu = !!menu && menu.contains(target) && menu !== target;

    // Only for InputGroup with type dropdown
    const clickIsInInput =
      !!container &&
      container.classList.contains('input-group') &&
      container.classList.contains('dropdown') &&
      target.tagName === 'INPUT';

    if (
      ((targetIsToggle && !clickIsInInput) || clickIsInMenu) &&
      (e.type !== 'keyup' || which === keyCodes.tab)
    ) {
      return;
    }

    this.toggle(e);
  };

  handleKeyDown = (e: ReactKeyboardEvent) => {
    const target = e.target as HTMLElement;
    const which = keyCodeOf(e);
    const role = target.getAttribute('role');
    const isTargetMenuItem = role === 'menuitem' || role === 'option';
    const isTargetMenuCtrl = this.getMenuCtrl() === target;
    const isTab = keyCodes.tab === which;
    const { a11y = true, disabled, isOpen } = this.props;

    if (
      /input|textarea/i.test(target.tagName) ||
      (isTab && !a11y) ||
      (isTab && !(isTargetMenuItem || isTargetMenuCtrl))
    ) {
      return;
    }

    if (preventDefaultKeys.includes(which) || isAlphanumeric(which)) {
      e.preventDefault();
    }

    if (disabled) return;

    if (isTargetMenuCtrl) {
      if (openKeys.includes(which)) {
        // Open the menu (if not open) and focus the first menu item
        if (!isOpen) this.toggle(e);
        setTimeout(() => this.getMenuItems()[0]?.focus());
      } else if (isOpen && isTab) {
        // Focus the first menu item if tabbing from an open menu. We need this
        // for cases where the DropdownMenu sets a custom container, which may
        // not be the natural next item to tab to from the DropdownToggle.
        e.preventDefault();
        this.getMenuItems()[0]?.focus();
      } else if (isOpen && which === keyCodes.esc) {
        this.toggle(e);
      }
    }

    if (isOpen && isTargetMenuItem) {
      if (which === keyCodes.tab || which === keyCodes.esc) {
        this.toggle(e);
        this.getMenuCtrl()?.focus();
      } else if (which === keyCodes.space || which === keyCodes.enter) {
        target.click();
        this.getMenuCtrl()?.focus();
      } else if (
        which === keyCodes.down ||
        which === keyCodes.up ||
        ((which === keyCodes.n || which === keyCodes.p) && e.ctrlKey)
      ) {
        const items = this.getMenuItems();
        let index = items.indexOf(target);
        if (keyCodes.up === which || (keyCodes.p === which && e.ctrlKey)) {
          index = index !== 0 ? index - 1 : items.length - 1;
        } else {
          index = index === items.length - 1 ? 0 : index + 1;
        }
        items[index].focus();
      } else if (keyCodes.end === which) {
        const items = this.getMenuItems();
        items[items.length - 1].focus();
      } else if (keyCodes.home === which) {
        this.getMenuItems()[0].focus();
      } else if (isAlphanumeric(which)) {
        const charPressed = String.fromCharCode(which).toLowerCase();
        this.getMenuItems()
          .find((item) => item.textContent?.[0]?.toLowerCase() === charPressed)
          ?.focus();
      }
    }
  };

  handleProps() {
    if (this.props.isOpen) this.addEvents();
    else this.removeEvents();
  }

  getContextValue(): DropdownContextValue {
    const { direction = 'down', dropup } = this.props;
    return {
      toggle: this.toggle,
      isOpen: this.props.isOpen,
      direction: direction === 'down' && dropup ? 'up' : direction,
      inNavbar: this.props.inNavbar,
      disabled: this.props.disabled,
      // Called by DropdownMenu with its DOM node
      onMenuRef: this.handleMenuRef,
      onToggleRef: this.handleToggleRef,
      menuRole: this.props.menuRole,
    };
  }

  getMenuCtrl() {
    this.menuCtrl ??= this.toggleRef.current;
    return this.menuCtrl;
  }

  getMenuItems(): HTMLElement[] {
    // The menu should never be null with a child DropdownMenu, but it can be
    // in tests; fall back to the container.
    const menuContainer = this.menuRef.current || this.containerRef.current;
    const itemRole = this.props.menuRole === 'listbox' ? 'option' : 'menuitem';
    return Array.from(
      menuContainer?.querySelectorAll<HTMLElement>(`[role="${itemRole}"]`) ??
        [],
    );
  }

  addEvents() {
    ['click', 'touchstart', 'keyup'].forEach((event) =>
      document.addEventListener(event, this.handleDocumentClick, true),
    );
  }

  removeEvents() {
    ['click', 'touchstart', 'keyup'].forEach((event) =>
      document.removeEventListener(event, this.handleDocumentClick, true),
    );
  }

  toggle = (e?: AnyEvent) => {
    if (this.props.disabled) {
      e?.preventDefault();
      return;
    }
    this.props.toggle?.(e as never);
  };

  override render() {
    const {
      className,
      cssModule,
      direction = 'down',
      isOpen,
      group,
      size,
      nav = false,
      setActiveFromChild = false,
      active = false,
      tag,
      menuRole: _menuRole,
      dropup: _dropup,
      ...attrs
    } = omit(this.props as DropdownImplProps, [
      'toggle',
      'disabled',
      'inNavbar',
      'a11y',
    ]);

    const Tag: ElementType = tag || (nav ? 'li' : 'div');

    let subItemIsActive = false;
    if (setActiveFromChild) {
      const menu = (this.props.children as ReactElement<any>[])[1];
      Children.forEach(menu.props.children, (item) => {
        if (isValidElement<{ active?: boolean }>(item) && item.props.active) {
          subItemIsActive = true;
        }
      });
    }

    const classes = mapToCssModules(
      classNames(
        className,
        nav && active ? 'active' : false,
        setActiveFromChild && subItemIsActive ? 'active' : false,
        {
          'btn-group': group,
          [`btn-group-${size}`]: !!size,
          dropdown: !group,
          dropup: direction === 'up',
          dropstart: direction === 'start' || direction === 'left',
          dropend: direction === 'end' || direction === 'right',
          show: isOpen,
          'nav-item': nav,
        },
      ),
      cssModule,
    );

    if (this.context.insideInputGroup) {
      return (
        <DropdownContext.Provider value={this.getContextValue()}>
          <Manager>
            {Children.map(this.props.children, (child) =>
              cloneElement(child as ReactElement<any>, {
                onKeyDown: this.handleKeyDown,
              }),
            )}
          </Manager>
        </DropdownContext.Provider>
      );
    }

    return (
      <DropdownContext.Provider value={this.getContextValue()}>
        <Manager>
          <Tag
            {...attrs}
            {...{
              [typeof Tag === 'string' ? 'ref' : 'innerRef']: this.containerRef,
            }}
            onKeyDown={this.handleKeyDown}
            className={classes}
          />
        </Manager>
      </DropdownContext.Provider>
    );
  }
}

export default Dropdown;

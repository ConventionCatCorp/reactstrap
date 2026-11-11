import {
  Component,
  type ContextType,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import type { Placement, PositioningStrategy } from '@popperjs/core';
import { Popper } from './popper';
import type { PopperModifier } from './PopperContent';
import { DropdownContext, type DropdownDirection } from './DropdownContext';
import {
  getTarget,
  mapToCssModules,
  type CSSModule,
  type PolymorphicClassExtras,
  type Target,
} from './utils';

export interface DropdownMenuOwnProps {
  children?: ReactNode;
  className?: string;
  /** Render as `.dropdown-menu-dark`. */
  dark?: boolean;
  /** Align the menu to the end of the toggle. */
  end?: boolean;
  /** Flips the menu to the opposite side if there is not enough space to fit */
  flip?: boolean;
  modifiers?: PopperModifier[];
  cssModule?: CSSModule;
  /** Keep the menu mounted (and positioned) while closed. */
  persist?: boolean;
  strategy?: PositioningStrategy;
  /** Portal the menu into this element. */
  container?: Target;
  /** Update popper layout when a click event comes up. This leverages event bubbling. */
  updateOnSelect?: boolean;
}

/** Extra props are typed by `tag` (default `div`). */
export type DropdownMenuProps<T extends ElementType = 'div'> =
  DropdownMenuOwnProps & PolymorphicClassExtras<DropdownMenuOwnProps, T>;

const directionPositionMap: Record<DropdownDirection, string> = {
  up: 'top',
  left: 'left',
  right: 'right',
  start: 'left',
  end: 'right',
  down: 'bottom',
};

class DropdownMenu<T extends ElementType = 'div'> extends Component<
  DropdownMenuProps<T>
> {
  // Not `Readonly<P>`: lets JSX infer `T` from a string `tag` (else it widens to `ElementType`).
  declare props: DropdownMenuProps<T>;
  static override contextType = DropdownContext;
  declare context: ContextType<typeof DropdownContext>;

  getRole() {
    return this.context.menuRole === 'listbox' ? 'listbox' : 'menu';
  }

  override render() {
    const {
      className,
      cssModule,
      dark,
      end,
      tag: Tag = 'div',
      flip = true,
      modifiers = [],
      persist,
      strategy,
      container,
      updateOnSelect,
      ...attrs
    } = this.props as DropdownMenuOwnProps & {
      tag?: ElementType;
      placement?: string;
    } & HTMLAttributes<HTMLElement>;
    const { isOpen, inNavbar, direction, onMenuRef } = this.context;

    const classes = mapToCssModules(
      classNames(className, 'dropdown-menu', {
        'dropdown-menu-dark': dark,
        'dropdown-menu-end': end,
        show: isOpen,
      }),
      cssModule,
    );

    if (persist || (isOpen && !inNavbar)) {
      const position1 = directionPositionMap[direction] || 'bottom';
      const position2 = end ? 'end' : 'start';
      const persistStyles: CSSProperties = persist
        ? { display: 'block', visibility: isOpen ? 'visible' : 'hidden' }
        : {};

      const popper = (
        <Popper
          placement={`${position1}-${position2}` as Placement}
          modifiers={[...modifiers, { name: 'flip', enabled: !!flip }]}
          strategy={strategy}
        >
          {({ ref, style, placement, update }) => {
            const handleRef = (el: HTMLElement | null) => {
              // Send the ref to popper
              ref(el);
              // Send the ref to the parent Dropdown so that clicks outside
              // it will cause it to close
              onMenuRef?.(el);
            };

            return (
              <Tag
                tabIndex={-1}
                role={this.getRole()}
                ref={handleRef}
                {...attrs}
                style={{ ...attrs.style, ...persistStyles, ...style }}
                aria-hidden={!isOpen}
                className={classes}
                data-popper-placement={placement}
                onClick={() => updateOnSelect && update()}
              />
            );
          }}
        </Popper>
      );

      return container
        ? createPortal(popper, getTarget(container) as Element)
        : popper;
    }

    return (
      <Tag
        tabIndex={-1}
        role={this.getRole()}
        {...attrs}
        ref={onMenuRef}
        aria-hidden={!isOpen}
        className={classes}
        data-popper-placement={attrs.placement}
        data-bs-popper="static"
      />
    );
  }
}

export default DropdownMenu;

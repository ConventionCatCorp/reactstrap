import {
  Component,
  useCallback,
  type ContextType,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import {
  autoUpdate,
  flip as flipMiddleware,
  limitShift,
  shift,
  useFloating,
  type Placement,
  type Strategy,
} from '@floating-ui/react-dom';
import { mergeMiddleware, type FloatingMiddleware } from './FloatingContent';
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
  /**
   * Extra Floating UI middleware, run after the defaults (`flip`, `shift`); a same-named one replaces
   * that default in place, and a custom `offset` runs first.
   */
  middleware?: FloatingMiddleware[];
  cssModule?: CSSModule;
  /** Keep the menu mounted (and positioned) while closed. */
  persist?: boolean;
  strategy?: Strategy;
  /** Portal the menu into this element. */
  container?: Target;
  /** Reposition the menu on click inside it (e.g. when an item changes its size). */
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

type FloatingMenuProps = HTMLAttributes<HTMLElement> & {
  tag: ElementType;
  reference: Element | null;
  placement: Placement;
  flip: boolean;
  middleware: FloatingMiddleware[];
  strategy?: Strategy;
  updateOnSelect?: boolean;
  onMenuRef?: (el: HTMLElement | null) => void;
};

function FloatingMenu({
  tag: Tag,
  reference,
  placement,
  flip,
  middleware,
  strategy,
  updateOnSelect,
  onMenuRef,
  style,
  onClick,
  ...attrs
}: FloatingMenuProps) {
  const floating = useFloating({
    elements: { reference },
    placement,
    strategy,
    middleware: mergeMiddleware(
      [
        ['offset', false],
        ['flip', flip && flipMiddleware()],
        ['shift', shift({ limiter: limitShift() })],
      ],
      middleware,
    ),
    whileElementsMounted: autoUpdate,
  });
  const { setFloating } = floating.refs;
  const ref = useCallback(
    (el: HTMLElement | null) => {
      setFloating(el);
      // Lets Dropdown ignore clicks inside the menu.
      onMenuRef?.(el);
    },
    [setFloating, onMenuRef],
  );

  return (
    <Tag
      {...attrs}
      ref={ref}
      style={{ ...style, ...floating.floatingStyles }}
      data-popper-placement={floating.placement}
      onClick={(e: MouseEvent<HTMLElement>) => {
        onClick?.(e);
        if (updateOnSelect) floating.update();
      }}
    />
  );
}

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
      middleware = [],
      persist,
      strategy,
      container,
      updateOnSelect,
      ...attrs
    } = this.props as DropdownMenuOwnProps & {
      tag?: ElementType;
      placement?: string;
    } & HTMLAttributes<HTMLElement>;
    const { isOpen, inNavbar, direction, onMenuRef, reference } = this.context;

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

      const menu = (
        <FloatingMenu
          tabIndex={-1}
          role={this.getRole()}
          {...attrs}
          tag={Tag}
          reference={reference ?? null}
          placement={`${position1}-${position2}` as Placement}
          flip={flip}
          middleware={middleware}
          strategy={strategy}
          updateOnSelect={updateOnSelect}
          onMenuRef={onMenuRef}
          style={{ ...attrs.style, ...persistStyles }}
          aria-hidden={!isOpen}
          className={classes}
        />
      );

      return container
        ? createPortal(menu, getTarget(container) as Element)
        : menu;
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

import {
  Component,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
  type RefObject,
  type SyntheticEvent,
} from 'react';
import type { Boundary, Placement, PositioningStrategy } from '@popperjs/core';
import PopperContent, { type PopperModifier } from './PopperContent';
import {
  getTarget,
  mapToCssModules,
  omit,
  type CSSModule,
  type Target,
} from './utils';

export type TooltipPopoverDelay = number | { show?: number; hide?: number };

/** Extra props go to the inner `div[role=tooltip]`. */
export interface TooltipPopoverWrapperProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  children?: ReactNode | ((args: { update: () => void }) => ReactNode);
  /** Element(s) that trigger the popup: selector, element, ref or getter. */
  target: Target;
  /** Where to portal the popup; `'inline'` renders in place. */
  container?: Target;
  isOpen?: boolean;
  /** Ignore triggers and `toggle` calls. */
  disabled?: boolean;
  hideArrow?: boolean;
  /** `preventOverflow` boundary. */
  boundariesElement?: Boundary | string;
  placement?: Placement;
  className?: string;
  innerClassName?: string;
  arrowClassName?: string;
  popperClassName?: string;
  cssModule?: CSSModule;
  /** Called to open or close the popup. */
  toggle?: MouseEventHandler<any> | (() => void);
  /** Hide when the pointer leaves the target even if it moves onto the popup. */
  autohide?: boolean;
  /** Adds `${placementPrefix}-auto` to the popper. */
  placementPrefix?: string;
  /** Show/hide delay in ms (default `{ show: 0, hide: 50 }`). */
  delay?: TooltipPopoverDelay;
  modifiers?: PopperModifier[];
  strategy?: PositioningStrategy;
  /** Popper `offset` modifier; falls back to `PopperContent.defaultProps.offset`. */
  offset?: [number, number];
  innerRef?: Ref<HTMLElement>;
  /** Space separated: `click`, `hover`, `focus`, `legacy` or `manual`. */
  trigger?: string;
  fade?: boolean;
  flip?: boolean;
}

interface TooltipPopoverWrapperState {
  isOpen?: boolean;
}

type AnyEvent = Event | SyntheticEvent;

const DEFAULT_DELAYS = { show: 0, hide: 50 };

const ownKeys = [
  'children',
  'placement',
  'target',
  'container',
  'isOpen',
  'disabled',
  'hideArrow',
  'boundariesElement',
  'className',
  'innerClassName',
  'arrowClassName',
  'popperClassName',
  'cssModule',
  'toggle',
  'autohide',
  'placementPrefix',
  'delay',
  'modifiers',
  'strategy',
  'offset',
  'innerRef',
  'trigger',
  'fade',
  'flip',
] as const;

const isInDOMSubtree = (element: Node, subtreeRoot: Element | null) =>
  !!subtreeRoot && (element === subtreeRoot || subtreeRoot.contains(element));

const isInDOMSubtrees = (element: Node, subtreeRoots: Element[]) =>
  subtreeRoots.some((root) => isInDOMSubtree(element, root));

class TooltipPopoverWrapper extends Component<
  TooltipPopoverWrapperProps,
  TooltipPopoverWrapperState
> {
  private targets: Element[] = [];
  private popover: HTMLElement | null = null;
  private mounted = false;
  private showTimeout?: ReturnType<typeof setTimeout>;
  private hideTimeout?: ReturnType<typeof setTimeout>;
  private currentTargetElement: Element | null = null;

  constructor(props: TooltipPopoverWrapperProps) {
    super(props);
    this.state = { isOpen: props.isOpen };
  }

  static getDerivedStateFromProps(
    props: TooltipPopoverWrapperProps,
    state: TooltipPopoverWrapperState,
  ): TooltipPopoverWrapperState | null {
    return props.isOpen && !state.isOpen ? { isOpen: props.isOpen } : null;
  }

  override componentDidMount() {
    this.mounted = true;
    this.updateTarget();
  }

  override componentWillUnmount() {
    this.mounted = false;
    this.removeTargetEvents();
    this.targets = [];
    this.clearShowTimeout();
    this.clearHideTimeout();
  }

  private get trigger() {
    return this.props.trigger ?? 'click';
  }

  handleDocumentClick = (e: MouseEvent) => {
    const triggers = this.trigger.split(' ');
    const target = e.target as Node;

    if (
      triggers.includes('legacy') &&
      (this.props.isOpen || isInDOMSubtrees(target, this.targets))
    ) {
      if (this.hideTimeout) this.clearHideTimeout();
      if (this.props.isOpen && !isInDOMSubtree(target, this.popover)) {
        this.hideWithDelay(e);
      } else if (!this.props.isOpen) {
        this.showWithDelay(e);
      }
    } else if (
      triggers.includes('click') &&
      isInDOMSubtrees(target, this.targets)
    ) {
      if (this.hideTimeout) this.clearHideTimeout();
      if (this.props.isOpen) this.hideWithDelay(e);
      else this.showWithDelay(e);
    }
  };

  onMouseOverTooltipContent = () => {
    if (this.trigger.includes('hover') && !this.props.autohide) {
      if (this.hideTimeout) this.clearHideTimeout();
      if (this.state.isOpen && !this.props.isOpen) this.toggle();
    }
  };

  onMouseLeaveTooltipContent = (e: ReactMouseEvent) => {
    if (this.trigger.includes('hover') && !this.props.autohide) {
      if (this.showTimeout) this.clearShowTimeout();
      this.hideTimeout = setTimeout(() => this.hide(e), this.getDelay('hide'));
    }
  };

  onEscKeyDown = (e: KeyboardEvent | ReactKeyboardEvent) => {
    if (e.key === 'Escape') this.hide(e);
  };

  getRef = (el: HTMLDivElement | null) => {
    const { innerRef } = this.props;
    if (typeof innerRef === 'function') innerRef(el);
    else if (innerRef) (innerRef as RefObject<HTMLElement | null>).current = el;
    this.popover = el;
  };

  getDelay(key: 'show' | 'hide'): number {
    const { delay = DEFAULT_DELAYS } = this.props;
    if (typeof delay === 'object') {
      const value = delay[key];
      return value === undefined || isNaN(value) ? DEFAULT_DELAYS[key] : value;
    }
    return delay;
  }

  getCurrentTarget(target: Element | null): Element | null {
    if (!target) return null;
    if (this.targets.includes(target)) return target;
    return this.getCurrentTarget(target.parentElement);
  }

  show = (e?: AnyEvent) => {
    if (this.props.isOpen) return;
    this.clearShowTimeout();
    this.currentTargetElement = e
      ? (e.currentTarget as Element | null) ||
        this.getCurrentTarget(e.target as Element)
      : null;
    if (e && 'composedPath' in e && typeof e.composedPath === 'function') {
      this.currentTargetElement =
        (e.composedPath()[0] as Element | undefined) ||
        this.currentTargetElement;
    }
    this.toggle(e);
  };

  showWithDelay = (e?: AnyEvent) => {
    if (this.hideTimeout) this.clearHideTimeout();
    this.showTimeout = setTimeout(() => this.show(e), this.getDelay('show'));
  };

  hide = (e?: AnyEvent) => {
    if (!this.props.isOpen) return;
    this.clearHideTimeout();
    this.currentTargetElement = null;
    this.toggle(e);
  };

  hideWithDelay = (e?: AnyEvent) => {
    if (this.showTimeout) this.clearShowTimeout();
    this.hideTimeout = setTimeout(() => this.hide(e), this.getDelay('hide'));
  };

  clearShowTimeout() {
    clearTimeout(this.showTimeout);
    this.showTimeout = undefined;
  }

  clearHideTimeout() {
    clearTimeout(this.hideTimeout);
    this.hideTimeout = undefined;
  }

  addEventOnTargets(type: string, handler: EventListener) {
    this.targets.forEach((t) => t.addEventListener(type, handler, true));
  }

  removeEventOnTargets(type: string, handler: EventListener) {
    this.targets.forEach((t) => t.removeEventListener(type, handler, true));
  }

  addTargetEvents() {
    const triggers = this.trigger.split(' ');
    if (!this.trigger || triggers.includes('manual')) return;

    if (triggers.includes('click') || triggers.includes('legacy')) {
      document.addEventListener('click', this.handleDocumentClick, true);
    }

    if (this.targets.length) {
      if (triggers.includes('hover')) {
        this.addEventOnTargets('mouseover', this.showWithDelay);
        this.addEventOnTargets('mouseout', this.hideWithDelay);
      }
      if (triggers.includes('focus')) {
        this.addEventOnTargets('focusin', this.show);
        this.addEventOnTargets('focusout', this.hide);
      }
      this.addEventOnTargets('keydown', this.onEscKeyDown as EventListener);
    }
  }

  removeTargetEvents() {
    this.removeEventOnTargets('mouseover', this.showWithDelay);
    this.removeEventOnTargets('mouseout', this.hideWithDelay);
    this.removeEventOnTargets('keydown', this.onEscKeyDown as EventListener);
    this.removeEventOnTargets('focusin', this.show);
    this.removeEventOnTargets('focusout', this.hide);
    document.removeEventListener('click', this.handleDocumentClick, true);
  }

  updateTarget() {
    this.removeTargetEvents();
    this.targets = Array.from(getTarget(this.props.target, true));
    this.currentTargetElement = this.currentTargetElement || this.targets[0];
    this.addTargetEvents();
  }

  toggle(e?: AnyEvent) {
    if (this.props.disabled || !this.mounted) {
      e?.preventDefault();
      return;
    }
    this.props.toggle?.(e as ReactMouseEvent);
  }

  override render() {
    if (this.props.isOpen) this.updateTarget();

    const target = this.currentTargetElement || this.targets[0];
    if (!target) return null;

    const {
      className,
      cssModule,
      innerClassName,
      isOpen,
      hideArrow,
      boundariesElement,
      placement,
      placementPrefix,
      arrowClassName,
      popperClassName,
      container,
      modifiers,
      strategy,
      offset,
      fade,
      flip,
      children,
    } = this.props;

    return (
      <PopperContent
        className={className}
        target={target}
        isOpen={isOpen}
        hideArrow={hideArrow}
        boundariesElement={boundariesElement}
        placement={placement}
        placementPrefix={placementPrefix}
        arrowClassName={arrowClassName}
        popperClassName={mapToCssModules(popperClassName, cssModule)}
        container={container}
        modifiers={modifiers}
        strategy={strategy}
        offset={offset}
        cssModule={cssModule}
        fade={fade}
        flip={flip}
      >
        {({ update }) => (
          // Hovering the popup keeps it open; Esc is handled on targets too.
          // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <div
            {...omit(this.props, ownKeys)}
            ref={this.getRef}
            className={mapToCssModules(innerClassName, cssModule)}
            role="tooltip"
            // oxlint-disable-next-line jsx-a11y/mouse-events-have-key-events -- focus trigger lives on targets
            onMouseOver={this.onMouseOverTooltipContent}
            onMouseLeave={this.onMouseLeaveTooltipContent}
            onKeyDown={this.onEscKeyDown}
          >
            {typeof children === 'function' ? children({ update }) : children}
          </div>
        )}
      </PopperContent>
    );
  }
}

export default TooltipPopoverWrapper;

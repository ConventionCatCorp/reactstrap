import {
  Component,
  type HTMLAttributes,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
  type SyntheticEvent,
} from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import Fade, { type FadeProps } from './Fade';
import {
  TransitionTimeouts,
  conditionallyUpdateScrollbar,
  focusableElements,
  getOriginalBodyPadding,
  getTarget,
  keyCodes,
  mapToCssModules,
  omit,
  setScrollbarWidth,
  type CSSModule,
  type Target,
} from './utils';

export type Direction = 'start' | 'end' | 'bottom' | 'top';

export interface OffcanvasProps extends HTMLAttributes<HTMLDivElement> {
  /** Focus the offcanvas when it opens */
  autoFocus?: boolean;
  /** Add backdrop; `'static'` keeps the offcanvas open on backdrop click */
  backdrop?: boolean | 'static';
  /** Add custom classname to backdrop */
  backdropClassName?: string;
  /** Props passed to the backdrop `Fade` */
  backdropTransition?: Partial<FadeProps>;
  children?: ReactNode;
  className?: string;
  /** Element the offcanvas is appended to */
  container?: Target;
  cssModule?: CSSModule;
  /** Side the offcanvas slides in from */
  direction?: Direction;
  /** Enable/Disable animation */
  fade?: boolean;
  /** Ref to the `.offcanvas` element */
  innerRef?: Ref<HTMLElement>;
  /** The status of the offcanvas, either open or close */
  isOpen?: boolean;
  /** Allow offcanvas to be closed with escape key. */
  keyboard?: boolean;
  /** Identifies the element (or elements) that labels the current element. */
  labelledBy?: string;
  /** Props passed to the offcanvas `Fade` */
  offcanvasTransition?: Partial<FadeProps>;
  /** Function to be triggered on close */
  onClosed?: () => void;
  /** Function to be triggered on enter */
  onEnter?: () => void;
  /** Function to be triggered on exit */
  onExit?: () => void;
  /** Function to be triggered on open */
  onOpened?: () => void;
  /** Returns focus to the element that triggered opening of the offcanvas */
  returnFocusAfterClose?: boolean;
  /** Accessibility role */
  role?: string;
  /** Allow body scrolling while open */
  scrollable?: boolean;
  /** Function to toggle offcanvas visibility */
  toggle?: KeyboardEventHandler<any> | MouseEventHandler<any>;
  /** Keep focus inside the offcanvas */
  trapFocus?: boolean;
  /** Unmounts the offcanvas when it is closed */
  unmountOnClose?: boolean;
  zIndex?: number | string;
}

interface OffcanvasState {
  isOpen: boolean;
}

const propsToOmit = [
  'autoFocus',
  'backdrop',
  'backdropClassName',
  'backdropTransition',
  'children',
  'className',
  'container',
  'cssModule',
  'direction',
  'fade',
  'innerRef',
  'isOpen',
  'keyboard',
  'labelledBy',
  'offcanvasTransition',
  'onClosed',
  'onEnter',
  'onExit',
  'style',
  'onOpened',
  'returnFocusAfterClose',
  'role',
  'scrollable',
  'toggle',
  'trapFocus',
  'unmountOnClose',
  'zIndex',
] as const satisfies readonly (keyof OffcanvasProps)[];

/** Props with defaults applied (`undefined` falls back, like React default props). */
function withDefaults({
  autoFocus = true,
  direction = 'start',
  role = 'dialog',
  backdrop = true,
  keyboard = true,
  zIndex = 1050,
  fade = true,
  offcanvasTransition = { timeout: TransitionTimeouts.Offcanvas },
  backdropTransition = {
    mountOnEnter: true,
    timeout: TransitionTimeouts.Fade, // uses standard fade transition
  },
  unmountOnClose = true,
  returnFocusAfterClose = true,
  container = 'body',
  ...props
}: OffcanvasProps) {
  return {
    ...props,
    autoFocus,
    direction,
    role,
    backdrop,
    keyboard,
    zIndex,
    fade,
    offcanvasTransition,
    backdropTransition,
    unmountOnClose,
    returnFocusAfterClose,
    container,
  };
}

class Offcanvas extends Component<OffcanvasProps, OffcanvasState> {
  static openCount = 0;

  override state: OffcanvasState = { isOpen: false };

  private element: HTMLDivElement | null = null;
  private mountContainer: Element | null = null;
  private backdrop: HTMLElement | null = null;
  private dialog: HTMLElement | null = null;
  private originalBodyPadding = 0;
  private triggeringElement: Element | null = null;
  private mouseDownElement: EventTarget | null = null;
  private isMounted = false;
  private offcanvasIndex = 0;

  private get p() {
    return withDefaults(this.props);
  }

  override componentDidMount() {
    const { isOpen, autoFocus, onEnter } = this.p;

    if (isOpen) {
      this.init();
      // oxlint-disable-next-line react/no-did-mount-set-state -- render needs the node created by init()
      this.setState({ isOpen: true });
      if (autoFocus) {
        this.setFocus();
      }
    }

    onEnter?.();

    // traps focus inside the Offcanvas, even if the browser address bar is focused
    document.addEventListener('focus', this.trapFocus, true);

    this.isMounted = true;
  }

  override componentDidUpdate(
    prevProps: OffcanvasProps,
    prevState: OffcanvasState,
  ) {
    const { isOpen, autoFocus, zIndex } = this.p;
    if (isOpen && !prevProps.isOpen) {
      this.init();
      // oxlint-disable-next-line react/no-did-update-set-state -- render needs the node created by init()
      this.setState({ isOpen: true });

      return;
    }

    // now Offcanvas Dialog is rendered and we can refer this.element and this.dialog
    if (autoFocus && this.state.isOpen && !prevState.isOpen) {
      this.setFocus();
    }

    if (this.element && withDefaults(prevProps).zIndex !== zIndex) {
      this.element.style.zIndex = String(zIndex);
    }
  }

  override componentWillUnmount() {
    this.props.onExit?.();

    if (this.element) {
      this.destroy();
      if (this.props.isOpen || this.state.isOpen) {
        this.close();
      }
    }

    document.removeEventListener('focus', this.trapFocus, true);
    this.isMounted = false;
  }

  private setBackdrop = (el: HTMLElement | null) => {
    this.backdrop = el;
  };

  /** Keeps our own handle on the dialog and forwards it to `innerRef`. */
  private setDialog = (el: HTMLElement | null) => {
    this.dialog = el;
    const { innerRef } = this.props;
    if (typeof innerRef === 'function') innerRef(el);
    else if (innerRef) innerRef.current = el;
  };

  // not mouseUp because scrollbar fires it, shouldn't close when user scrolls
  private handleBackdropClick = (e: MouseEvent<HTMLElement>) => {
    if (e.target !== this.mouseDownElement) return;
    e.stopPropagation();

    if (!this.p.isOpen || this.p.backdrop !== true) return;

    if (this.backdrop && e.target === this.backdrop) {
      this.toggle(e);
    }
  };

  private toggle(e: SyntheticEvent) {
    (this.props.toggle as ((e: SyntheticEvent) => void) | undefined)?.(e);
  }

  private handleTab = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Tab' && e.keyCode !== keyCodes.tab) return;
    if (this.offcanvasIndex < Offcanvas.openCount - 1) return; // last opened offcanvas

    const focusableChildren = this.getFocusableChildren();
    const totalFocusable = focusableChildren.length;
    if (totalFocusable === 0) return;
    const focusedIndex = Math.max(
      0,
      Array.prototype.indexOf.call(focusableChildren, document.activeElement),
    );

    if (e.shiftKey && focusedIndex === 0) {
      e.preventDefault();
      focusableChildren[totalFocusable - 1].focus();
    } else if (!e.shiftKey && focusedIndex === totalFocusable - 1) {
      e.preventDefault();
      focusableChildren[0].focus();
    }
  };

  private handleBackdropMouseDown = (e: MouseEvent<HTMLElement>) => {
    this.mouseDownElement = e.target;
  };

  private handleEscape = (e: KeyboardEvent<HTMLElement>) => {
    const { isOpen, keyboard, toggle } = this.p;
    if (
      isOpen &&
      (e.key === 'Escape' || e.keyCode === keyCodes.esc) &&
      toggle &&
      keyboard
    ) {
      e.preventDefault();
      e.stopPropagation();

      this.toggle(e);
    }
  };

  private onOpened = (node: HTMLElement, isAppearing: boolean) => {
    const { onOpened, offcanvasTransition } = this.p;
    onOpened?.();
    offcanvasTransition.onEntered?.(node, isAppearing);
  };

  private onClosed = (node: HTMLElement) => {
    const { onClosed, offcanvasTransition, unmountOnClose } = this.p;
    // so all methods get called before it is unmounted
    onClosed?.();
    offcanvasTransition.onExited?.(node);

    if (unmountOnClose) {
      this.destroy();
    }
    this.close();

    if (this.isMounted) {
      this.setState({ isOpen: false });
    }
  };

  private setFocus() {
    this.dialog?.focus?.();
  }

  private getFocusableChildren() {
    return this.element!.querySelectorAll<HTMLElement>(
      focusableElements.join(', '),
    );
  }

  private trapFocus = (ev: FocusEvent) => {
    if (!this.props.trapFocus) {
      return;
    }

    if (!this.element) {
      // element is not attached
      return;
    }

    if (this.dialog === ev.target) {
      // initial focus when the Offcanvas is opened
      return;
    }

    if (this.offcanvasIndex < Offcanvas.openCount - 1) {
      // last opened offcanvas
      return;
    }

    const children = this.getFocusableChildren();

    // focus is already inside the Offcanvas
    if (Array.prototype.includes.call(children, ev.target)) return;

    if (children.length > 0) {
      // otherwise focus the first focusable element in the Offcanvas
      ev.preventDefault();
      ev.stopPropagation();
      children[0].focus();
    }
  };

  private init() {
    const { zIndex, container, backdrop, scrollable } = this.p;
    this.triggeringElement = document.activeElement;

    if (!this.element) {
      this.element = document.createElement('div');
      this.element.setAttribute('tabindex', '-1');
      this.element.style.position = 'relative';
      this.element.style.zIndex = String(zIndex);
      this.mountContainer = getTarget(container);
      this.mountContainer!.appendChild(this.element);
    }

    this.originalBodyPadding = getOriginalBodyPadding();
    conditionallyUpdateScrollbar();

    if (Offcanvas.openCount === 0 && backdrop && !scrollable) {
      document.body.style.overflow = 'hidden';
    }

    this.offcanvasIndex = Offcanvas.openCount;
    Offcanvas.openCount += 1;
  }

  private destroy() {
    if (this.element) {
      this.mountContainer!.removeChild(this.element);
      this.element = null;
    }

    this.manageFocusAfterClose();
  }

  private manageFocusAfterClose() {
    if (this.triggeringElement) {
      if (this.p.returnFocusAfterClose) {
        (this.triggeringElement as HTMLElement).focus?.();
      }
      this.triggeringElement = null;
    }
  }

  private close() {
    this.manageFocusAfterClose();
    Offcanvas.openCount = Math.max(0, Offcanvas.openCount - 1);

    document.body.style.overflow = '';
    setScrollbarWidth(this.originalBodyPadding);
  }

  override render() {
    const {
      direction,
      unmountOnClose,
      className,
      backdropClassName,
      cssModule,
      isOpen,
      backdrop,
      role,
      labelledBy,
      style,
      children,
      fade: hasTransition,
      offcanvasTransition: offcanvasTransitionProp,
      backdropTransition: backdropTransitionProp,
    } = this.p;

    if (!this.element || (!this.state.isOpen && unmountOnClose)) {
      return null;
    }

    const isOffcanvasHidden = !this.state.isOpen && !unmountOnClose;
    this.element.style.display = isOffcanvasHidden ? 'none' : 'block';

    const offcanvasAttributes = {
      onKeyUp: this.handleEscape,
      onKeyDown: this.handleTab,
      'aria-labelledby': labelledBy,
      role,
      tabIndex: -1,
    };

    const offcanvasTransition = {
      ...offcanvasTransitionProp,
      baseClass: hasTransition ? offcanvasTransitionProp.baseClass : '',
      timeout: hasTransition ? offcanvasTransitionProp.timeout : 0,
    };
    const backdropTransition = {
      ...backdropTransitionProp,
      baseClass: hasTransition ? backdropTransitionProp.baseClass : '',
      timeout: hasTransition ? backdropTransitionProp.timeout : 0,
    };

    const Backdrop =
      backdrop &&
      (hasTransition ? (
        <Fade
          {...backdropTransition}
          in={isOpen && !!backdrop}
          innerRef={this.setBackdrop}
          cssModule={cssModule}
          className={mapToCssModules(
            classNames('offcanvas-backdrop', backdropClassName),
            cssModule,
          )}
          onClick={this.handleBackdropClick}
          onMouseDown={this.handleBackdropMouseDown}
        />
      ) : (
        // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- mouse-only dismiss; Escape handles keyboard
        <div
          className={mapToCssModules(
            classNames('offcanvas-backdrop', 'show', backdropClassName),
            cssModule,
          )}
          ref={this.setBackdrop}
          onClick={this.handleBackdropClick}
          onMouseDown={this.handleBackdropMouseDown}
        />
      ));

    const attributes = omit(this.props, propsToOmit);

    return createPortal(
      <>
        <Fade
          {...attributes}
          {...offcanvasAttributes}
          {...offcanvasTransition}
          in={isOpen}
          onEntered={this.onOpened}
          onExited={this.onClosed}
          cssModule={cssModule}
          className={mapToCssModules(
            classNames('offcanvas', className, `offcanvas-${direction}`),
            cssModule,
          )}
          innerRef={this.setDialog}
          style={{
            ...style,
            visibility: isOpen ? 'visible' : 'hidden',
          }}
        >
          {children}
        </Fade>
        {Backdrop}
      </>,
      this.element,
    );
  }
}

export default Offcanvas;

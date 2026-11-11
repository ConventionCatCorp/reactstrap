import {
  Component,
  createRef,
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
  getOriginalBodyPadding,
  conditionallyUpdateScrollbar,
  setScrollbarWidth,
  mapToCssModules,
  omit,
  focusableElements,
  TransitionTimeouts,
  keyCodes,
  getTarget,
  type CSSModule,
  type Target,
} from './utils';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  /** Focus the modal when it opens */
  autoFocus?: boolean;
  /** Add backdrop to modal; `'static'` keeps it open on backdrop click */
  backdrop?: boolean | 'static';
  /** Add custom classname to backdrop */
  backdropClassName?: string;
  /** Props passed to the backdrop `Fade` */
  backdropTransition?: Partial<FadeProps>;
  /** Vertically center the modal */
  centered?: boolean;
  /** Add children for the modal to wrap */
  children?: ReactNode;
  /** Add custom className for modal content */
  contentClassName?: string;
  /** Add custom className for modal dialog */
  className?: string;
  /** Element the modal is appended to */
  container?: Target;
  cssModule?: CSSModule;
  /** Content rendered inside `.modal`, before the dialog */
  external?: ReactNode;
  /** Enable/Disable animation */
  fade?: boolean;
  /** Make the modal fullscreen, optionally only below a breakpoint */
  fullscreen?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  /** Ref to the `.modal` element */
  innerRef?: Ref<HTMLElement>;
  /** The status of the modal, either open or close */
  isOpen?: boolean;
  /** Allow modal to be closed with escape key. */
  keyboard?: boolean;
  /** Identifies the element (or elements) that labels the current element. */
  labelledBy?: string;
  /** Add custom className to `.modal` */
  modalClassName?: string;
  /** Props passed to the modal `Fade` */
  modalTransition?: Partial<FadeProps>;
  /** Function to be triggered on close */
  onClosed?: () => void;
  /** Function to be triggered on enter */
  onEnter?: () => void;
  /** Function to be triggered on exit */
  onExit?: () => void;
  /** Function to be triggered on open */
  onOpened?: () => void;
  /** Returns focus to the element that triggered opening of the modal */
  returnFocusAfterClose?: boolean;
  /** Accessibility role */
  role?: string;
  /** Make the modal scrollable */
  scrollable?: boolean;
  /** Two optional sizes `lg` and `sm` */
  size?: string;
  /** Function to toggle modal visibility */
  toggle?: KeyboardEventHandler<any> | MouseEventHandler<any>;
  /** Keep focus inside the modal */
  trapFocus?: boolean;
  /** Unmounts the modal when modal is closed */
  unmountOnClose?: boolean;
  /** Add custom className to the wrapper */
  wrapClassName?: string;
  zIndex?: number | string;
}

interface ModalState {
  isOpen: boolean;
  showStaticBackdropAnimation: boolean;
}

const propsToOmit = [
  'autoFocus',
  'backdrop',
  'backdropClassName',
  'backdropTransition',
  'centered',
  'children',
  'contentClassName',
  'className',
  'container',
  'cssModule',
  'external',
  'fade',
  'fullscreen',
  'innerRef',
  'isOpen',
  'keyboard',
  'labelledBy',
  'modalClassName',
  'modalTransition',
  'onClosed',
  'onEnter',
  'onExit',
  'onOpened',
  'returnFocusAfterClose',
  'role',
  'scrollable',
  'size',
  'toggle',
  'trapFocus',
  'unmountOnClose',
  'wrapClassName',
  'zIndex',
] as const satisfies readonly (keyof ModalProps)[];

/** Props with defaults applied (`undefined` falls back, like React default props). */
function withDefaults({
  autoFocus = true,
  role = 'dialog',
  backdrop = true,
  keyboard = true,
  zIndex = 1050,
  fade = true,
  modalTransition = { timeout: TransitionTimeouts.Modal },
  backdropTransition = {
    mountOnEnter: true,
    timeout: TransitionTimeouts.Fade, // uses standard fade transition
  },
  unmountOnClose = true,
  returnFocusAfterClose = true,
  container = 'body',
  ...props
}: ModalProps) {
  return {
    ...props,
    autoFocus,
    role,
    backdrop,
    keyboard,
    zIndex,
    fade,
    modalTransition,
    backdropTransition,
    unmountOnClose,
    returnFocusAfterClose,
    container,
  };
}

class Modal extends Component<ModalProps, ModalState> {
  static openCount = 0;
  static originalBodyOverflow = '';

  override state: ModalState = {
    isOpen: false,
    showStaticBackdropAnimation: false,
  };

  private element: HTMLDivElement | null = null;
  private mountContainer: Element | null = null;
  private dialog = createRef<HTMLDivElement>();
  private originalBodyPadding = 0;
  private triggeringElement: Element | null = null;
  private mouseDownElement: EventTarget | null = null;
  private backdropAnimationTimeout?: ReturnType<typeof setTimeout>;
  private isMounted = false;
  private modalIndex = 0;

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

    // traps focus inside the Modal, even if the browser address bar is focused
    document.addEventListener('focus', this.trapFocus, true);

    this.isMounted = true;
  }

  override componentDidUpdate(prevProps: ModalProps, prevState: ModalState) {
    const { isOpen, autoFocus, zIndex } = this.p;
    if (isOpen && !prevProps.isOpen) {
      this.init();
      // oxlint-disable-next-line react/no-did-update-set-state -- render needs the node created by init()
      this.setState({ isOpen: true });
      // let render() renders Modal Dialog first
      return;
    }

    // now Modal Dialog is rendered and we can refer this.element and this.dialog
    if (autoFocus && this.state.isOpen && !prevState.isOpen) {
      this.setFocus();
    }

    if (this.element && withDefaults(prevProps).zIndex !== zIndex) {
      this.element.style.zIndex = String(zIndex);
    }
  }

  override componentWillUnmount() {
    this.clearBackdropAnimationTimeout();

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

  private toggle(e: SyntheticEvent) {
    (this.props.toggle as ((e: SyntheticEvent) => void) | undefined)?.(e);
  }

  // not mouseUp because scrollbar fires it, shouldn't close when user scrolls
  private handleBackdropClick = (e: MouseEvent<HTMLElement>) => {
    if (e.target !== this.mouseDownElement) return;
    e.stopPropagation();

    const { isOpen, backdrop } = this.p;
    const backdropEl = this.dialog.current?.parentNode ?? null;

    if (backdropEl && e.target === backdropEl && backdrop === 'static') {
      this.handleStaticBackdropAnimation();
    }

    if (!isOpen || backdrop !== true) return;

    if (backdropEl && e.target === backdropEl) {
      this.toggle(e);
    }
  };

  private handleTab = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Tab' && e.keyCode !== keyCodes.tab) return;
    if (this.modalIndex < Modal.openCount - 1) return; // last opened modal

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
    const { isOpen, keyboard, backdrop, toggle } = this.p;
    if (
      isOpen &&
      (e.key === 'Escape' || e.keyCode === keyCodes.esc) &&
      toggle
    ) {
      if (keyboard) {
        e.preventDefault();
        e.stopPropagation();

        this.toggle(e);
      } else if (backdrop === 'static') {
        e.preventDefault();
        e.stopPropagation();

        this.handleStaticBackdropAnimation();
      }
    }
  };

  private handleStaticBackdropAnimation() {
    this.clearBackdropAnimationTimeout();
    this.setState({ showStaticBackdropAnimation: true });
    this.backdropAnimationTimeout = setTimeout(() => {
      this.setState({ showStaticBackdropAnimation: false });
    }, 100);
  }

  private onOpened = (node: HTMLElement, isAppearing: boolean) => {
    const { onOpened, modalTransition } = this.p;
    onOpened?.();
    modalTransition.onEntered?.(node, isAppearing);
  };

  private onClosed = (node: HTMLElement) => {
    const { onClosed, modalTransition, unmountOnClose } = this.p;
    // so all methods get called before it is unmounted
    onClosed?.();
    modalTransition.onExited?.(node);

    if (unmountOnClose) {
      this.destroy();
    }
    this.close();

    if (this.isMounted) {
      this.setState({ isOpen: false });
    }
  };

  private setFocus() {
    (this.dialog.current?.parentNode as HTMLElement | null)?.focus?.();
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

    if (this.dialog.current?.parentNode === ev.target) {
      // initial focus when the Modal is opened
      return;
    }

    if (this.modalIndex < Modal.openCount - 1) {
      // last opened modal
      return;
    }

    const children = this.getFocusableChildren();

    // focus is already inside the Modal
    if (Array.prototype.includes.call(children, ev.target)) return;

    if (children.length > 0) {
      // otherwise focus the first focusable element in the Modal
      ev.preventDefault();
      ev.stopPropagation();
      children[0].focus();
    }
  };

  private init() {
    const { zIndex, container, cssModule } = this.p;
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
    if (Modal.openCount < 1) {
      Modal.originalBodyOverflow = window.getComputedStyle(
        document.body,
      ).overflow;
    }
    conditionallyUpdateScrollbar();

    if (Modal.openCount === 0) {
      document.body.className = classNames(
        document.body.className,
        mapToCssModules('modal-open', cssModule),
      );
      document.body.style.overflow = 'hidden';
    }

    this.modalIndex = Modal.openCount;
    Modal.openCount += 1;
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
    if (Modal.openCount <= 1) {
      const modalOpenClassName = mapToCssModules(
        'modal-open',
        this.props.cssModule,
      );
      // Use regex to prevent matching `modal-open` as part of a different class, e.g. `my-modal-opened`
      const modalOpenClassNameRegex = new RegExp(
        `(^| )${modalOpenClassName}( |$)`,
      );
      document.body.className = document.body.className
        .replace(modalOpenClassNameRegex, ' ')
        .trim();
      document.body.style.overflow = Modal.originalBodyOverflow;
    }
    this.manageFocusAfterClose();
    Modal.openCount = Math.max(0, Modal.openCount - 1);

    setScrollbarWidth(this.originalBodyPadding);
  }

  private clearBackdropAnimationTimeout() {
    if (this.backdropAnimationTimeout) {
      clearTimeout(this.backdropAnimationTimeout);
      this.backdropAnimationTimeout = undefined;
    }
  }

  private renderModalDialog() {
    const { className, size, centered, scrollable, fullscreen, cssModule } =
      this.props;
    const attributes = omit(this.props, propsToOmit);
    const dialogBaseClass = 'modal-dialog';

    return (
      <div
        {...attributes}
        className={mapToCssModules(
          classNames(dialogBaseClass, className, {
            [`modal-${size}`]: size,
            [`${dialogBaseClass}-centered`]: centered,
            [`${dialogBaseClass}-scrollable`]: scrollable,
            'modal-fullscreen': fullscreen === true,
            [`modal-fullscreen-${fullscreen}-down`]:
              typeof fullscreen === 'string',
          }),
          cssModule,
        )}
        role="document"
        ref={this.dialog}
      >
        <div
          className={mapToCssModules(
            classNames('modal-content', this.props.contentClassName),
            cssModule,
          )}
        >
          {this.props.children}
        </div>
      </div>
    );
  }

  override render() {
    const {
      unmountOnClose,
      wrapClassName,
      modalClassName,
      backdropClassName,
      cssModule,
      isOpen,
      backdrop,
      role,
      labelledBy,
      external,
      innerRef,
      fade: hasTransition,
      modalTransition: modalTransitionProp,
      backdropTransition: backdropTransitionProp,
    } = this.p;

    if (!this.element || (!this.state.isOpen && unmountOnClose)) {
      return null;
    }

    const isModalHidden = !this.state.isOpen && !unmountOnClose;
    this.element.style.display = isModalHidden ? 'none' : 'block';

    const modalAttributes = {
      onClick: this.handleBackdropClick,
      onMouseDown: this.handleBackdropMouseDown,
      onKeyUp: this.handleEscape,
      onKeyDown: this.handleTab,
      style: { display: 'block' },
      'aria-labelledby': labelledBy,
      'aria-modal': true,
      role,
      tabIndex: -1,
    };

    const modalTransition = {
      ...modalTransitionProp,
      baseClass: hasTransition ? modalTransitionProp.baseClass : '',
      timeout: hasTransition ? modalTransitionProp.timeout : 0,
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
          cssModule={cssModule}
          className={mapToCssModules(
            classNames('modal-backdrop', backdropClassName),
            cssModule,
          )}
        />
      ) : (
        <div
          className={mapToCssModules(
            classNames('modal-backdrop', 'show', backdropClassName),
            cssModule,
          )}
        />
      ));

    return createPortal(
      <div className={mapToCssModules(wrapClassName)}>
        <Fade
          {...modalAttributes}
          {...modalTransition}
          in={isOpen}
          onEntered={this.onOpened}
          onExited={this.onClosed}
          cssModule={cssModule}
          className={mapToCssModules(
            classNames(
              'modal',
              modalClassName,
              this.state.showStaticBackdropAnimation && 'modal-static',
            ),
            cssModule,
          )}
          innerRef={innerRef}
        >
          {external}
          {this.renderModalDialog()}
        </Fade>
        {Backdrop}
      </div>,
      this.element,
    );
  }
}

export default Modal;

import {
  Component,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import type {
  Boundary,
  Modifier,
  Placement,
  PositioningStrategy,
} from '@popperjs/core';
import { Popper } from './popper';
import {
  getTarget,
  mapToCssModules,
  type CSSModule,
  type PolymorphicClassExtras,
  type Target,
} from './utils';
import Fade, { type FadeProps } from './Fade';

export type PopperModifier = Partial<Modifier<string, object>>;

/** Defaults applied by React. Mutable on purpose: apps may patch e.g. `PopperContent.defaultProps.offset`. */
export interface PopperContentDefaultProps {
  boundariesElement: Boundary | string;
  placement: Placement;
  hideArrow: boolean;
  isOpen: boolean;
  offset: [number, number];
  flip: boolean;
  container: Target;
  modifiers: PopperModifier[];
  onClosed: () => void;
  fade: boolean;
  transition: FadeProps;
}

export interface PopperContentOwnProps {
  children: ReactNode | ((args: { update: () => void }) => ReactNode);
  /** Element the popper is positioned against. */
  target: Target;
  /** Where to portal the popper; `'inline'` renders in place. */
  container?: Target;
  popperClassName?: string;
  placement?: Placement;
  /** Adds `${placementPrefix}-auto` to the popper. */
  placementPrefix?: string;
  arrowClassName?: string;
  hideArrow?: boolean;
  isOpen?: boolean;
  cssModule?: CSSModule;
  /** Popper `offset` modifier: `[skidding, distance]`. */
  offset?: [number, number];
  fallbackPlacements?: Placement[];
  /** Flip the popper when it would overflow. */
  flip?: boolean;
  /** Extra popper modifiers; same-named ones replace the defaults. */
  modifiers?: PopperModifier[];
  strategy?: PositioningStrategy;
  /** `preventOverflow` boundary. */
  boundariesElement?: Boundary | string;
  onClosed?: () => void;
  /** Animate with Fade. */
  fade?: boolean;
  /** Props for the Fade transition. */
  transition?: FadeProps;
}

/** Props of `PopperContent`; extra props (typed by `tag`, default `div`) go to the Fade wrapper. */
export type PopperContentProps<T extends ElementType = 'div'> =
  PopperContentOwnProps & PolymorphicClassExtras<PopperContentOwnProps, T>;

interface PopperContentState {
  isOpen?: boolean;
}

type ResolvedProps = PopperContentOwnProps &
  PopperContentDefaultProps &
  Omit<HTMLAttributes<HTMLElement>, 'children'> & { tag?: ElementType };

class PopperContent<T extends ElementType = 'div'> extends Component<
  PopperContentProps<T>,
  PopperContentState
> {
  // Not `Readonly<P>`: lets JSX infer `T` from a string `tag` (else it widens to `ElementType`).
  declare props: PopperContentProps<T>;
  static defaultProps: PopperContentDefaultProps = {
    boundariesElement: 'scrollParent',
    placement: 'auto',
    hideArrow: false,
    isOpen: false,
    offset: [0, 0],
    flip: true,
    container: 'body',
    modifiers: [],
    onClosed: () => {},
    fade: true,
    transition: {},
  };

  private element: HTMLDivElement | null = null;

  constructor(props: PopperContentProps<T>) {
    super(props);
    this.state = { isOpen: props.isOpen };
  }

  static getDerivedStateFromProps(
    props: { isOpen?: boolean },
    state: PopperContentState,
  ): PopperContentState | null {
    return props.isOpen && !state.isOpen ? { isOpen: props.isOpen } : null;
  }

  override componentDidUpdate() {
    const child = this.element?.childNodes[0] as HTMLElement | undefined;
    child?.focus?.();
  }

  onClosed = () => {
    (this.props as ResolvedProps).onClosed();
    this.setState({ isOpen: false });
  };

  getRef = (el: HTMLDivElement | null) => {
    this.element = el;
  };

  renderChildren(targetNode: Element | null) {
    const {
      cssModule,
      children,
      isOpen,
      flip,
      target: _target,
      offset,
      fallbackPlacements,
      placementPrefix,
      arrowClassName: _arrowClassName,
      hideArrow,
      popperClassName: _popperClassName,
      tag,
      container: _container,
      modifiers,
      strategy,
      boundariesElement,
      onClosed: _onClosed,
      fade,
      transition,
      placement,
      ...attrs
    } = this.props as ResolvedProps;
    const arrowClassName = mapToCssModules(
      classNames('arrow', _arrowClassName),
      cssModule,
    );
    const popperClassName = mapToCssModules(
      classNames(
        _popperClassName,
        placementPrefix ? `${placementPrefix}-auto` : '',
      ),
      cssModule,
    );

    const modifierNames = modifiers.map((m) => m.name);
    const baseModifiers: PopperModifier[] = [
      { name: 'offset', options: { offset } },
      { name: 'flip', enabled: flip, options: { fallbackPlacements } },
      { name: 'preventOverflow', options: { boundary: boundariesElement } },
    ].filter((m) => !modifierNames.includes(m.name));

    const popperTransition = {
      ...transition,
      baseClass: fade ? transition.baseClass : '',
      timeout: fade ? transition.timeout : 0,
    };

    return (
      <Fade
        {...popperTransition}
        {...attrs}
        in={isOpen}
        onExited={this.onClosed}
        tag={tag}
      >
        <Popper
          referenceElement={targetNode}
          modifiers={[...baseModifiers, ...modifiers]}
          placement={placement}
          strategy={strategy}
        >
          {({
            ref,
            style,
            placement: popperPlacement,
            isReferenceHidden,
            arrowProps,
            update,
          }) => (
            <div
              ref={ref}
              style={style}
              className={popperClassName}
              data-popper-placement={popperPlacement}
              data-popper-reference-hidden={
                isReferenceHidden ? 'true' : undefined
              }
            >
              {typeof children === 'function' ? children({ update }) : children}
              {!hideArrow && (
                <span
                  ref={arrowProps.ref}
                  className={arrowClassName}
                  style={arrowProps.style}
                />
              )}
            </div>
          )}
        </Popper>
      </Fade>
    );
  }

  override render() {
    if (!this.state.isOpen) return null;

    const { target, container } = this.props as ResolvedProps;
    const targetNode = target instanceof Element ? target : getTarget(target);

    return container === 'inline'
      ? this.renderChildren(targetNode)
      : createPortal(
          <div ref={this.getRef}>{this.renderChildren(targetNode)}</div>,
          getTarget(container) as Element,
        );
  }
}

export default PopperContent;

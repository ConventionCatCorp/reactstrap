import {
  Component,
  useState,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import {
  arrow,
  autoPlacement,
  autoUpdate,
  flip as flipMiddleware,
  offset as offsetMiddleware,
  shift,
  useFloating,
  type Alignment,
  type Boundary,
  type Middleware,
  type OffsetOptions,
  type Placement,
  type Strategy,
} from '@floating-ui/react-dom';
import {
  getTarget,
  mapToCssModules,
  type CSSModule,
  type PolymorphicClassExtras,
  type Target,
} from './utils';
import Fade, { type FadeProps } from './Fade';

/** Floating UI placement, plus `auto*` (best fitting side, via `autoPlacement`). */
export type FloatingPlacement = Placement | 'auto' | `auto-${Alignment}`;

/** Defaults applied by React. Mutable on purpose: apps may patch e.g. `FloatingContent.defaultProps.offset`. */
export interface FloatingContentDefaultProps {
  boundary: Boundary;
  placement: FloatingPlacement;
  hideArrow: boolean;
  isOpen: boolean;
  offset: OffsetOptions;
  flip: boolean;
  container: Target;
  middleware: Middleware[];
  onClosed: () => void;
  fade: boolean;
  transition: FadeProps;
}

export interface FloatingContentOwnProps {
  children: ReactNode | ((args: { update: () => void }) => ReactNode);
  /** Element the floating element is positioned against. */
  target: Target;
  /** Where to portal the floating element; `'inline'` renders in place. */
  container?: Target;
  floatingClassName?: string;
  placement?: FloatingPlacement;
  /** Adds `${placementPrefix}-auto` to the floating element. */
  placementPrefix?: string;
  arrowClassName?: string;
  hideArrow?: boolean;
  isOpen?: boolean;
  cssModule?: CSSModule;
  /** Distance from the target (`offset` middleware). */
  offset?: OffsetOptions;
  /** Placements to try when `flip`ping. */
  fallbackPlacements?: Placement[];
  /** Flip to the opposite side when it would overflow. */
  flip?: boolean;
  /** Extra Floating UI middleware; same-named ones replace the defaults (`offset`, `flip`, `shift`). */
  middleware?: Middleware[];
  strategy?: Strategy;
  /** Clipping boundary for `shift`. */
  boundary?: Boundary;
  onClosed?: () => void;
  /** Animate with Fade. */
  fade?: boolean;
  /** Props for the Fade transition. */
  transition?: FadeProps;
}

/** Props of `FloatingContent`; extra props (typed by `tag`, default `div`) go to the Fade wrapper. */
export type FloatingContentProps<T extends ElementType = 'div'> =
  FloatingContentOwnProps & PolymorphicClassExtras<FloatingContentOwnProps, T>;

interface FloatingContentState {
  isOpen?: boolean;
}

type ResolvedProps = FloatingContentOwnProps &
  FloatingContentDefaultProps &
  Omit<HTMLAttributes<HTMLElement>, 'children'> & { tag?: ElementType };

type FloatingProps = Pick<
  ResolvedProps,
  | 'children'
  | 'placement'
  | 'offset'
  | 'flip'
  | 'fallbackPlacements'
  | 'boundary'
  | 'middleware'
  | 'strategy'
  | 'hideArrow'
  | 'arrowClassName'
> & { reference: Element | null; className: string };

function Floating({
  reference,
  placement,
  offset,
  flip,
  fallbackPlacements,
  boundary,
  middleware,
  strategy,
  hideArrow,
  className,
  arrowClassName,
  children,
}: FloatingProps) {
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const [side, alignment] = placement.split('-') as [string, Alignment?];
  const auto = side === 'auto';
  const names = new Set(middleware.map((m) => m.name));
  const defaults = [
    offsetMiddleware(offset),
    auto
      ? autoPlacement({ alignment })
      : flip && flipMiddleware({ fallbackPlacements }),
    shift({ boundary }),
  ].filter((m): m is Middleware => !!m && !names.has(m.name));

  const {
    refs,
    floatingStyles,
    isPositioned,
    middlewareData,
    update,
    placement: actualPlacement,
  } = useFloating({
    elements: { reference },
    placement: auto ? undefined : (placement as Placement),
    strategy,
    middleware: [
      ...defaults,
      ...middleware,
      arrowElement && arrow({ element: arrowElement }),
    ],
    whileElementsMounted: autoUpdate,
  });
  const { setFloating } = refs;
  const arrowData = middlewareData.arrow;

  return (
    <div
      ref={setFloating}
      style={floatingStyles}
      className={className}
      // Bootstrap 5 CSS keys arrows and spacing off this attribute.
      data-popper-placement={isPositioned ? actualPlacement : placement}
    >
      {typeof children === 'function' ? children({ update }) : children}
      {!hideArrow && (
        <span
          ref={setArrowElement}
          className={arrowClassName}
          style={{
            position: 'absolute',
            left: arrowData?.x,
            top: arrowData?.y,
          }}
        />
      )}
    </div>
  );
}

class FloatingContent<T extends ElementType = 'div'> extends Component<
  FloatingContentProps<T>,
  FloatingContentState
> {
  // Not `Readonly<P>`: lets JSX infer `T` from a string `tag` (else it widens to `ElementType`).
  declare props: FloatingContentProps<T>;
  static defaultProps: FloatingContentDefaultProps = {
    boundary: 'clippingAncestors',
    placement: 'auto',
    hideArrow: false,
    isOpen: false,
    offset: 0,
    flip: true,
    container: 'body',
    middleware: [],
    onClosed: () => {},
    fade: true,
    transition: {},
  };

  private element: HTMLDivElement | null = null;

  constructor(props: FloatingContentProps<T>) {
    super(props);
    this.state = { isOpen: props.isOpen };
  }

  static getDerivedStateFromProps(
    props: { isOpen?: boolean },
    state: FloatingContentState,
  ): FloatingContentState | null {
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

  renderChildren(reference: Element | null) {
    const {
      cssModule,
      isOpen,
      target: _target,
      placementPrefix,
      arrowClassName,
      floatingClassName,
      tag,
      container: _container,
      onClosed: _onClosed,
      fade,
      transition,
      children,
      placement,
      offset,
      flip,
      fallbackPlacements,
      boundary,
      middleware,
      strategy,
      hideArrow,
      ...attrs
    } = this.props as ResolvedProps;

    return (
      <Fade
        {...transition}
        baseClass={fade ? transition.baseClass : ''}
        timeout={fade ? transition.timeout : 0}
        {...attrs}
        in={isOpen}
        onExited={this.onClosed}
        tag={tag}
      >
        <Floating
          {...{
            reference,
            children,
            placement,
            offset,
            flip,
            fallbackPlacements,
            boundary,
            middleware,
            strategy,
            hideArrow,
          }}
          className={mapToCssModules(
            classNames(
              floatingClassName,
              placementPrefix && `${placementPrefix}-auto`,
            ),
            cssModule,
          )}
          arrowClassName={mapToCssModules(
            classNames('arrow', arrowClassName),
            cssModule,
          )}
        />
      </Fade>
    );
  }

  override render() {
    if (!this.state.isOpen) return null;

    const { target, container } = this.props as ResolvedProps;
    const reference = target instanceof Element ? target : getTarget(target);

    return container === 'inline'
      ? this.renderChildren(reference)
      : createPortal(
          <div ref={this.getRef}>{this.renderChildren(reference)}</div>,
          getTarget(container) as Element,
        );
  }
}

export default FloatingContent;

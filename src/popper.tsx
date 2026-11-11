import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react';
import {
  createPopper,
  type Instance,
  type Modifier,
  type Placement,
  type PositioningStrategy,
  type State,
} from '@popperjs/core';

/**
 * Minimal replacement for `react-popper` v2 (React 19 compatible).
 * Same `Manager` / `Reference` / `Popper` render-prop API.
 */

type SetRef = (el: HTMLElement | null) => void;

const ManagerContext = createContext<{
  reference: Element | null;
  setReference: SetRef;
} | null>(null);

export function Manager({ children }: { children?: ReactNode }) {
  const [reference, setReference] = useState<Element | null>(null);
  const value = useMemo(() => ({ reference, setReference }), [reference]);
  return (
    <ManagerContext.Provider value={value}>{children}</ManagerContext.Provider>
  );
}

function setRef<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

export function Reference({
  children,
  innerRef,
}: {
  children: (args: { ref: SetRef }) => ReactNode;
  innerRef?: Ref<HTMLElement>;
}) {
  const setReference = useContext(ManagerContext)?.setReference;
  const ref = useCallback(
    (el: HTMLElement | null) => {
      setRef(innerRef, el);
      setReference?.(el);
    },
    [innerRef, setReference],
  );
  return children({ ref });
}

const plain = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype;

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
  }
  if (plain(a) && plain(b)) {
    const keys = Object.keys(a);
    return (
      keys.length === Object.keys(b).length &&
      keys.every((k) => deepEqual(a[k], b[k]))
    );
  }
  return false;
}

export interface PopperChildrenProps {
  ref: SetRef;
  style: CSSProperties;
  placement: Placement;
  isReferenceHidden: boolean;
  hasPopperEscaped: boolean;
  update: () => Promise<Partial<State>> | void;
  forceUpdate: () => void;
  arrowProps: { ref: SetRef; style: CSSProperties };
}

export interface PopperProps {
  children: (props: PopperChildrenProps) => ReactNode;
  referenceElement?: Element | null;
  placement?: Placement;
  strategy?: PositioningStrategy;
  modifiers?: Partial<Modifier<string, object>>[];
  innerRef?: Ref<HTMLElement>;
  onFirstUpdate?: (state: Partial<State>) => void;
}

type PopperState = Pick<State, 'placement'> & {
  styles: { popper: CSSProperties; arrow: CSSProperties };
  attributes: State['attributes'];
};

export function Popper({
  children,
  referenceElement,
  placement = 'bottom',
  strategy = 'absolute',
  modifiers = [],
  innerRef,
  onFirstUpdate,
}: PopperProps) {
  const managerReference = useContext(ManagerContext)?.reference ?? null;
  const reference = referenceElement ?? managerReference;
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const [state, setState] = useState<PopperState>({
    placement,
    styles: {
      popper: { position: strategy, left: '0', top: '0' },
      arrow: { position: 'absolute' },
    },
    attributes: {},
  });

  const popperRef = useCallback(
    (el: HTMLElement | null) => {
      setRef(innerRef, el);
      setPopperElement(el);
    },
    [innerRef],
  );

  const updateState = useMemo(
    () => ({
      name: 'updateState',
      enabled: true,
      phase: 'write' as const,
      fn: ({ state: s }: { state: State }) =>
        setState({
          placement: s.placement,
          styles: {
            popper: (s.styles.popper ?? {}) as CSSProperties,
            arrow: (s.styles.arrow ?? {}) as CSSProperties,
          },
          attributes: s.attributes,
        }),
      requires: ['computeStyles'],
    }),
    [],
  );

  const nextOptions = {
    onFirstUpdate,
    placement,
    strategy,
    modifiers: [
      ...modifiers,
      {
        name: 'arrow',
        enabled: !!arrowElement,
        options: { element: arrowElement },
      },
      updateState,
      { name: 'applyStyles', enabled: false },
    ],
  };
  // Stable identity while deep-equal, so popper isn't recreated every render.
  const [options, setOptions] = useState(nextOptions);
  if (!deepEqual(options, nextOptions)) setOptions(nextOptions);

  const instance = useRef<Instance | null>(null);

  useLayoutEffect(() => {
    if (!reference || !popperElement) return;
    const popper = createPopper(reference, popperElement, options as never);
    instance.current = popper;
    return () => {
      popper.destroy();
      instance.current = null;
    };
  }, [reference, popperElement, options]);

  const update = useCallback(() => instance.current?.update(), []);
  const forceUpdate = useCallback(() => instance.current?.forceUpdate(), []);

  const popperAttrs = state.attributes.popper ?? {};

  // `update`/`forceUpdate` read the ref only when invoked, never during render.
  // oxlint-disable-next-line react/refs
  return children({
    ref: popperRef,
    style: state.styles.popper,
    placement: state.placement,
    isReferenceHidden: !!popperAttrs['data-popper-reference-hidden'],
    hasPopperEscaped: !!popperAttrs['data-popper-escaped'],
    update,
    forceUpdate,
    arrowProps: { ref: setArrowElement, style: state.styles.arrow },
  });
}

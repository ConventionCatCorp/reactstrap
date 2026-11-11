import {
  type Ref,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';

/**
 * Minimal replacement for `react-transition-group`'s `Transition`.
 * Same status machine and callback order, no `findDOMNode`.
 */

export type TransitionStatus =
  'unmounted' | 'exited' | 'entering' | 'entered' | 'exiting';

export type EnterHandler = (node: HTMLElement, isAppearing: boolean) => void;
export type ExitHandler = (node: HTMLElement) => void;

export type TransitionTimeout =
  number | { appear?: number; enter?: number; exit?: number };

export interface TransitionProps {
  /** Show the component; triggers enter or exit. */
  in?: boolean;
  /** Mount the child lazily, on first `in`. */
  mountOnEnter?: boolean;
  /** Unmount the child once it has exited. */
  unmountOnExit?: boolean;
  /** Run the enter transition on mount when `in` is already true. */
  appear?: boolean;
  /** Enable enter transitions. */
  enter?: boolean;
  /** Enable exit transitions. */
  exit?: boolean;
  /** Transition duration in ms. */
  timeout?: TransitionTimeout;
  onEnter?: EnterHandler;
  onEntering?: EnterHandler;
  onEntered?: EnterHandler;
  onExit?: ExitHandler;
  onExiting?: ExitHandler;
  onExited?: ExitHandler;
}

export interface TransitionComponentProps extends TransitionProps {
  nodeRef: RefObject<HTMLElement | null>;
  children: (status: Exclude<TransitionStatus, 'unmounted'>) => ReactNode;
}

export function Transition({
  in: inProp = false,
  mountOnEnter = false,
  unmountOnExit = false,
  appear = false,
  enter = true,
  exit = true,
  timeout,
  nodeRef,
  children,
  ...handlers
}: TransitionComponentProps) {
  const [state, setState] = useState<{ status: TransitionStatus }>(() => ({
    status: inProp
      ? appear
        ? 'exited'
        : 'entered'
      : unmountOnExit || mountOnEnter
        ? 'unmounted'
        : 'exited',
  }));
  const { status } = state;

  // Mount before entering (getDerivedStateFromProps equivalent).
  if (inProp && status === 'unmounted') setState({ status: 'exited' });

  const statusRef = useRef(status);
  statusRef.current = status;
  const latest = useRef({ handlers, enter, exit, timeout, unmountOnExit });
  latest.current = { handlers, enter, exit, timeout, unmountOnExit };

  const gen = useRef(0);
  const queued = useRef<{ gen: number; fn: () => void } | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Run the callback of the last committed status change (setState-callback equivalent).
  useLayoutEffect(() => {
    const q = queued.current;
    if (q && q.gen === gen.current) {
      queued.current = null;
      q.fn();
    }
  });

  const prevIn = useRef<boolean | null>(null);

  useLayoutEffect(() => {
    const prev = prevIn.current;
    prevIn.current = inProp;
    if (prev === inProp) return;

    const node = () => nodeRef.current as HTMLElement;
    const set = (next: TransitionStatus, fn?: () => void) => {
      queued.current = fn ? { gen: gen.current, fn } : null;
      setState({ status: next });
    };
    const wait = (ms: number | undefined, fn: () => void) => {
      const g = gen.current;
      setTimeout(() => {
        if (mounted.current && g === gen.current) fn();
      }, ms ?? 0);
    };
    const durations = () => {
      const t = latest.current.timeout;
      return typeof t === 'object'
        ? { appear: t.appear ?? t.enter, enter: t.enter, exit: t.exit }
        : { appear: t, enter: t, exit: t };
    };

    const performEnter = (appearing: boolean) => {
      gen.current += 1;
      const h = latest.current.handlers;
      if (!appearing && !latest.current.enter) {
        set('entered', () => h.onEntered?.(node(), appearing));
        return;
      }
      h.onEnter?.(node(), appearing);
      set('entering', () => {
        latest.current.handlers.onEntering?.(node(), appearing);
        const d = durations();
        wait(appearing ? d.appear : d.enter, () =>
          set('entered', () =>
            latest.current.handlers.onEntered?.(node(), appearing),
          ),
        );
      });
    };

    const performExit = () => {
      gen.current += 1;
      const finish = () =>
        set('exited', () => {
          latest.current.handlers.onExited?.(node());
          if (latest.current.unmountOnExit) set('unmounted');
        });
      if (!latest.current.exit) {
        finish();
        return;
      }
      latest.current.handlers.onExit?.(node());
      set('exiting', () => {
        latest.current.handlers.onExiting?.(node());
        wait(durations().exit, finish);
      });
    };

    if (prev === null) {
      if (inProp && appear) performEnter(true);
      return;
    }

    const s = statusRef.current;
    if (inProp) {
      if (s !== 'entering' && s !== 'entered') {
        if (unmountOnExit || mountOnEnter) void nodeRef.current?.scrollTop; // force reflow
        performEnter(false);
      }
    } else if (s === 'entering' || s === 'entered') {
      performExit();
    }
    // Only `in` drives transitions; everything else is read through `latest`.
    // oxlint-disable-next-line react/exhaustive-deps
  }, [inProp]);

  return status === 'unmounted' ? null : children(status);
}

/**
 * Object ref for `Transition` that also feeds a user's `innerRef` (object or callback).
 * Returns `[nodeRef, ref]`: pass `nodeRef` to `Transition`, `ref` to the element.
 */
export function useNodeRef<T extends HTMLElement = HTMLElement>(
  innerRef?: Ref<T>,
): [RefObject<T | null>, Ref<T>] {
  const ownRef = useRef<T>(null);
  if (innerRef && typeof innerRef === 'object') return [innerRef, innerRef];
  if (typeof innerRef !== 'function') return [ownRef, ownRef];
  return [
    ownRef,
    (el: T | null) => {
      ownRef.current = el;
      return innerRef(el);
    },
  ];
}

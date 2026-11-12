import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  Ref,
  RefObject,
} from 'react';

export type CSSModule = Record<string, string>;

/** Element type rendered by a component's `tag` prop. */
export type Tag = ElementType;

/** Something that resolves to a DOM element: selector, element, ref or getter. */
export type Target =
  string | Element | RefObject<Element | null> | (() => Element | null);

/** Ref forwarded to the rendered DOM node. */
export type InnerRef<T = HTMLElement> = Ref<T>;

/**
 * Props of a component rendering `tag` (default `T`): its own props, plus the props of
 * whatever `tag` renders. `<Button tag={Link} to="/">` type-checks `to` against `Link`.
 */
export type PolymorphicProps<Own, T extends ElementType> = Own &
  PolymorphicExtras<Own, T>;

/**
 * The `tag` half of `PolymorphicProps`. Components write `XOwnProps & PolymorphicExtras<XOwnProps, T>`
 * so Storybook's react-docgen can see `XOwnProps` (it can't substitute generic type arguments).
 */
export type PolymorphicExtras<Own, T extends ElementType> = {
  /** Element or component to render. */
  tag?: T;
} & Omit<ComponentPropsWithRef<T>, keyof Own | 'tag'>;

/**
 * `PolymorphicProps` for class components: `ref` is the instance, so the tag's `ref` is excluded.
 * Generic classes must also `declare props: XProps<T>;` or `T` isn't inferred from a string `tag`.
 */
export type PolymorphicClassProps<Own, T extends ElementType> = Own &
  PolymorphicClassExtras<Own, T>;

/** The `tag` half of `PolymorphicClassProps` (see `PolymorphicExtras`). */
export type PolymorphicClassExtras<Own, T extends ElementType> = {
  /** Element or component to render. */
  tag?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof Own | 'tag'>;

// https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/js/src/modal.js#L436-L443
export function getScrollbarWidth(): number {
  const scrollDiv = document.createElement('div');
  Object.assign(scrollDiv.style, {
    position: 'absolute',
    top: '-9999px',
    width: '50px',
    height: '50px',
    overflow: 'scroll',
  });
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}

export function setScrollbarWidth(padding: number): void {
  document.body.style.paddingRight = padding > 0 ? `${padding}px` : '';
}

export function isBodyOverflowing(): boolean {
  return document.body.clientWidth < window.innerWidth;
}

export function getOriginalBodyPadding(): number {
  const style = window.getComputedStyle(document.body, null);
  return parseInt(style?.getPropertyValue('padding-right') || '0', 10);
}

export function conditionallyUpdateScrollbar(): void {
  const scrollbarWidth = getScrollbarWidth();
  // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/js/src/modal.js#L433
  const fixedContent = document.querySelector<HTMLElement>(
    '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
  );
  const bodyPadding = fixedContent
    ? parseInt(fixedContent.style.paddingRight || '0', 10)
    : 0;

  if (isBodyOverflowing()) {
    setScrollbarWidth(bodyPadding + scrollbarWidth);
  }
}

let globalCssModule: CSSModule | undefined;

export function setGlobalCssModule(cssModule: CSSModule | undefined): void {
  globalCssModule = cssModule;
}

export function mapToCssModules(
  className = '',
  cssModule: CSSModule | undefined = globalCssModule,
): string {
  if (!cssModule) return className;
  return className
    .split(' ')
    .map((c) => cssModule[c] || c)
    .join(' ');
}

/** Copy of `obj` without `omitKeys`. */
export function omit<T extends object, K extends PropertyKey>(
  obj: T,
  omitKeys: readonly K[],
): Omit<T, K> {
  const result: Record<PropertyKey, unknown> = {};
  for (const key of Object.keys(obj)) {
    if (!omitKeys.includes(key as K)) {
      result[key] = obj[key as keyof T];
    }
  }
  return result as Omit<T, K>;
}

/** Copy of `obj` with only `keys`. */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K | readonly K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of Array.isArray(keys) ? keys : [keys]) {
    result[key as K] = obj[key as K];
  }
  return result;
}

const warned = new Set<string>();

export function warnOnce(message: string): void {
  if (warned.has(message)) return;
  console.error(message); // oxlint-disable-line no-console
  warned.add(message);
}

// Match bootstrap's _variables.scss.
export const TransitionTimeouts = {
  Fade: 150, // $transition-fade
  Collapse: 350, // $transition-collapse
  Modal: 300, // $modal-transition
  Carousel: 600, // $carousel-transition
  Offcanvas: 300, // $offcanvas-transition
} as const;

/** Props consumed by `Transition`; stripped before spreading onto DOM nodes. */
export const TransitionPropTypeKeys = [
  'in',
  'mountOnEnter',
  'unmountOnExit',
  'appear',
  'enter',
  'exit',
  'timeout',
  'onEnter',
  'onEntering',
  'onEntered',
  'onExit',
  'onExiting',
  'onExited',
] as const;

export const TransitionStatuses = {
  ENTERING: 'entering',
  ENTERED: 'entered',
  EXITING: 'exiting',
  EXITED: 'exited',
} as const;

export const keyCodes = {
  esc: 27,
  space: 32,
  enter: 13,
  tab: 9,
  up: 38,
  down: 40,
  home: 36,
  end: 35,
  n: 78,
  p: 80,
} as const;

export const canUseDOM =
  typeof window !== 'undefined' && !!window.document?.createElement;

export function isReactRefObj(target: unknown): target is RefObject<unknown> {
  return !!target && typeof target === 'object' && 'current' in target;
}

export function isObject(value: unknown): value is object {
  return (
    value != null && (typeof value === 'object' || typeof value === 'function')
  );
}

type Found = Element | null | ArrayLike<Element>;

export function findDOMElements(target: Target | ArrayLike<Element>): Found {
  if (isReactRefObj(target)) return target.current;
  if (typeof target === 'function') return target();
  if (typeof target === 'string' && canUseDOM) {
    let selection = document.querySelectorAll(target);
    if (!selection.length) selection = document.querySelectorAll(`#${target}`);
    if (!selection.length) {
      throw new Error(
        `The target '${target}' could not be identified in the dom, tip: check spelling`,
      );
    }
    return selection;
  }
  return target as Found;
}

export function isArrayOrNodeList(els: unknown): els is ArrayLike<Element> {
  if (els === null) return false;
  return (
    Array.isArray(els) ||
    (canUseDOM && typeof (els as ArrayLike<Element>).length === 'number')
  );
}

export function getTarget(
  target: Target,
  allElements: true,
): ArrayLike<Element>;
export function getTarget(target: Target, allElements?: false): Element | null;
export function getTarget(
  target: Target,
  allElements?: boolean,
): Element | null | ArrayLike<Element> {
  const els = findDOMElements(target);
  if (allElements) {
    if (isArrayOrNodeList(els)) return els;
    return els === null ? [] : [els as Element];
  }
  return isArrayOrNodeList(els) ? (els[0] ?? null) : els;
}

export const defaultToggleEvents = ['touchstart', 'click'];

export function addMultipleEventListeners(
  _els: Element | ArrayLike<Element>,
  handler: EventListener,
  _events: string | string[],
  useCapture?: boolean,
): () => void {
  const els: ArrayLike<Element> = isArrayOrNodeList(_els) ? _els : [_els];
  const events = typeof _events === 'string' ? _events.split(/\s+/) : _events;

  if (typeof handler !== 'function' || !Array.isArray(events)) {
    throw new Error(`
      The first argument of this function must be DOM node or an array on DOM nodes or NodeList.
      The second must be a function.
      The third is a string or an array of strings that represents DOM events
    `);
  }

  const each = (fn: (el: Element, event: string) => void) =>
    events.forEach((event) =>
      Array.prototype.forEach.call(els, (el: Element) => fn(el, event)),
    );

  each((el, event) => el.addEventListener(event, handler, useCapture));
  return () =>
    each((el, event) => el.removeEventListener(event, handler, useCapture));
}

export const focusableElements = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type=hidden])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'object',
  'embed',
  '[tabindex]:not(.modal):not(.offcanvas)',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
];

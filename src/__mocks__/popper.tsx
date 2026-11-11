import type { ReactNode } from 'react';
import type { PopperChildrenProps, PopperProps } from '../popper';

const noop = () => {};

export function Manager({ children }: { children?: ReactNode }) {
  return children;
}

export const Popper = vi.fn(({ children, placement = 'bottom' }: PopperProps) =>
  children({
    ref: noop,
    placement,
    style: {},
    isReferenceHidden: false,
    hasPopperEscaped: false,
    update: noop,
    forceUpdate: noop,
    arrowProps: { ref: noop, style: {} },
  } satisfies PopperChildrenProps),
);

export function Reference({
  children,
}: {
  children: (a: { ref: typeof noop }) => ReactNode;
}) {
  return children({ ref: noop });
}

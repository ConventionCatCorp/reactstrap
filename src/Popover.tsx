import type { Ref } from 'react';
import classNames from 'classnames';
import TooltipPopoverWrapper, {
  type TooltipPopoverWrapperProps,
} from './TooltipPopoverWrapper';

export interface PopoverProps extends TooltipPopoverWrapperProps {
  /** @default 'right' */
  placement?: TooltipPopoverWrapperProps['placement'];
  /** @default 'bs-popover' */
  placementPrefix?: string;
  /** @default 'click' */
  trigger?: string;
  /** @default [0, 8] */
  offset?: [number, number];
  /** The underlying `TooltipPopoverWrapper` instance. */
  ref?: Ref<TooltipPopoverWrapper>;
}

function Popover({
  placement = 'right',
  placementPrefix = 'bs-popover',
  trigger = 'click',
  offset = [0, 8],
  arrowClassName,
  popperClassName,
  innerClassName,
  ...props
}: PopoverProps) {
  return (
    <TooltipPopoverWrapper
      {...props}
      placement={placement}
      placementPrefix={placementPrefix}
      trigger={trigger}
      offset={offset}
      arrowClassName={classNames('popover-arrow', arrowClassName)}
      popperClassName={classNames('popover', 'show', popperClassName)}
      innerClassName={classNames('popover-inner', innerClassName)}
    />
  );
}

export default Popover;

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
  /** @default 8 */
  offset?: TooltipPopoverWrapperProps['offset'];
  /** The underlying `TooltipPopoverWrapper` instance. */
  ref?: Ref<TooltipPopoverWrapper>;
}

function Popover({
  placement = 'right',
  placementPrefix = 'bs-popover',
  trigger = 'click',
  offset = 8,
  arrowClassName,
  floatingClassName,
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
      floatingClassName={classNames('popover', 'show', floatingClassName)}
      innerClassName={classNames('popover-inner', innerClassName)}
    />
  );
}

export default Popover;

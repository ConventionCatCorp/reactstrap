import type { Ref } from 'react';
import classNames from 'classnames';
import TooltipPopoverWrapper, {
  type TooltipPopoverWrapperProps,
} from './TooltipPopoverWrapper';

export interface TooltipProps extends TooltipPopoverWrapperProps {
  /** @default 'top' */
  placement?: TooltipPopoverWrapperProps['placement'];
  /** @default true */
  autohide?: boolean;
  /** @default 'bs-tooltip' */
  placementPrefix?: string;
  /** @default 'hover focus' */
  trigger?: string;
  /** The underlying `TooltipPopoverWrapper` instance. */
  ref?: Ref<TooltipPopoverWrapper>;
}

function Tooltip({
  placement = 'top',
  autohide = true,
  placementPrefix = 'bs-tooltip',
  trigger = 'hover focus',
  arrowClassName,
  floatingClassName,
  innerClassName,
  ...props
}: TooltipProps) {
  return (
    <TooltipPopoverWrapper
      {...props}
      placement={placement}
      autohide={autohide}
      placementPrefix={placementPrefix}
      trigger={trigger}
      arrowClassName={classNames('tooltip-arrow', arrowClassName)}
      floatingClassName={classNames('tooltip', 'show', floatingClassName)}
      innerClassName={classNames('tooltip-inner', innerClassName)}
    />
  );
}

export default Tooltip;

import { useState } from 'react';
import Tooltip, { type TooltipProps } from './Tooltip';

export interface UncontrolledTooltipProps extends TooltipProps {
  /** Initial open state. */
  defaultOpen?: boolean;
}

function UncontrolledTooltip({
  defaultOpen = false,
  ...props
}: UncontrolledTooltipProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <Tooltip isOpen={isOpen} toggle={() => setIsOpen((o) => !o)} {...props} />
  );
}

export default UncontrolledTooltip;

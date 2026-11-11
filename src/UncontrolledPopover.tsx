import { useState } from 'react';
import Popover, { type PopoverProps } from './Popover';

export interface UncontrolledPopoverProps extends PopoverProps {
  /** Initial open state. */
  defaultOpen?: boolean;
}

function UncontrolledPopover({
  defaultOpen = false,
  ...props
}: UncontrolledPopoverProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <Popover isOpen={isOpen} toggle={() => setIsOpen((o) => !o)} {...props} />
  );
}

export default UncontrolledPopover;

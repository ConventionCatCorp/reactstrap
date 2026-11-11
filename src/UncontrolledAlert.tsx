import { useState, type ElementType } from 'react';
import Alert, { type AlertProps } from './Alert';

/** `isOpen`/`toggle` are managed internally but may still be overridden. */
export type UncontrolledAlertProps<T extends ElementType = 'div'> =
  AlertProps<T>;

function UncontrolledAlert<T extends ElementType = 'div'>(
  props: UncontrolledAlertProps<T>,
) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Alert isOpen={isOpen} toggle={() => setIsOpen((o) => !o)} {...props} />
  );
}

export default UncontrolledAlert;

import { useState } from 'react';
import {
  Button,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  type OffcanvasProps,
} from '@conventioncatcorp/reactstrap';

function Example(args: Partial<OffcanvasProps>) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  return (
    <div>
      <Button
        color="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        Open
      </Button>
      <Offcanvas {...args} isOpen={open} toggle={toggle}>
        <OffcanvasHeader toggle={toggle}>Offcanvas</OffcanvasHeader>
        <OffcanvasBody>
          <strong>This is the Offcanvas body.</strong>
        </OffcanvasBody>
      </Offcanvas>
    </div>
  );
}

export default Example;

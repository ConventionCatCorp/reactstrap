import { useState } from 'react';
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  Collapse,
} from '@conventioncatcorp/reactstrap';

function PopoverContent({ update }: { update: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <PopoverHeader>Update</PopoverHeader>
      <PopoverBody>
        <Button onClick={() => setIsOpen(!isOpen)}>Click me</Button>
        <Collapse isOpen={isOpen} onEntered={update} onExited={update}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Collapse>
      </PopoverBody>
    </>
  );
}

function Example() {
  return (
    <div className="text-center">
      <Button id="ScheduleUpdateButton" type="button">
        Open Popover
      </Button>
      <UncontrolledPopover
        trigger="click"
        placement="top"
        target="ScheduleUpdateButton"
      >
        {({ update }) => <PopoverContent update={update} />}
      </UncontrolledPopover>
    </div>
  );
}

export default Example;

import { useState } from 'react';
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  type PopoverProps,
} from '@conventioncatcorp/reactstrap';

interface PopoverItemProps {
  id: number;
  item: { placement: PopoverProps['placement']; text: string };
}

function PopoverItem({ id, item }: PopoverItemProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  return (
    <>
      <Button
        className="me-1"
        color="secondary"
        id={'Popover-' + id}
        type="button"
      >
        {item.text}
      </Button>
      <Popover
        placement={item.placement}
        isOpen={popoverOpen}
        target={'Popover-' + id}
        toggle={toggle}
      >
        <PopoverHeader>Popover Title</PopoverHeader>
        <PopoverBody>
          Sed posuere consectetur est at lobortis. Aenean eu leo quam.
          Pellentesque ornare sem lacinia quam venenatis vestibulum.
        </PopoverBody>
      </Popover>
    </>
  );
}

function PopoverExampleMulti() {
  return (
    <>
      {[
        {
          placement: 'top' as const,
          text: 'Popover on Top',
        },
        {
          placement: 'bottom' as const,
          text: 'Popover on Bottom',
        },
        {
          placement: 'left' as const,
          text: 'Popover on Left',
        },
        {
          placement: 'right' as const,
          text: 'Popover on Right',
        },
      ].map((popover, i) => {
        return <PopoverItem key={i} item={popover} id={i} />;
      })}
    </>
  );
}

export default PopoverExampleMulti;

PopoverExampleMulti.parameters = {
  docs: {
    description: {
      story: 'Four options are available: top, right, bottom, and left.',
    },
  },
};

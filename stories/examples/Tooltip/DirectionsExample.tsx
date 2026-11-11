import { useState } from 'react';
import {
  Button,
  Tooltip,
  type TooltipProps,
} from '@conventioncatcorp/reactstrap';

interface TooltipItemProps {
  id: string;
  item: { placement: TooltipProps['placement']; text: string };
}

function TooltipItem({ item, id }: TooltipItemProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <span>
      <Button className="me-1" color="secondary" id={'Tooltip-' + id}>
        {item.text}
      </Button>
      <Tooltip
        placement={item.placement}
        isOpen={tooltipOpen}
        target={'Tooltip-' + id}
        toggle={toggle}
      >
        Tooltip Content!
      </Tooltip>
    </span>
  );
}

function TooltipExampleMulti() {
  return (
    <>
      {[
        {
          placement: 'top' as const,
          text: 'Tooltip on Top',
        },
        {
          placement: 'bottom' as const,
          text: 'Tooltip on Bottom',
        },
        {
          placement: 'left' as const,
          text: 'Tooltip on Left',
        },
        {
          placement: 'right' as const,
          text: 'Tooltip on Right',
        },
      ].map((tooltip, i) => {
        return <TooltipItem key={i} item={tooltip} id={`Tooltip-${i}`} />;
      })}
    </>
  );
}

export default TooltipExampleMulti;

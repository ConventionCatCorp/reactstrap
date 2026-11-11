import { useState, useEffect } from 'react';
import { Button, UncontrolledTooltip } from '@conventioncatcorp/reactstrap';

const shortText = 'Hi';
const longText = 'Long tooltip content to test update';

function TooltipContent({ update }: { update: () => void }) {
  const [text, setText] = useState(shortText);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setText(text === shortText ? longText : shortText);
      update();
    }, 2000);

    return () => clearInterval(intervalId);
  });

  return <div>{text}</div>;
}

function Example() {
  return (
    <div className="text-center">
      <Button id="ScheduleUpdateTooltip">Click me</Button>
      <UncontrolledTooltip
        placement="top"
        target="ScheduleUpdateTooltip"
        trigger="click"
      >
        {({ update }) => <TooltipContent update={update} />}
      </UncontrolledTooltip>
    </div>
  );
}

export default Example;

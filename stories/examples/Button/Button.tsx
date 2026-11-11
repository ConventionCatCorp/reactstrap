import { Button, type ButtonProps } from '@conventioncatcorp/reactstrap';
import { colors } from '../options';

function Example(args: ButtonProps) {
  return (
    <div>
      <Button {...args} />
    </div>
  );
}

Example.args = {
  children: 'Click Me',
  color: 'primary',
  outline: false,
  size: undefined,
  block: false,
  active: false,
  close: false,
};

Example.argTypes = {
  color: {
    control: { type: 'select' },
    options: colors,
  },
  size: {
    control: { type: 'select' },
    options: ['', 'sm', 'lg'],
  },
};

export default Example;

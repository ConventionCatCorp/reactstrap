import { Spinner, type SpinnerProps } from '@conventioncatcorp/reactstrap';
import { colors } from '../options';

function Example(args: SpinnerProps) {
  return <Spinner {...args} />;
}

Example.args = {
  type: 'border',
};

Example.argTypes = {
  type: {
    control: { type: 'select' },
    options: ['border', 'grow'],
  },
  color: {
    control: { type: 'select' },
    options: colors,
  },
  size: {
    control: { type: 'select' },
    options: ['', 'sm'],
  },
};
export default Example;

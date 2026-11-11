import { Alert, type AlertProps } from '@conventioncatcorp/reactstrap';
import { colors } from '../options';

function Example(args: AlertProps) {
  return <Alert {...args} isOpen />;
}

Example.args = {
  children: 'Hey! Pay attention.',
  color: 'primary',
};

Example.argTypes = {
  color: {
    control: { type: 'select' },
    options: colors,
  },
};

export default Example;

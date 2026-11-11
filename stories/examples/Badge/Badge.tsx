import { Badge, type BadgeProps } from '@conventioncatcorp/reactstrap';
import { colors } from '../options';

function Example(args: BadgeProps) {
  return <Badge {...args} />;
}

Example.args = {
  children: 'New',
  color: 'primary',
  pill: false,
};

Example.argTypes = {
  color: {
    control: { type: 'select' },
    options: colors,
  },
};

export default Example;

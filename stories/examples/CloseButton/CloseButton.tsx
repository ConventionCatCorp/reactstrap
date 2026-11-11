import {
  CloseButton,
  type CloseButtonProps,
} from '@conventioncatcorp/reactstrap';

function Example(args: CloseButtonProps) {
  return <CloseButton {...args} />;
}

Example.args = {
  disabled: false,
};

export default Example;

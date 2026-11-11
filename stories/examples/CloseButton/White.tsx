import { CloseButton } from '@conventioncatcorp/reactstrap';

function Example() {
  return (
    <div className="bg-dark p-3">
      <CloseButton variant="white" />
    </div>
  );
}

Example.parameters = {
  docs: {
    description: {
      story:
        'Change the default `ButtonClose` to be white with the `variant` prop. ',
    },
  },
};

export default Example;

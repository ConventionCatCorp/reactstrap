import { UncontrolledAlert } from '@conventioncatcorp/reactstrap';

function Example() {
  return (
    <UncontrolledAlert color="info">
      I am an alert and I can be dismissed!
    </UncontrolledAlert>
  );
}

export default Example;

Example.parameters = {
  docs: {
    description: {
      story:
        'And if you are not a fan of using state, you can always use `UncontrolledAlert`.',
    },
  },
};

import { Spinner } from '@conventioncatcorp/reactstrap';
import { colors } from '../options';

function Example() {
  return (
    <>
      {colors.map((color) => (
        <Spinner color={color} key={color} />
      ))}
    </>
  );
}

export default Example;

Example.parameters = {
  docs: {
    description: {
      story:
        'All standard visual variant colors can be applied for the spinner.',
    },
  },
};

import { Spinner } from '@conventioncatcorp/reactstrap';

function Example() {
  return (
    <>
      <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
      <Spinner
        type="grow"
        color="primary"
        style={{ width: '3rem', height: '3rem' }}
      />
    </>
  );
}

export default Example;

Example.parameters = {
  docs: {
    description: {
      story: 'Or use custom css as needed',
    },
  },
};

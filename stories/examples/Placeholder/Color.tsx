import { Placeholder } from '@conventioncatcorp/reactstrap';

function Example() {
  return (
    <>
      <Placeholder xs={12} />

      <Placeholder xs={12} color="primary" />
      <Placeholder xs={12} color="secondary" />
      <Placeholder xs={12} color="success" />
      <Placeholder xs={12} color="danger" />
      <Placeholder xs={12} color="warning" />
      <Placeholder xs={12} color="info" />
      <Placeholder xs={12} color="light" />
      <Placeholder xs={12} color="dark" />
    </>
  );
}

export default Example;

Example.parameters = {
  docs: {
    description: {
      story: 'Add custom color with `color` prop.',
    },
  },
};

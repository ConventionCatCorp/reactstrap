import { Alert } from '@conventioncatcorp/reactstrap';
import { colors } from '../options';

function Example() {
  return (
    <>
      {colors.map((color) => (
        <Alert color={color} key={color}>
          This is a primary alert — check it out!
        </Alert>
      ))}
    </>
  );
}

export default Example;

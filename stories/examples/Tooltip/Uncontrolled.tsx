import { UncontrolledTooltip } from '@conventioncatcorp/reactstrap';

export default function Example() {
  return (
    <div>
      <p>
        Somewhere in here is a{' '}
        <span
          style={{ textDecoration: 'underline', color: 'blue' }}
          id="UncontrolledTooltipExample"
        >
          tooltip
        </span>
        .
      </p>
      <UncontrolledTooltip
        placement="right"
        target="UncontrolledTooltipExample"
      >
        Hello world!
      </UncontrolledTooltip>
    </div>
  );
}

Example.parameters = {
  docs: {
    description: {
      story: 'Not a fan of handling state? We got `UncontrolledTooltip`.',
    },
  },
};

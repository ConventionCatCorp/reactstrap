import type { Meta } from '@storybook/react-vite';
import { InputGroup, InputGroupText } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/InputGroup',
  component: InputGroup,
  subcomponents: { InputGroupText },
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap InputGroup](https://getbootstrap.com/docs/5.3/forms/input-group/)
  
  Extend form controls by adding text, buttons, or button groups on either side of textual inputs, custom selects, and custom file inputs.
  `,
      },
    },
  },
} satisfies Meta<typeof InputGroup>;

export { default as InputGroup } from './examples/InputGroup/Overview';
export { default as Sizing } from './examples/InputGroup/Sizing';
export { default as MultipleAddons } from './examples/InputGroup/Addon';
export { default as ButtonAddons } from './examples/InputGroup/Button';
export { default as ButtonShorthand } from './examples/InputGroup/ButtonShorthand';

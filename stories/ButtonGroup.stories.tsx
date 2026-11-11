import type { Meta } from '@storybook/react-vite';
import { ButtonGroup, ButtonToolbar } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  subcomponents: { ButtonToolbar },
  parameters: {
    docs: {
      description: {
        component: `
[Bootstrap Buttons](https://getbootstrap.com/docs/5.3/components/buttons/)

Group a series of buttons together on a single line or stack them in a vertical column.
        `,
      },
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export { default as ButtonGroup } from './examples/ButtonGroup/ButtonGroup';
export { default as MixedStyles } from './examples/ButtonGroup/MixedStyles';
export { default as CheckboxAndRadio } from './examples/ButtonGroup/Stateful';
export { default as ButtonToolbar } from './examples/ButtonGroup/Toolbar';
export { default as Sizing } from './examples/ButtonGroup/Sizing';
export { default as Nesting } from './examples/ButtonGroup/Nesting';
export { default as Vertical } from './examples/ButtonGroup/Vertical';

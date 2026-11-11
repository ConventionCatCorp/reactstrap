import type { Meta } from '@storybook/react-vite';
import { Button } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `
[Bootstrap Buttons](https://getbootstrap.com/docs/5.3/components/buttons/)

Custom Buttons for actions in forms, dialogs, and more with support for multiple sizes, states, and more.
        `,
      },
    },
  },
} satisfies Meta<typeof Button>;

export { default as Button } from './examples/Button/Button';
export { default as Variants } from './examples/Button/Colors';
export { default as CustomTags } from './examples/Button/Tags';
export { default as Outline } from './examples/Button/Outline';
export { default as Sizes } from './examples/Button/Size';
export { default as Disabled } from './examples/Button/Disabled';

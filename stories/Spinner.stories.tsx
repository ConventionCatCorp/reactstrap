import type { Meta } from '@storybook/react-vite';
import { Spinner } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap Spinners](https://getbootstrap.com/docs/5.3/components/spinners/)
  
  Indicate the loading state of a component or page with Spinners.
  `,
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export { default as Spinner } from './examples/Spinner/Spinner';
export { default as Colors } from './examples/Spinner/Colors';
export { default as GrowingSpinner } from './examples/Spinner/Grower';
export { default as Alignment } from './examples/Spinner/Alignment';
export { default as Size } from './examples/Spinner/Size';
export { default as CustomSize } from './examples/Spinner/CustomSize';
export { default as Buttons } from './examples/Spinner/Button';

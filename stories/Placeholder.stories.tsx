import type { Meta } from '@storybook/react-vite';
import { Placeholder } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Placeholder',
  component: Placeholder,
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap Placeholder](https://getbootstrap.com/docs/5.3/components/placeholders/)

  Use loading placeholders for your components or pages to indicate something may still be loading.   
        `,
      },
    },
  },
} satisfies Meta<typeof Placeholder>;

export { default as Placeholder } from './examples/Placeholder/Placeholder';
export { default as Color } from './examples/Placeholder/Color';
export { default as Sizing } from './examples/Placeholder/Size';
export { default as Animation } from './examples/Placeholder/Animation';

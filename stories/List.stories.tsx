import type { Meta } from '@storybook/react-vite';
import { List, ListInlineItem } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/List',
  component: List,
  subcomponents: { ListInlineItem },
  parameters: {
    docs: {
      description: {
        component:
          '[Bootstrap Lists](https://getbootstrap.com/docs/5.3/content/typography/#lists)',
      },
    },
  },
} satisfies Meta<typeof List>;

export { default as List } from './examples/List/List';
export { default as Inline } from './examples/List/Inline';
export { default as Unstyled } from './examples/List/Unstyled';

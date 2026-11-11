import type { Meta } from '@storybook/react-vite';
import {
  Pagination,
  PaginationItem,
  PaginationLink,
} from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Pagination',
  component: Pagination,
  subcomponents: { PaginationItem, PaginationLink },
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap Pagination](https://getbootstrap.com/docs/5.3/components/pagination/)
  
  Use Pagination to indicate that a series of related content exists across multiple pages.
  `,
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export { default as Pagination } from './examples/Pagination/Pagination';
export { default as Large } from './examples/Pagination/SizingLarge';
export { default as Small } from './examples/Pagination/SizingSmall';
export { default as State } from './examples/Pagination/State';

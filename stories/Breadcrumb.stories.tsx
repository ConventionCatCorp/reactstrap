import type { Meta } from '@storybook/react-vite';
import { Breadcrumb, BreadcrumbItem } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  subcomponents: { BreadcrumbItem },
  parameters: {
    docs: {
      description: {
        component: `
[Bootstrap Breadcrumb](https://getbootstrap.com/docs/5.3/components/breadcrumb/)

Indicate the current page’s location within a navigational hierarchy that automatically adds separators.
        `,
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export { default as Breadcrumb } from './examples/Breadcrump/Breadcrumb';
export { default as NoList } from './examples/Breadcrump/NoList';

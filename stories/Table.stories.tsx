import type { Meta } from '@storybook/react-vite';
import { Table } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          '[Bootstrap Tables](https://getbootstrap.com/docs/5.3/content/tables/)',
      },
    },
  },
} satisfies Meta<typeof Table>;

export { default as Table } from './examples/Table/Table';
export { default as Variants } from './examples/Table/Variants';
export { default as Striped } from './examples/Table/Striped';
export { default as HoverableRows } from './examples/Table/Hover';
export { default as Bordered } from './examples/Table/Bordered';
export { default as Borderless } from './examples/Table/Borderless';
export { default as SmallTable } from './examples/Table/Sizing';
export { default as Dark } from './examples/Table/Dark';
export { default as Responsive } from './examples/Table/Responsive';

import type { Meta } from '@storybook/react-vite';
import { Nav, NavItem, NavLink } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Nav',
  component: Nav,
  subcomponents: { NavItem, NavLink },
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap Navs](https://getbootstrap.com/docs/5.3/components/navs-tabs/)
  
  Bootstrap’s navigation components.
  `,
      },
    },
  },
} satisfies Meta<typeof Nav>;

export { default as Navs } from './examples/Nav/Navs';
export { default as Vertical } from './examples/Nav/Vertical';
export { default as Tabs } from './examples/Nav/Tabs';
export { default as Pills } from './examples/Nav/Pills';
export { default as Fill } from './examples/Nav/Fill';
export { default as Justify } from './examples/Nav/Justify';
export { default as TabPane } from './examples/Nav/TabPane';

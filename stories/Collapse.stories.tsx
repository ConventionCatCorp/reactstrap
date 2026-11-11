import type { Meta } from '@storybook/react-vite';
import { Collapse, UncontrolledCollapse } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Collapse',
  component: Collapse,
  subcomponents: { UncontrolledCollapse },
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap Collapse](https://getbootstrap.com/docs/5.3/components/collapse/)
  
  Toggle the visibility of content across your project with Collapse.
  `,
      },
    },
  },
} satisfies Meta<typeof Collapse>;

export { default as Collapse } from './examples/Collapse/Collapse';
export { default as CollapseEvents } from './examples/Collapse/Events';
export { default as CollapseHorizontal } from './examples/Collapse/Horizontal';
export { default as CollapseUncontrolled } from './examples/Collapse/Uncontrolled';

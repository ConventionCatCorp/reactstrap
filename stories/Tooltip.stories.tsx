import type { Meta } from '@storybook/react-vite';
import { Tooltip, UncontrolledTooltip } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  subcomponents: { UncontrolledTooltip },
  parameters: {
    docs: {
      description: {
        component:
          '[Bootstrap Tooltips](https://getbootstrap.com/docs/5.3/components/tooltips/)',
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export { default as Tooltip } from './examples/Tooltip/Tooltip';
export { default as Directions } from './examples/Tooltip/Directions';
export { default as AutoHide } from './examples/Tooltip/AutoHide';
export { default as Uncontrolled } from './examples/Tooltip/Uncontrolled';
export { default as Update } from './examples/Tooltip/Update';

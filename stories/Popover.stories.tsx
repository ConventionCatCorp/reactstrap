import type { Meta } from '@storybook/react-vite';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
} from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Popover',
  component: Popover,
  subcomponents: { PopoverHeader, PopoverBody },
  parameters: {
    docs: {
      description: {
        component:
          '[Bootstrap Popovers](https://getbootstrap.com/docs/5.3/components/popovers/)',
      },
    },
  },
} satisfies Meta<typeof Popover>;

export { default as Popover } from './examples/Popover/Popover';
export { default as Focus } from './examples/Popover/Focus';
export { default as FourDirections } from './examples/Popover/Multi';
export { default as Uncontrolled } from './examples/Popover/Uncontrolled';
export { default as Update } from './examples/Popover/Update';

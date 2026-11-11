import type { Meta } from '@storybook/react-vite';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  subcomponents: { DropdownToggle, DropdownMenu, DropdownItem },
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap Dropdowns](https://getbootstrap.com/docs/5.3/components/dropdowns/)
  
  Toggle contextual overlays for displaying lists of links and more with Dropdowns.
  `,
      },
    },
  },
} satisfies Meta<typeof Dropdown>;

export { default as Dropdown } from './examples/Dropdown/Dropdown';
export { default as SplitButton } from './examples/Dropdown/Split';
export { default as Sizing } from './examples/Dropdown/Sizing';
export { default as DarkDropdown } from './examples/Dropdown/Dark';
export { default as Directions } from './examples/Dropdown/DirectionKitchen';
export { default as SetActiveFromChild } from './examples/Dropdown/SetActiveFromChild';

export { default as Container } from './examples/Dropdown/Container';
export { default as Uncontrolled } from './examples/Dropdown/Uncontrolled';
export { default as CustomDropdown } from './examples/Dropdown/Custom';

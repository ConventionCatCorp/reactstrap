import type { Meta } from '@storybook/react-vite';
import {
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
} from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Offcanvas',
  component: Offcanvas,
  subcomponents: { OffcanvasBody, OffcanvasHeader },
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap Offcanvas](https://getbootstrap.com/docs/5.3/components/offcanvas/)
  
  Add hidden sidebars into your project for navigation, shopping carts, and more. 
  `,
      },
    },
  },
} satisfies Meta<typeof Offcanvas>;

export { default as Offcanvas } from './examples/Offcanvas/Offcanvas';

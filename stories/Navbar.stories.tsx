import type { Meta } from '@storybook/react-vite';
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  NavbarText,
} from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Navbar',
  component: Navbar,
  subcomponents: { NavbarToggler, NavbarBrand, NavbarText },
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap Navbar](https://getbootstrap.com/docs/5.3/components/navbar/)
  
  Bootstrap’s powerful, responsive navigation header. Includes support for branding, navigation, and more.
  `,
      },
    },
  },
} satisfies Meta<typeof Navbar>;

export { default as Navbar } from './examples/Navbar/Navbar';
export { default as Brand } from './examples/Navbar/Brand';
export { default as NavbarToggler } from './examples/Navbar/Toggler';

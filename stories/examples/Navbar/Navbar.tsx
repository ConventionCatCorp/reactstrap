import type { StoryObj } from '@storybook/react-vite';
import Example from './NavbarExample';
import NavbarExample from './NavbarExample?raw';
import { colors } from '../options';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: NavbarExample,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
  args: {
    color: 'light',
    light: true,
    dark: false,
    expand: 'md',
    container: 'fluid',
  },
  argTypes: {
    color: {
      control: { type: 'select' },
      options: colors,
    },
    container: {
      control: { type: 'select' },
      options: [false, true, 'sm', 'md', 'lg', 'xl', 'fluid'],
    },
    expand: {
      control: { type: 'select' },
      options: [false, true, 'sm', 'md', 'lg', 'xl'],
    },
    fixed: {
      control: { type: 'select' },
      options: ['', 'top', 'bottom'],
    },
  },
} satisfies StoryObj<typeof Example>;

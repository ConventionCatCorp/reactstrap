import type { StoryObj } from '@storybook/react-vite';
import Example from './ModalExample';
import ModalExample from './ModalExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: ModalExample,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
  args: {
    fullscreen: false,
    size: undefined,
    backdrop: true,
    fade: true,
    centered: false,
    scrollable: false,
  },
  argTypes: {
    fullscreen: {
      control: { type: 'select' },
      options: ['', true, 'sm', 'md', 'lg', 'xl'],
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg', 'xl'],
    },
  },
} satisfies StoryObj<typeof Example>;

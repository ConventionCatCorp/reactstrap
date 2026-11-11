import type { StoryObj } from '@storybook/react-vite';
import Example from './OffcanvasExample';
import OffcanvasExample from './OffcanvasExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: OffcanvasExample,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
  args: {
    backdrop: true,
    fade: true,
    scrollable: false,
  },
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['top', 'start', 'end', 'bottom'],
    },
  },
} satisfies StoryObj<typeof Example>;

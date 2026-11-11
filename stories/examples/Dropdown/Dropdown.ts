import type { StoryObj } from '@storybook/react-vite';
import Example from './DropdownExample';
import code from './DropdownExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code,
        language: 'tsx',
      },
    },
  },
  args: {
    dark: false,
    end: false,
    flip: false,
  },
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['up', 'down', 'start', 'end'],
    },
  },
} satisfies StoryObj<typeof Example>;

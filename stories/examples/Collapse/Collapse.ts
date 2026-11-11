import type { StoryObj } from '@storybook/react-vite';
import Example from './CollapseExample';
import code from './CollapseExample?raw';

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
    horizontal: false,
  },
} satisfies StoryObj<typeof Example>;

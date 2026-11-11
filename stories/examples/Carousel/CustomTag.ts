import type { StoryObj } from '@storybook/react-vite';
import Example from './CustomTagExample';
import code from './CustomTagExample?raw';

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
} satisfies StoryObj<typeof Example>;

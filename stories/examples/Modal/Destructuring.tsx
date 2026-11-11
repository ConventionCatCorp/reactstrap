import type { StoryObj } from '@storybook/react-vite';
import Example from './DestructuringExample';
import Destructuring from './DestructuringExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: Destructuring,
        language: 'tsx',
        type: 'auto',
      },
      description: {
        story: 'Unmount modal on closing using the `unmountOnClose` prop.',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

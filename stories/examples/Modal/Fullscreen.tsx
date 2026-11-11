import type { StoryObj } from '@storybook/react-vite';
import Example from './FullscreenExample';
import Fullscreen from './FullscreenExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: Fullscreen,
        language: 'tsx',
        type: 'auto',
      },
      description: {
        story: 'Make the modal fullscreen.',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

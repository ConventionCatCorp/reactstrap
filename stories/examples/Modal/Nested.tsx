import type { StoryObj } from '@storybook/react-vite';
import Example from './NestedExample';
import Nested from './NestedExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: Nested,
        language: 'tsx',
        type: 'auto',
      },
      description: {
        story: 'Nest modals by putting a modal inside another.',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

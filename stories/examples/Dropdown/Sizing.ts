import type { StoryObj } from '@storybook/react-vite';
import Example from './SizingExample';
import code from './SizingExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code,
        language: 'tsx',
      },
      description: {
        story:
          'Button dropdowns work with buttons of all sizes, including default and split dropdown buttons.',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

import type { StoryObj } from '@storybook/react-vite';
import Example from './TogglerExample';
import TogglerExample from './TogglerExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      description: {
        story:
          'Navbar togglers help toggle navbar in case there is not enough space.',
      },
      source: {
        code: TogglerExample,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

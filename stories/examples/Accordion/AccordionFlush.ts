import type { StoryObj } from '@storybook/react-vite';
import Example from './AccordionFlushExample';
import code from './AccordionFlushExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      description: {
        story:
          'Add `flush` to remove the default background-color, some borders, and some rounded corners to render accordions edge-to-edge with their parent container.',
      },
      source: {
        code,
        language: 'tsx',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

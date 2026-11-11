import type { StoryObj } from '@storybook/react-vite';
import Example from './EventsExample';
import code from './EventsExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code,
        language: 'tsx',
      },
      description: {
        story: 'Track events as they happen.',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

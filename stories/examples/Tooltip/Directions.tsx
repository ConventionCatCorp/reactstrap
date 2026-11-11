import type { StoryObj } from '@storybook/react-vite';
import Example from './DirectionsExample';
import Directions from './DirectionsExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: Directions,
        language: 'tsx',
        type: 'auto',
      },
      description: {
        story:
          'Hover over the buttons below to see the four tooltips directions: top, right, bottom, and left.',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

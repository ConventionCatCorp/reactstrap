import type { StoryObj } from '@storybook/react-vite';
import Example from './DismissExample';
import code from './DismissExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      description: {
        story: 'Alerts can also be dismissed.',
      },
      source: {
        code,
        language: 'tsx',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

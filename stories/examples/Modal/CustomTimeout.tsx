import type { StoryObj } from '@storybook/react-vite';
import Example from './CustomTimeoutExample';
import CustomTimeout from './CustomTimeoutExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: CustomTimeout,
        language: 'tsx',
        type: 'auto',
      },
      description: {
        story: 'Add a custom timeout to the Modal.',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

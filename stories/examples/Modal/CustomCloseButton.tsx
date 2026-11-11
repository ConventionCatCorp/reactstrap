import type { StoryObj } from '@storybook/react-vite';
import Example from './CustomCloseButtonExample';
import CustomCloseButton from './CustomCloseButtonExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: CustomCloseButton,
        language: 'tsx',
        type: 'auto',
      },
      description: {
        story: 'Add a custom close button to the Modal.',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

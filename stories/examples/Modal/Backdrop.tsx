import type { StoryObj } from '@storybook/react-vite';
import Example from './BackdropExample';
import BackdropExample from './BackdropExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      description: {
        story:
          'When backdrop is set to static, the modal will not close when clicking outside it. Click the button below to try it.',
      },
      source: {
        code: BackdropExample,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

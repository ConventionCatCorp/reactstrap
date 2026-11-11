import type { StoryObj } from '@storybook/react-vite';
import Example from './StatefulExample';
import code from './StatefulExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      description: {
        story:
          'Combine button-like checkbox and radio toggle buttons into a seamless looking button group.',
      },
      source: {
        code,
        language: 'tsx',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

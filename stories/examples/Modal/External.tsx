import type { StoryObj } from '@storybook/react-vite';
import Example from './ExternalExample';
import External from './ExternalExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: External,
        language: 'tsx',
        type: 'auto',
      },
      description: {
        story:
          'Move the close button to the outside of the `Modal` using `external` prop.',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

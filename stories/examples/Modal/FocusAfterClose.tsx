import type { StoryObj } from '@storybook/react-vite';
import Example from './FocusAfterCloseExample';
import FocusAfterClose from './FocusAfterCloseExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: FocusAfterClose,
        language: 'tsx',
        type: 'auto',
      },
      description: {
        story:
          'The "Open" button will be focused after close when `returnFocusAfterClose` is true and will not be focused if `returnFocusAfterClose` is false.',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

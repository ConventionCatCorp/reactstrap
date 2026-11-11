import type { StoryObj } from '@storybook/react-vite';
import Example from './AutoHideExample';
import AutoHide from './AutoHideExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: AutoHide,
        language: 'tsx',
        type: 'auto',
      },
      description: {
        story:
          'Disable `autohide` to allow users to select text inside tooltip',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

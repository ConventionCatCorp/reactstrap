import type { StoryObj } from '@storybook/react-vite';
import Example from './FadelessExample';
import Fadeless from './FadelessExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: Fadeless,
        language: 'tsx',
        type: 'auto',
      },
      description: {
        story: 'Disable fade animation with `fade={false}` prop.',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

import type { StoryObj } from '@storybook/react-vite';
import Example from './CarouselExample';
import code from './CarouselExample?raw';

export default {
  render: Example,
  args: {
    dark: false,
    slide: true,
    fade: false,
  },
  parameters: {
    docs: {
      source: {
        code,
        language: 'tsx',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

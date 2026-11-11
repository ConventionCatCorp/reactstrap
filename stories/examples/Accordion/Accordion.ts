import type { StoryObj } from '@storybook/react-vite';
import Example from './AccordionExample';
import code from './AccordionExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code,
        language: 'tsx',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

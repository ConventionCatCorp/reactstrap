import type { StoryObj } from '@storybook/react-vite';
import Example from './TooltipExample';
import TooltipExample from './TooltipExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: TooltipExample,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
  args: {
    autohide: true,
    flip: true,
  },
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: ['top', 'left', 'right', 'bottom'],
    },
  },
} satisfies StoryObj<typeof Example>;

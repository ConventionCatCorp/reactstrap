import type { Meta } from '@storybook/react-vite';
import { Progress } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    docs: {
      description: {
        component:
          '[Bootstrap Progress](https://getbootstrap.com/docs/5.3/components/progress/)',
      },
    },
  },
} satisfies Meta<typeof Progress>;

export { default as Progress } from './examples/Progress/Progress';
export { default as Labels } from './examples/Progress/Labels';
export { default as Height } from './examples/Progress/Height';
export { default as Color } from './examples/Progress/Color';
export { default as Multi } from './examples/Progress/Multi';
export { default as Striped } from './examples/Progress/Striped';
export { default as Animated } from './examples/Progress/Animated';
export { default as Max } from './examples/Progress/Max';

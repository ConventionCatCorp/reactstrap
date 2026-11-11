import type { Meta } from '@storybook/react-vite';
import { Badge } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: `
[Bootstrap Badge](https://getbootstrap.com/docs/5.3/components/badge/)

A small count and labeling component.
        `,
      },
    },
  },
} satisfies Meta<typeof Badge>;

export { default as Badge } from './examples/Badge/Badge';
export { default as Headings } from './examples/Badge/Headings';
export { default as Buttons } from './examples/Badge/Button';
export { default as BackgroundColors } from './examples/Badge/Variations';
export { default as Links } from './examples/Badge/Links';
export { default as PillBadges } from './examples/Badge/Pills';

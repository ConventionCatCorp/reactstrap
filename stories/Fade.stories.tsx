import type { Meta } from '@storybook/react-vite';
import { Fade } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Fade',
  component: Fade,
} satisfies Meta<typeof Fade>;

export { default as Fade } from './examples/Fade';

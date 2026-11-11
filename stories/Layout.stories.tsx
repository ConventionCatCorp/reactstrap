import type { Meta } from '@storybook/react-vite';
import { Container, Row, Col } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Layout',
  component: Container,
  subcomponents: { Row, Col },
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap Layout](https://getbootstrap.com/docs/5.3/layout/grid/)
  
  Powerful mobile-first flexbox grid to build layouts of all shapes and sizes thanks to a twelve column system, six default responsive tiers.
  `,
      },
    },
  },
} satisfies Meta<typeof Container>;

export { default as Layout } from './examples/Layout';
export { default as LayoutRowCols } from './examples/LayoutRowCols';
export { default as ContainerResponsive } from './examples/ContainerResponsive';

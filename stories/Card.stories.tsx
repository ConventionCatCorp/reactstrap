import type { Meta } from '@storybook/react-vite';
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  CardImg,
  CardSubtitle,
  CardTitle,
  CardText,
} from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Card',
  component: Card,
  subcomponents: {
    CardBody,
    CardHeader,
    CardFooter,
    CardImg,
    CardSubtitle,
    CardTitle,
    CardText,
  },
  parameters: {
    docs: {
      description: {
        component: `
[Bootstrap Card](https://getbootstrap.com/docs/5.3/components/card/)

Cards provide a flexible and extensible content container with multiple variants and options.
        `,
      },
    },
  },
} satisfies Meta<typeof Card>;

export { default as Card } from './examples/Card/Card';
export { default as ContentTypes } from './examples/Card/ContentTypes';
export { default as ListGroups } from './examples/Card/ListGroup';
export { default as KitchenSink } from './examples/Card/KitchenSInk';
export { default as HeadersAndFooters } from './examples/Card/HeaderFooter';
export { default as Sizing } from './examples/Card/Sizing';
export { default as TextAlignment } from './examples/Card/Alignment';
export { default as ImageCaps } from './examples/Card/ImageCaps';
export { default as ImageOverlay } from './examples/Card/ImageOverlay';
export { default as Backgrounds } from './examples/Card/Backgrounds';
export { default as Border } from './examples/Card/Outline';
export { default as CardGroups } from './examples/Card/Groups';

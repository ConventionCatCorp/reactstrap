import type { Meta } from '@storybook/react-vite';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
  type CarouselProps,
} from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Carousel',
  component: Carousel,
  subcomponents: {
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
  },
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap Carousel](https://getbootstrap.com/docs/5.3/components/carousel/)
  
  A slideshow component for cycling through elements, images, or slides of text — like a carousel.
        `,
      },
    },
  },
} satisfies Meta<CarouselProps>;

export { default as Carousel } from './examples/Carousel/Carousel';
export { default as CustomTag } from './examples/Carousel/CustomTag';
export { default as Uncontrolled } from './examples/Carousel/Uncontrolled';

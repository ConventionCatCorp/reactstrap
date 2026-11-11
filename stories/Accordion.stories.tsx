import type { Meta } from '@storybook/react-vite';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Accordion',
  component: Accordion,
  subcomponents: { AccordionBody, AccordionHeader, AccordionItem },
  parameters: {
    docs: {
      description: {
        component: `
[Bootstrap Accordion](https://getbootstrap.com/docs/5.3/components/accordion/)

Used to build vertically collapsing accordions.
        `,
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export { default as Accordion } from './examples/Accordion/Accordion';
export { default as Flush } from './examples/Accordion/AccordionFlush';
export { default as Uncontrolled } from './examples/Accordion/AccordionUncontrolled';
export { default as StayOpen } from './examples/Accordion/AccordionStayOpen';

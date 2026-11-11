import type { Meta } from '@storybook/react-vite';
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/ListGroup',
  component: ListGroup,
  subcomponents: { ListGroupItem, ListGroupItemHeading, ListGroupItemText },
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap ListGroup](https://getbootstrap.com/docs/5.3/components/list-group/)
  
  A flexible and powerful component for displaying a series of content.
  `,
      },
    },
  },
} satisfies Meta<typeof ListGroup>;

export { default as ListGroup } from './examples/ListGroup/ListGroup';
export { default as Active } from './examples/ListGroup/Active';
export { default as DisabledItems } from './examples/ListGroup/DisabledItems';
export { default as LinksAndButtons } from './examples/ListGroup/LinksAndButtons';
export { default as Flush } from './examples/ListGroup/Flush';
export { default as Numbered } from './examples/ListGroup/Numbered';
export { default as Horizontal } from './examples/ListGroup/Horizontal';
export { default as ContextualClasses } from './examples/ListGroup/ContextualClasses';
export { default as Badge } from './examples/ListGroup/Badge';
export { default as CustomContent } from './examples/ListGroup/CustomContent';

import { List, ListInlineItem } from '@conventioncatcorp/reactstrap';

function Example() {
  return (
    <List type="inline">
      <ListInlineItem>Lorem ipsum</ListInlineItem>
      <ListInlineItem>Phasellus iaculis</ListInlineItem>
      <ListInlineItem>Nulla volutpat</ListInlineItem>
    </List>
  );
}

export default Example;

Example.parameters = {
  docs: {
    description: {
      story: 'Remove a list’s bullets and apply some light margin',
    },
  },
};

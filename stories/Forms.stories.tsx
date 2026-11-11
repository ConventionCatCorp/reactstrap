import type { Meta } from '@storybook/react-vite';
import {
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
} from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Forms',
  component: Form,
  subcomponents: { FormGroup, Label, Input, FormText },
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap Forms](https://getbootstrap.com/docs/5.3/forms/overview/)

  Form controls, layout options, and custom components for creating a wide variety of forms.
  `,
      },
    },
  },
} satisfies Meta<typeof Form>;

export { default as Input } from './examples/Form/Input';
export { default as Form } from './examples/Form/Form';
export { default as FormFeedback } from './examples/Form/FormFeedback';
export { default as FormGrid } from './examples/Form/FormGrid';
export { default as FormGridFormRow } from './examples/Form/FormGridFormRow';
export { default as FormInline } from './examples/Form/FormInline';
export { default as FloatingLabels } from './examples/Form/LabelFloating';
export { default as HiddenLabels } from './examples/Form/LabelHidden';
export { default as InlineCheckboxes } from './examples/Form/InlineCheckboxes';
export { default as InputGridSizing } from './examples/Form/InputGridSizing';
export { default as InputSizing } from './examples/Form/InputSizing';
export { default as InputType } from './examples/Form/InputType';
export { default as Switches } from './examples/Form/Switches';

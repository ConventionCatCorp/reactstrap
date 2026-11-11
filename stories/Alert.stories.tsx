import type { Meta } from '@storybook/react-vite';
import { Alert } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component: `
[Bootstrap Alert](https://getbootstrap.com/docs/5.3/components/alerts/)

Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages.
        `,
      },
    },
  },
} satisfies Meta<typeof Alert>;

export { default as Alert } from './examples/Alert/Alert';
export { default as Colors } from './examples/Alert/Colors';
export { default as Content } from './examples/Alert/Content';
export { default as AlertLink } from './examples/Alert/Link';
export { default as Dismiss } from './examples/Alert/Dismiss';
export { default as UncontrolledDismiss } from './examples/Alert/UncontrolledDismiss';

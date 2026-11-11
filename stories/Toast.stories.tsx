import type { Meta } from '@storybook/react-vite';
import { Toast, ToastBody, ToastHeader } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Toast',
  component: Toast,
  subcomponents: { ToastBody, ToastHeader },
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap Toasts](https://getbootstrap.com/docs/5.3/components/toasts/)
  
  Push notifications to your visitors with a Toast, a lightweight and easily customizable alert message.
  `,
      },
    },
  },
} satisfies Meta<typeof Toast>;

export { default as Toast } from './examples/Toast';
export { default as ToastDismiss } from './examples/ToastDismiss';
export { default as ToastHeaderIcon } from './examples/ToastHeaderIcon';

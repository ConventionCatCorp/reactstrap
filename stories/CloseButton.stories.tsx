import type { Meta } from '@storybook/react-vite';
import { CloseButton } from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/CloseButton',
  component: CloseButton,
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap CloseButton](https://getbootstrap.com/docs/5.3/components/close-button/)
  
  A generic close button for dismissing content like modals and alerts.
        `,
      },
    },
  },
} satisfies Meta<typeof CloseButton>;

export { default as CloseButton } from './examples/CloseButton/CloseButton';
export { default as CloseButtonDisabled } from './examples/CloseButton/Disabled';
export { default as CloseButtonWhite } from './examples/CloseButton/White';

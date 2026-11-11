import type { Meta } from '@storybook/react-vite';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@conventioncatcorp/reactstrap';

export default {
  title: 'Components/Modal',
  component: Modal,
  subcomponents: { ModalHeader, ModalBody, ModalFooter },
  parameters: {
    docs: {
      description: {
        component: `
  [Bootstrap Modal](https://getbootstrap.com/docs/5.3/components/modal/)
  
  Add dialogs to your site for lightboxes, user notifications, or completely custom content.
  `,
      },
    },
  },
} satisfies Meta<typeof Modal>;

export { default as Modal } from './examples/Modal/Modal';
export { default as Backdrop } from './examples/Modal/Backdrop';
export { default as CustomCloseButton } from './examples/Modal/CustomCloseButton';
export { default as CustomTimeout } from './examples/Modal/CustomTimeout';
export { default as Destructuring } from './examples/Modal/Destructuring';
export { default as External } from './examples/Modal/External';
export { default as Fadeless } from './examples/Modal/Fadeless';
export { default as FocusAfterClose } from './examples/Modal/FocusAfterClose';
export { default as Fullscreen } from './examples/Modal/Fullscreen';
export { default as Nested } from './examples/Modal/Nested';

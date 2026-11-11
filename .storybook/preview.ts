// oxlint-disable-next-line import/no-unassigned-import -- global Bootstrap styles
import 'bootstrap/dist/css/bootstrap.min.css';
import type { Preview } from '@storybook/react-vite';

export default {
  tags: ['autodocs'],
  parameters: {
    controls: { hideNoControlsWarning: true, matchers: { date: /Date$/ } },
    options: {
      storySort: {
        order: ['Home', ['Installation', 'GitHub', 'Upgrading', 'Themes'], '*'],
      },
    },
  },
} satisfies Preview;

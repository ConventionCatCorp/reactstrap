import type { StoryObj } from '@storybook/react-vite';
import Example from './SwitchesExample';
import SwitchesExample from './SwitchesExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      source: {
        code: SwitchesExample,
        language: 'tsx',
        type: 'auto',
      },
      description: {
        story:
          'A switch has the markup of a custom checkbox but uses the `.form-switch` class to render a toggle switch. Consider using `role="switch"` to more accurately convey the nature of the control to assistive technologies that support this role. In older assistive technologies, it will simply be announced as a regular checkbox as a fallback. Switches also support the disabled attribute.',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

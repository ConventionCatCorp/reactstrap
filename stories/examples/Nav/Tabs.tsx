import type { StoryObj } from '@storybook/react-vite';
import Example from './TabsExample';
import TabsExample from './TabsExample?raw';

export default {
  render: Example,
  parameters: {
    docs: {
      description: {
        story:
          'Takes the basic Nav from above and adds the `tabs` prop to generate a tabbed interface.',
      },
      source: {
        code: TabsExample,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
} satisfies StoryObj<typeof Example>;

import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

export default {
  framework: '@storybook/react-vite',
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  staticDirs: ['../static'],
  viteFinal(config) {
    // vite.config.ts is the library build; keep its plugins, drop lib mode.
    delete config.build?.lib;
    delete config.build?.rolldownOptions?.output;
    // Storybook's own preview/blocks bundles exceed 500 kB; docs are only served locally.
    config.build = { ...config.build, chunkSizeWarningLimit: 1500 };
    config.resolve = {
      ...config.resolve,
      alias: {
        '@conventioncatcorp/reactstrap': fileURLToPath(
          new URL('../src/index.ts', import.meta.url),
        ),
      },
    };
    return config;
  },
} satisfies StorybookConfig;

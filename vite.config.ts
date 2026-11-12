import { defineConfig } from 'vitest/config';
import pkg from './package.json' with { type: 'json' };

const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
];

export default defineConfig({
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'] },
    sourcemap: true,
    minify: false,
    rolldownOptions: {
      external: (id) =>
        external.some((d) => id === d || id.startsWith(`${d}/`)),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/__tests__/setup.ts'],
    clearMocks: true,
    include: ['src/**/*.spec.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'lcov'],
      include: ['src/**'],
      exclude: ['src/__tests__/**', 'src/testUtils.tsx'],
    },
  },
});

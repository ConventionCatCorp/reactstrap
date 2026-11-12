# AGENTS.md

Guidance for coding agents working in this repo.

## What this is

`reactstrap` v10 (fork): stateless-ish React 19 components rendering Bootstrap 5 markup. No Bootstrap JS, no jQuery.
Positioning via Floating UI (`@floating-ui/react-dom`, `useFloating` called directly; no Popper). Bootstrap 6 is out of scope (separate migration).

## Stack

- Node 26 (`.nvmrc`), npm (no yarn). TypeScript 7 (`tsc` is the native compiler, no JS API).
- Library build: Vite 8 lib mode (oxc, no Babel), ESM only, `preserveModules` → `dist/`; `.d.ts` from `tsc -p tsconfig.build.json`.
- Tests: Vitest + jsdom + Testing Library (user-event 14, async). Lint: oxlint. Format: Prettier. Docs: Storybook 10 (Vite).

## Commands

```sh
npm ci
npm test              # vitest watch
npm run test:ci       # vitest run
npm run cover         # with coverage (lcov → coveralls in CI)
npm run typecheck     # tsc, whole repo incl. tests + stories
npm run lint          # oxlint --deny-warnings
npm run format        # prettier --write .
npm run build         # dist/
npm start             # storybook on :8080
npm run build:docs    # storybook static build → build/
```

Single test: `npx vitest run src/__tests__/Modal.spec.tsx -t "should close"`.
CI (`.github/workflows/ci.yml`) runs lint, format:check, typecheck, cover, build, build:docs — keep all green.

## Layout

- `src/<Component>.tsx` — one component per file: `export interface <Component>Props` + `export default`.
- `src/index.ts` — the public barrel. Anything not exported here is internal.
- `src/utils.ts` — shared helpers and shared types (`CSSModule`, `Tag`, `Target`, `InnerRef`). Exposed as `Util`.
- `src/Transition.tsx` — internal replacement for `react-transition-group` (`Transition`, `useNodeRef`).
- `src/FloatingContent.tsx` — positioned tooltip/popover body; `DropdownMenu` floats against the toggle from `DropdownContext.reference`.
- `src/*Context.ts` — typed React contexts.
- `src/__tests__/*.spec.tsx` — Vitest specs; `typings.tsx` and `polymorphic.*.tsx` are compile-only type tests.
- `src/__tests__/setup.ts` spies `useFloating` (real implementation); assert options with `lastFloating()` / `middleware(name)` from `src/testUtils.tsx`.
- `stories/` — Storybook docs; `@conventioncatcorp/reactstrap` resolves to `src/index.ts` (tsconfig `paths` + Storybook alias).

## Conventions

- No `prop-types`, no `defaultProps` on function components (React 19 ignores them). Defaults live in destructuring.
  Class components may keep `static defaultProps`; `FloatingContent.defaultProps` is public API (apps patch `offset`).
- `data-popper-placement` / `data-bs-popper` attributes are Bootstrap 5 CSS hooks, not Popper: keep them.
- No index signatures on props. Components with `tag`: `XOwnProps` + `XProps<T = default tag> = XOwnProps &
PolymorphicExtras<XOwnProps, T>` (spell `XOwnProps` out, or Storybook docgen loses the props table);
  classes use `PolymorphicClassExtras` and `declare props: XProps<T>`. Add ok/`@ts-expect-error` cases to
  `src/__tests__/polymorphic.*.tsx`.
- `innerRef` is public API; function components render `ref={innerRef ?? ref}` so React 19 `ref` works too.
- Transitions: use `Transition` with a `nodeRef` (never `findDOMNode`). Callbacks receive `(node, isAppearing)`.
- Use `import type` for types (`verbatimModuleSyntax`). Named React imports, no `import React` unless needed.
- Class names go through `mapToCssModules(classNames(...), cssModule)`.
- Bootstrap 5 only: don't add Bootstrap 4 classes/props back.
- Commits: Conventional Commits. Releases are published locally (`npm version` + `npm publish`, see README); no CI release.

## Gotchas

- `tsc` has no JS API in TS 7: tools needing the TS compiler API (e.g. vite-plugin-dts, react-docgen-typescript) won't work.
  Declarations come from `tsc`; Storybook uses `react-docgen`.
- Fake timers + user-event: `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` and wrap timer advances in `act`.
- `npm run typecheck` covers tests and stories too — they must compile.

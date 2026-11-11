# v10 migration report

`reactstrap@9.2.3` → `@conventioncatcorp/reactstrap@10.0.0`: a TypeScript, React 19 and Bootstrap 5 renovation of the fork.
Branch: `v10`.

## TL;DR

|                 | v9.2.3                                                                                                       | v10                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Package         | `reactstrap` (npmjs)                                                                                         | `@conventioncatcorp/reactstrap` (GitHub Packages)           |
| Source          | JS + hand-written `types/`                                                                                   | 100% TypeScript, `.d.ts` generated from source              |
| Peer deps       | react / react-dom `>=16.8`                                                                                   | react / react-dom `>=19`                                    |
| Runtime deps    | 6 (`@babel/runtime`, `prop-types`, `react-popper`, `react-transition-group`, `classnames`, `@popperjs/core`) | 2 (`classnames`, `@popperjs/core`)                          |
| Output          | `lib/` (CJS) + `esm/` via Babel                                                                              | `dist/` ESM via Vite 8 (oxc), `preserveModules`, sourcemaps |
| Tests           | Jest 28, 856 tests                                                                                           | Vitest 5, 844 tests in ~6 s, 95% line coverage              |
| Lint            | ESLint 8 + airbnb + babel parser                                                                             | oxlint (`--deny-warnings`)                                  |
| Docs            | Storybook 6 + webpack 4                                                                                      | Storybook 10 + Vite                                         |
| Node (dev/CI)   | 12 / 14 / 16                                                                                                 | 26 (`.nvmrc`, `devEngines`)                                 |
| Package manager | yarn (lockfile only)                                                                                         | npm                                                         |

The test count dropped because suites for removed components were deleted (CardDeck, CardColumns, Media) and v8-era
deprecation tests went with them. New regression tests cover the React 19 bugs listed below.

## Breaking changes for consumers

1. **React 19 only.** Peer range is `>=19`. The internals rely on `ref`-as-prop and assume no `findDOMNode`.
2. **ESM only.** One `exports` entry (`.`). CJS consumers on Node ≥20.19 / 22.12 get it through `require(esm)`.
   **Deep imports are gone** (`reactstrap/lib/*`, `reactstrap/esm/*`): everything public comes from the root.
3. **Renamed** to `@conventioncatcorp/reactstrap`. To avoid touching imports, install it under an alias:
   `"reactstrap": "npm:@conventioncatcorp/reactstrap@^10"`.
4. **Removed components** (Bootstrap 4 only, they rendered classes Bootstrap 5 doesn't have):
   `CardDeck`, `CardColumns`, `Media`. Also removed: `PopperTargetHelper` (needed the react-popper v1 legacy context,
   so it was dead), the `Polyfill` export, and the `TagProps` type (it had no component behind it).
5. **Removed props**
   - Bootstrap 4 leftovers: `Row noGutters` (use `className="g-0"`), `DropdownMenu right` (use `end`).
   - Deprecated since v8: the `Input size="lg"` → `bsSize` fallback. A non-numeric `size` now reaches the DOM unchanged.
   - Typed but never implemented (removed from the types only, no runtime change): `Navbar full`, `Label disabled`,
     `Table inverse`/`reflow`, `CloseButton active`, `Carousel mouseExit` (`mouseLeave` is the real one),
     `Offcanvas contentClassName`/`offcanvasClassName`/`wrapClassName`, `Dropdown addonType`,
     `UncontrolledButtonDropdown onToggle`, `Collapse delay`/`onOpened`/`onClosed`, and the RTG v1 props on `Fade`
     (`transitionAppearTimeout` and friends).
6. **Transition callbacks** (`onEnter`, `onEntered`, `onExit` and friends on Fade, Collapse, Modal/Offcanvas transitions,
   CarouselItem) always receive `(node, isAppearing)` or `(node)`. Before, RTG dropped `node` whenever a `nodeRef` was
   set, so the first argument depended on whether you passed `innerRef`.
7. **Refs on converted components.** `Form`, `Input`, `NavLink`, `DropdownItem`, `TabContent`, `CarouselItem`,
   `UncontrolledCarousel`, `UncontrolledAlert` and `UncontrolledCollapse` are now function components:
   - A plain `ref` gets the DOM node, not a class instance.
   - `Form#submit()`, `Input#focus()` and `getRef` are gone. They were dead code: the ref was never attached.
   - `innerRef` works as before.
8. **Uncontrolled\*** components forward `ref` to the inner component.
9. **Type changes.** Types now come from the implementation, not the hand-written `types/`:
   - Narrower: `strategy` is `PositioningStrategy`, `menuRole` is `'listbox' | 'menu' | boolean`,
     `CloseButton variant` is `'white'`, Carousel item arrays are typed.
   - Wider: `delay` accepts `{ show?, hide? }`, dropdown `direction` adds `left`/`right`, targets take refs and functions
     everywhere, `Input innerRef` accepts a select element.
10. **No more `[key: string]: any`, typed polymorphic `tag`.** Every props type used to accept any prop as `any`.
    - Now each component takes its own props plus the props of whatever `tag` renders:
      `<Button tag={Link} to="/">` checks `to` against `Link`, `<Button tag="a" href target>` gets anchor attributes,
      and `<Button colour="x">` or `<Button tag={Link} too="/">` fail to compile.
    - `XProps` is generic with the real default tag (`ButtonProps<T = 'button'>`), so bare `XProps` still works.
      `XOwnProps` is exported too.
    - `href` stays an own prop on components that switch to `<a>` (Button, Badge, PaginationLink, …).
    - `ref` now reaches the DOM element on function components (`ref={innerRef ?? ref}`); `innerRef` still works.
    - **Input:** the attributes and events follow `type`. `type="select"` gives `<select>` attributes and
      `ChangeEvent<HTMLSelectElement>`, and `type="textarea"` does the same for `<textarea>`. A non-literal `type`
      (`isLong ? 'textarea' : 'text'`) gets every possible element's attributes, with events on the union of elements.
    - **Limits:**
      - `tag={SomeGenericComponent}` (e.g. `<Card tag={Button}>`) can't infer props, because TS can't instantiate a
        generic component's props.
      - Custom grid breakpoint names via `widths` need a cast.
      - `ModalHeader`/`OffcanvasHeader`/`ToastHeader` `wrapTag` stays an untyped `ElementType`.
      - `InputGroup type` only accepts `'dropdown'`; any other value was ignored at runtime anyway.

## Fixed (behaviour changes you may notice)

### React 19 bugs: the ConCat quirks

| Quirk in ConCat                                                                                      | Root cause                                                                                                                                                                | v10                                                                                                                                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vendor/reactstrapPopover.tsx`, plus the `reactstrapPopoverShim` Vite plugin and `optimizeDeps` hook | `Popover` is a function component that used `Popover.defaultProps`, which React 19 ignores, so popovers lost `offset [0,8]`, `placement`, `trigger` and `placementPrefix` | Defaults are applied inside the component. The same audit covered Tooltip, Dropdown, DropdownToggle, TooltipPopoverWrapper and every other function component. Regression tests added.                                                                                                  |
| `vendor/reactstrap-internal.d.ts`, the deep import of `reactstrap/esm/TooltipPopoverWrapper`         | Workaround for the row above                                                                                                                                              | Not needed any more. TooltipPopoverWrapper stays internal.                                                                                                                                                                                                                              |
| `types/reactstrap.d.ts` augmentation, plus `PopperContent.defaultProps.offset = [0, 5]`              | The patch only works on a class, and it had no type                                                                                                                       | `PopperContent` stays a class with a **public, typed** `static defaultProps: PopperContentDefaultProps`. The patch type-checks with no augmentation. TooltipPopoverWrapper no longer re-injects `offset`/`hideArrow`/`fade`, so patching those defaults takes effect. Covered by tests. |
| `InputMultiSelect` casting the `select` change event                                                 | `Input` types every `onChange` as `HTMLInputElement`                                                                                                                      | `type="select"` now types events as `HTMLSelectElement`; the cast can go.                                                                                                                                                                                                               |
| _(not hit in ConCat yet)_ `CarouselItem` crashes on React 19                                         | RTG `Transition` without `nodeRef` falls back to `findDOMNode`, which React 19 removed                                                                                    | Native `Transition` with a `nodeRef`. Covered by a StrictMode test.                                                                                                                                                                                                                     |
| _(latent)_ `react-popper` / `react-transition-group`                                                 | Their peer ranges stop at React 18                                                                                                                                        | Both replaced with small internal modules (`src/popper.tsx`, `src/Transition.tsx`).                                                                                                                                                                                                     |

### Other bugs fixed during the port

- **ButtonToggle:**
  - A user-supplied `onClick`/`onFocus`/`onBlur` replaced the internal handlers, so toggling and focus tracking broke.
  - The toggle used a stale closure and only ever flipped once.
  - `defaultValue` leaked to the DOM.
- **Refs that never reached the element:**
  - `Offcanvas innerRef` was swallowed.
  - `AccordionBody innerRef` was passed to Collapse as `ref` and lost.
- **Props leaking to the DOM:** `UncontrolledCollapse toggler`, `Dropdown dropup`, `UncontrolledDropdown onToggle`.
- **`cssModule` ignored or mangled:**
  - `CloseButton` ignored its `cssModule` prop.
  - `Label` pushed the `cssModule` object into its column classes, so its keys leaked out as class names.
- **UncontrolledAccordion:** with `stayOpen` and a string `defaultOpen`, it substring-matched ids and split the string
  into characters.
- **Targets:** `PopperContent` only resolved string targets. Ref and function targets now work too.
- **Keyboard:** Modal, Offcanvas and Dropdown also check `e.key`. Before, they relied on the deprecated
  `which`/`keyCode`, so key handling was dead under modern event dispatch.
- **Carousel:** `children` was required by accident (the old types had it optional). Caught by the ported type test.
- **Storybook:** the Popover/Tooltip "Update" stories called a non-existent `scheduleUpdate`.

## Tooling changes (contributors)

- **Babel is gone.** Vite 8 lib mode compiles with oxc, and `tsc -p tsconfig.build.json` emits `.d.ts` and declaration
  maps. Babel only remains as a transitive dev dependency of Storybook's `react-docgen`; it never touches our build.
- **TypeScript 7** (native `tsc`). It has no compiler JS API, so `vite-plugin-dts` and `react-docgen-typescript` are
  off the table. `tsc` emits the declarations and Storybook uses `react-docgen`.
- **Settings:** `strict`, `verbatimModuleSyntax`, `noImplicitOverride`. `npm run typecheck` covers src, tests, stories
  and config.
- **`types/` → build output.** The old dtslint/tslint suite (`types/reactstrap-tests.tsx`, about 5.4k lines of usage)
  moved to `src/__tests__/typings.tsx` as a compile-only check against the real source types.
- **Jest → Vitest.**
  - `jest.*` became `vi.*`, and user-event 13 (sync) became 14 (async, `userEvent.setup()`).
  - The root `__mocks__/react-popper.js` became `src/__mocks__/popper.tsx`.
  - `setup.ts` carries a 3-line shim so RTL detects Vitest fake timers (testing-library/react-testing-library#1197).
- **ESLint → oxlint.** Rules: correctness=error, suspicious=warn, plus the react, jsx-a11y, import, unicorn, typescript
  and vitest plugins, run with `--deny-warnings`. Every inline disable carries a reason.
- **Webpack → Vite.** Storybook 10 with `@storybook/react-vite`:
  - Config is in `.storybook/*.ts`; `*.stories.mdx` became `*.mdx`; `!!raw-loader!` became `?raw`.
  - Bootstrap 5.3 is loaded locally and docs links point to 5.3.
  - Props tables come from native autodocs.
- **CI** (`.github/workflows`):
  - `ci.yml` replaces `test.yml` + `coverage.yml`. It runs on Node from `.nvmrc`: lint → format:check → typecheck →
    cover → build → build:docs, then uploads to Coveralls.
  - `release-please.yml` runs release-please v5 in manifest mode (`release-as: 10.0.0`) and publishes to GitHub Packages
    with `GITHUB_TOKEN`.
  - `docs.yml` deploys Storybook to GitHub Pages. This replaces `scripts/docs`, which pushed to the upstream
    `reactstrap.github.io` repo.
  - Actions: checkout v7, setup-node v7, upload-pages-artifact v5, deploy-pages v5.
  - Dependabot covers npm and actions weekly, grouped.
- **Deleted:** `babel*.cjs`, `.eslintrc.json`, `.eslintignore`, `jest.config.js`, `config-overrides/` (CRA leftover),
  `scripts/`, `.prettierrc.json` (it duplicated `package.json`), `yarn.lock`, and the `types/` folder.
- **Added:** `AGENTS.md`.

## Dependencies

**Runtime:** `@popperjs/core ^2.11.8`, `classnames ^2.5.1`.

**Dev** (all current as of 2026-11-10): typescript 7.0, vite 8.3, vitest 5.1, @vitest/coverage-v8 5.1, oxlint 1.93,
prettier 3.9, storybook 10.6 (+ react-vite, addon-docs, addon-links), react / react-dom 19.3, @types/react 19.3,
@testing-library/react 16.3, user-event 14.6, jest-dom 7.0, dom 10.4, jsdom 31, bootstrap 5.3.8.

**Removed:**

- Runtime: `@babel/runtime`, `prop-types`, `react-popper`, `react-transition-group`.
- Dev: about 40 packages, including all of babel and eslint, jest, webpack, babel-loader, json-loader, microbundle,
  dtslint, customize-cra, cross-env, concurrently, conventional-changelog-cli, conventional-recommended-bump, ejs,
  holderjs, react-helmet, react-prism, react-router, and react-test-renderer.

`npm audit`: 0 vulnerabilities in production deps. There are 4 moderate dev-only advisories (glob/minimatch via
`@storybook/react-vite` → `vite-plugin-react-docgen-typescript`); they need an upstream Storybook release.

## Adopting in ConCat

1. Add `"reactstrap": "npm:@conventioncatcorp/reactstrap@^10"` to `package.json`. The registry is already configured in
   `.npmrc`, and the alias means no import churn.
2. Delete:
   - `src/frontend/vendor/reactstrapPopover.tsx`
   - `src/frontend/vendor/reactstrap-internal.d.ts`
   - `src/frontend/types/reactstrap.d.ts`
   - the `reactstrapPopoverShim` plugin and its `optimizeDeps.rolldownOptions` entry in `build/vite.config.mts`
   - the `knip.json` ignore entry
   - the `as unknown as HTMLSelectElement` cast in `InputMultiSelect`
3. Keep `PopperContent.defaultProps.offset = [0, 5]` in `src/frontend/index.tsx`. It works and is typed now.
4. **Type errors to expect.** Type-checking ConCat's frontend against the packed build gives 62 errors in 40 files:
   - **58 are select/textarea handlers typed as `ChangeEvent<HTMLInputElement>`.**
     - 38 of them come from one type: in `utils/input.tsx`, widen `EventHandlerFn` to
       `ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>`.
     - The other 20 are local handlers that need the same change.
   - **4 real bugs the old `any` hid:**
     - `oauth/authorize/components/Container.tsx`: `<Col s={12}>`. There is no `s` breakpoint, so it is a no-op and
       leaks to the DOM. Use `sm`.
     - `components/PaginationBar.tsx`: `<PaginationLink disabled>` does nothing on an `<a>`. Put `disabled` on
       `PaginationItem`.
     - `components/UniqueAttributeInput.tsx`: `<FormFeedback invalid=…>` isn't a prop; it leaks `invalid="true"` onto
       the div. Drop it (FormFeedback is invalid unless `valid`).
     - `containers/cart/utils.tsx`: `tag={cond ? Link : undefined} to={cond ? path : undefined}`. The types can't
       correlate the two props, so render the Link branch separately.
5. Expect visible changes in three places:
   - Popovers now actually use `offset [0, 8]`, the same as with the shim.
   - Fade/Collapse callbacks receive `node` first.
   - Input `size="lg"` no longer becomes a class (ConCat already uses `bsSize`).

## Open decisions / conflicts

1. **`innerRef` vs `ref`.** Both work on function components now. Deprecating `innerRef` would touch about 17 call
   sites in ConCat; I'd do that in v11.
2. **Remaining class components:**
   - Kept as typed classes: Modal, Offcanvas, Carousel, Dropdown, DropdownMenu, DropdownToggle, PopperContent,
     TooltipPopoverWrapper, UncontrolledDropdown.
   - They are the riskiest to rewrite, and `PopperContent` must stay a class for the `defaultProps` patch.
   - Converting them to hooks is a follow-up; it needs a replacement for that patch, e.g. a defaults context.
3. **GitHub Packages vs `npm.concat.app`.**
   - ConCat's `.npmrc` maps `@conventioncatcorp` to GitHub Packages, so this repo publishes there.
   - But the umzug fork's repo publishes `@concat/umzug` to `npm.concat.app`.
   - Confirm which registry is canonical.
4. **Versioning.** `package.json` stays at 9.2.3. `release-please-config.json` sets `release-as: 10.0.0`; remove that
   after the first release.
5. **Kept oddities:**
   - `CarouselControl` renders `<a role="button">` without keyboard handling; Bootstrap 5 uses a `<button>`.
   - `CarouselItem`/`CarouselCaption` don't forward extra attributes.
   - `<Button close>` drops `className`, `cssModule`, `innerRef` and `aria-label` when it forwards to CloseButton.

   Each one is a small markup change; they're left out so the port doesn't change behaviour.

## Suggested next steps

- **knip:** it would catch dead exports and files from here on, and ConCat already uses it.
- **oxfmt** could replace Prettier. It's the same toolchain as oxlint and much faster, but still 0.x, so I kept Prettier.
- **Type-aware oxlint** (`oxlint --type-aware` with tsgolint), for `no-floating-promises` and similar rules.
- **Bootstrap 6** is out of scope (alpha), as agreed; the next migration starts from these typed components.

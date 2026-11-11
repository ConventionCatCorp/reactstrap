[![reactstrap](https://cloud.githubusercontent.com/assets/399776/13906899/1de62f0c-ee9f-11e5-95c0-c515fee8e918.png)](https://reactstrap.github.io)

[![CI](https://github.com/ConventionCatCorp/reactstrap/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/ConventionCatCorp/reactstrap/actions/workflows/ci.yml) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

# @conventioncatcorp/reactstrap

Stateless React components for Bootstrap 5. A maintained fork of [reactstrap](https://github.com/reactstrap/reactstrap) (v9), published to GitHub Packages.

```ini
# .npmrc
@conventioncatcorp:registry=https://npm.pkg.github.com
```

## Getting Started

reactstrap 10 targets **React 19+** and **Bootstrap 5** and ships as ESM with bundled TypeScript types.

```sh
npm create vite@latest my-app -- --template react-ts
cd my-app
npm i @conventioncatcorp/reactstrap bootstrap
```

Import Bootstrap CSS once (e.g. `src/main.tsx`):

```ts
import 'bootstrap/dist/css/bootstrap.css';
```

Then use components:

```tsx
import { Button } from '@conventioncatcorp/reactstrap';
```

Upgrading from 9.x? See [v10-migration.md](v10-migration.md).

### Dependencies

##### Required Peer Dependencies

These libraries are not bundled with Reactstrap and required at runtime:

- [**react**](https://www.npmjs.com/package/react) `>=19`
- [**react-dom**](https://www.npmjs.com/package/react-dom) `>=19`
- [**bootstrap**](https://getbootstrap.com/docs/5.3/) 5.x CSS (not a package dependency; you load it)

## About the Project

This library contains React Bootstrap components that favor composition and control. The library does not depend on jQuery or Bootstrap javascript. However, [Popper](https://popper.js.org/) (`@popperjs/core`) is relied upon for advanced positioning of content like Tooltips, Popovers, and auto-flipping Dropdowns.

There are a few core concepts to understand in order to make the most out of this library.

1. Your content is expected to be composed via props.children rather than using named props to pass in Components.

   ```js
   // Content passed in via props
   const Example = (props) => {
     return (
       <p>
         This is a tooltip{' '}
         <TooltipTrigger tooltip={TooltipContent}>example</TooltipTrigger>!
       </p>
     );
   };

   // Content passed in as children (Preferred)
   const PreferredExample = (props) => {
     return (
       <p>
         This is a{' '}
         <a href="#" id="TooltipExample">
           tooltip
         </a>{' '}
         example.
         <Tooltip target="TooltipExample">
           <TooltipContent />
         </Tooltip>
       </p>
     );
   };
   ```

2. Attributes in this library are used to pass in state, conveniently apply modifier classes, enable advanced functionality (like tether), or automatically include non-content based elements.

   Examples:

   - `isOpen` - current state for items like dropdown, popover, tooltip
   - `toggle` - callback for toggling `isOpen` in the controlling component
   - `color` - applies color classes, ex: `<Button color="danger"/>`
   - `size` - for controlling size classes. ex: `<Button size="sm"/>`
   - `tag` - customize component output by passing in an element name or Component
   - boolean based props (attributes) when possible for alternative style classes or `visually-hidden` content

## Documentation

Storybook docs are deployed to this repo's GitHub Pages by `.github/workflows/docs.yml` (`npm start` locally).
Upstream v9 docs: https://reactstrap.github.io

## [Contributing](CONTRIBUTING.md)

## Development

Requires Node 26 (`nvm use`) and npm.

```sh
npm ci              # install
npm start           # Storybook docs at http://localhost:8080/
npm test            # Vitest watch
npm run cover       # tests + coverage
npm run lint        # oxlint
npm run typecheck   # tsc
npm run build       # dist/ (Vite lib build + tsc declarations)
```

## Releasing

Release branches/versioning/notes will be automatically created and maintained by the [release-please](https://github.com/googleapis/release-please) github action. When you're ready to publish the release, just merge the release branch. The release will be created, the package is published to GitHub Packages, and the docs are deployed to GitHub Pages.

## In the wild

Organizations and projects using `reactstrap`

- [airframe-react](https://github.com/0wczar/airframe-react) - [demo](http://dashboards.webkom.co/react/airframe/) - Airframe provides all the components a developer needs to build data-intensive web apps using React.
- [component-template](https://reactstrap.github.io/component-template/)
- [video-react](https://video-react.github.io/)
- [CoreUI-Free-Bootstrap-Admin-Template](https://github.com/mrholek/CoreUI-Free-Bootstrap-Admin-Template) - [demo](http://coreui.io/demo/React_Demo/#/)
- [Admin dashboard example app built with reactstrap](https://github.com/reduction-admin/react-reduction) - [demo](https://reduction-admin.firebaseapp.com/)
- [DevExtreme React Grid](https://devexpress.github.io/devextreme-reactive/react/grid/) - It's a stateless data grid built on top of `reactstrap` with paging, sorting, filtering, grouping, selection, editing and virtual scrolling features.
- [DevExtreme React Chart](https://devexpress.github.io/devextreme-reactive/react/chart/) - A chart built on top of `reactstrap` that visualizes data using a variety of series types, including bar, line, area, scatter, pie, and more.
- [reactstrap-scrollspy](https://github.com/keidrun/reactstrap-scrollspy/) - [demo](https://keidrun.github.io/reactstrap-scrollspy/)
- [formstrap](https://github.com/pedox/formstrap/) - [demo](https://pedox.github.io/formstrap/) - Let your `reactstrap` input component integrate seamlessly using `Formik`
- [Jimu UI](https://developers.arcgis.com/experience-builder/api-reference/jimu-ui/) - [demo](https://developers.arcgis.com/experience-builder/storybook/?path=/story/welcome--page) - The UI library for [ArcGIS Experience Builder](https://developers.arcgis.com/experience-builder/) mapping platform.

Submit a PR to add to this list!

Looking to build, document and publish reusable components built on top of `reactstrap`? Consider forking https://github.com/reactstrap/component-template to kickstart your project!

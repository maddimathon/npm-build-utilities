---
title: About
category: Documentation
children: 
  - ./CHANGELOG.md
  - ./LICENSE.md
---

<!--README_HEADER-->
# NPM Build Utilities @ 0.3.0-alpha.5
<!--/README_HEADER-->

<!--README_DESC-->
Opinionated utilities for easy build systems in npm projects.
<!--/README_DESC-->

Not meant for use in production/client-side, only during development/build.
**Unit testing is not yet properly implemented.**

This library is fairly opinionated and targeted entirely towards my personal
needs/preferences rather than to (web) developers in general.  If you want to
use it, it probably makes sense to make a wrapper package with your own
preferred configuration and utilities.


## Changelog

<!--README_DOCS_CHANGELOG-->
Read it from [the source](https://github.com/maddimathon/npm-build-utilities/blob/main/CHANGELOG.md) 
or 
[the docs site](https://maddimathon.github.io/npm-build-utilities/About/Changelog.html).
<!--/README_DOCS_CHANGELOG-->


## Install

<!--README_INSTALL-->
```bash
npm i -D @maddimathon/build-utilities@0.3.0-alpha.5
npm i -D github:maddimathon/build-utilities#0.3.0-alpha.5
```
<!--/README_INSTALL-->


## Use

For an overview of all exported items, including types, see the documentation
below.

<!--README_DOCS_CTA-->
<a href="https://maddimathon.github.io/npm-build-utilities" class="button">Read Documentation</a>
<!--/README_DOCS_CTA-->


### Exports & Entry Points

There is one main entry point (the root), plus one for types only and one for
the {@link bin} and {@link internal} modules.  It should, however, be possible
to target individual files (carefully and at your own risk, paths may change
without being considered a breaking change).

```ts
import type { ... } from '@maddimathon/build-utilities';

import { bin, internal, ... } from '@maddimathon/build-utilities';

import { ... } from '@maddimathon/build-utilities/bin';
import { ... } from '@maddimathon/build-utilities/internal';
```

A basic tsconfig to extend for npm scripts is available at
`@maddimathon/build-utilities/tsconfig`.


### Command Line

See <a href="https://maddimathon.github.io/npm-build-utilities/Using_the_Library/CLI.html">documentation</a> for details.


## Development & Coding Practices

This library is maintained by [Maddi Mathon](https://www.maddimathon.com) and is
currently unlikely to accept other contributions.

Each file that defines items/exports should limit its exports to one item and
its associated types, if applicable.  Occasionally (and judiciously), it may
make more sense to define a small number of closely-related items in the same
file.

### Directory Structure

All files required for development but ommitted from the published package
should be in `src/`.

Files compiled in order to be included in the published package should be
written to `dist/`.

Files created in order to demo the package should be written as subdirectories
in `demos/`.

Documentation should be a valid HTML static site (for use with GitHub Pages)
with a home page at `docs/index.html`.

Scripts used for development (building, publishing, testing, etc.) should be in
`.scripts/`.  Subfolders for classes, functions, and variables separate
resources from scripts meant to be run via npm.

### Naming Conventions

Long and clear is better than short and confusing.

Abstract classes should start with `Abstract` (e.g., `AbstractClass`).

Classes made only to be children of other classes should be prefixed with their
parent class (e.g., `ParentClass_[Child]`).

### Documentation

Documentation is good and helpful.  The docs website for this package is mostly
auto-generated from block comments and typing in the source.  Keeping the readme
and changelog up to date is also important.

#### TypeDoc

Documentation for the included JavaScript is generated from the TypeScript types
and block comments in the source.  Every new addition should be thoroughly
documented from the start.

To include source code in documentation, add the `@source` block tag (uses
[typedoc-plugin-inline-sources](https://www.npmjs.com/package/typedoc-plugin-inline-sources)).

### Unit Testing

Unit tests are written in the source but run after compile and minimize (via
`Build` or `Test` scripts).  Tests should be written in a file with the same path
but with `.test` added before the extension — e.g., `myFunction.ts` is tested by
`myFunction.test.ts`.

### TypeScript

Every subdirectory should have its own `index.ts` that re-exports the contents
of its files.  **Types should also be tested** using the utility types in 
[@maddimathon/utility-typescript](https://github.com/maddimathon/utility-typescript)’s
`Types.Test`.



## License

This mini-library uses the [MIT license](LICENSE.md).  Please read and
understand the license — I promise it’s short!
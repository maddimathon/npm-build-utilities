---
title: ReadMe
---

<!--README_HEADER-->
# NPM Library Template @ 1.2.1+tmpl
<!--/README_HEADER-->

<!--README_DESC-->
A template for building npm packages published on GitHub with typescript,
versioning, basic compile scripts, and template setup script.
<!--/README_DESC-->

This README includes information relevant to this template, but it’s intended to
be used as a template for the end library’s README rather than a resource about
this template.  The only exception is this paragraph and the 
[Search \& Replace](#template-setup--search--replace)
section below, which is used to set up the template. If you’re a developer who
isn’t me and wants to use this template, you probably want to fork it first and
tailor it more to your tastes and needs. **Don’t forget to review and edit this
file as you set up the template.**


## Template Setup — Search & Replace

Assume all those below are case-sensitive unless otherwise stated. Best replaced
in the order listed.

| Search                                                    | Replace                 | Notes                                         |
| :-------------------------------------------------------- | :---------------------- | :-------------------------------------------- |
| `https://github.com/maddimathon/template-npm-library.git` | *git repo url*          |                                               |
| `@maddimathon/template-npm-library`                       | *package name*          | lower-case letters, numbers, and hyphens only |
| `template-npm-library`                                    | *git repo name*         | check as you go; used in urls                 |
| `NPM Library Template`                                    | *readable package name* | title case                                    |



## Install

<!--README_INSTALL-->
```bash
npm i -D github:maddimathon/template-npm-library#1.2.1+tmpl
```
<!--/README_INSTALL-->


## Use

For an overview of all exported items, including types, see the documentation
below.

<!--README_DOCS_CTA-->
<a href="https://maddimathon.github.io/template-npm-library" class="button" target="_blank">Read Documentation</a>
<!--/README_DOCS_CTA-->


### Exports & Entry Points

There are four defined entry points, including the root, though it should be
possible to target individual files (carefully and at your own risk, paths may
change without being considered a breaking change). The root entry point exports
the other entry points as modules.

```ts
import {
    type Types,
    classes,
    functions,
} from '@maddimathon/template-npm-library';

import type { ... } from '@maddimathon/template-npm-library/types';

import { ... } from '@maddimathon/template-npm-library/classes';
import { ... } from '@maddimathon/template-npm-library/functions';
```


### Command Line

#### template-npm-library

```sh
template-npm-library [bin-function]
```


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



## LICENSE

This mini-library uses the [MIT license](LICENSE.md).  Please read and understand
the license — I promise it’s short!
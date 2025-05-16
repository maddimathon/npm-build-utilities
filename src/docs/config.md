---
title: Configuration
---

# Configuring the Library

If no [config](./use.md#universal-options) argument is passed, the library looks
for a configuration file at the following locations, in order:
- `.scripts/build.config.js`
- `build-utils.config.js`

The configuration file should export a {@link Config} object.

If not found or what's found is incomplete, the CLI will prompt for input and,
if applicable, create a config file (or encourage the user to complete the
current one).

## Using a Different Config Path

```bash
build-utils --config path/to/build.config.js
```

```ts
import { getConfig, Project } from '@maddimathon/npm-build-utilities';

const project = new Project( getConfig( 'path/to/build.config.js' ) );
```

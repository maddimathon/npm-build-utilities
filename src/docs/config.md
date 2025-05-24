---
title: Configuration
---

# Configuring the Library

If no [config](./use/cli.md#options) argument is passed, the library looks
for a configuration file at the following locations, in order:
1. `.scripts/build.config.js`
1. `build-utils.config.js`

The configuration file should export a {@link Config} object.

If not found or what's found is incomplete, the CLI will prompt for input and,
if applicable, create a config file (or encourage the user to complete the
current one).  Default values for the created config are pulled from the
package.json file (some props like name, etc. and the config object).

## Using a Different Config Path

To use a non-standard path for the config file, you must pass the config path
manually.

### CLI

```bash
build-utils --config path/to/build.config.js
```

### Javascript

[example](./config.example-1.ts)

```ts
import {
    bin,

    parseParamsCLI,
    Project,
} from '@maddimathon/npm-build-utilities';

const params = parseParamsCLI( {
    config: 'path/to/build.config.js',
} );

const project = new Project( await bin.getConfig( params ), params );
```

---
title: Javascript
---

# Use in Javascript

Generally, it'll be better to use via [command line](./cli.md), but it's
possible to use in Javascript as well, primarily through the {@link Project}
class.


## With Config File

[example](../config.example-1.ts)

```ts
import {
    cli,

    parseParamsCLI,
    Project,
} from '@maddimathon/build-utilities';

const params = parseParamsCLI( {
    config: 'path/to/build.config.js',
} );

const project = new Project( await cli.getConfig( params ), params );

await project.run( 'compile' );
```


## No Config File

[example](../config.example-2.ts)

```ts
import {
    internal,

    Project,
    ProjectConfig,
    
    parseParamsCLI,
} from '@maddimathon/build-utilities';

const config = new ProjectConfig( internal.internalConfig( {
    title: 'Example Project Title',
} ) );

const project = new Project( config, parseParamsCLI( {} ) );

await project.run( 'compile' );
```
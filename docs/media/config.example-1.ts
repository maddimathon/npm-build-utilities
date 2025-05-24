import {
    bin,

    Project,

    parseParamsCLI,
} from '@maddimathon/npm-build-utilities';

const params = parseParamsCLI( {
    config: 'path/to/build.config.js',
} );

const project = new Project( await bin.getConfig( params ), params );

await project.run( 'compile' );
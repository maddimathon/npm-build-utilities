import {
    cli,

    Project,

    parseParamsCLI,
} from '@maddimathon/build-utilities';

const params = parseParamsCLI( {
    config: 'path/to/build.config.js',
} );

const project = new Project( await cli.getConfig( params ), params );

await project.run( 'compile' );
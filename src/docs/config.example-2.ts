import {
    internal,

    Project,
    ProjectConfig,

    parseParamsCLI,
} from '@maddimathon/npm-build-utilities';

const config = new ProjectConfig( internal.internalConfig( {
    title: 'Example Project Title',
} ) );

const project = new Project( config, parseParamsCLI( {} ) );

await project.run( 'compile' );
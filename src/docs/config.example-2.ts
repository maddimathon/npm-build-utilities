import {
    type Config,
    internal,

    Project,
    ProjectConfig,

    parseParamsCLI,
} from '@maddimathon/build-utilities';

const partialConfig: Config = {
    title: 'Example Project Title',
    launchYear: '2025',
};

const config = new ProjectConfig( internal.internalConfig( partialConfig ) );

const project = new Project( config, parseParamsCLI( {} ) );

await project.run( 'compile' );
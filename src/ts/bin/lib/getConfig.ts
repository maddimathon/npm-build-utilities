/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import {
    timestamp,
} from '@maddimathon/utility-typescript/functions';

import {
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';

import type {
    CLI,
    Config,
} from '../../types/index.js';

import type { Logger } from '../../types/Logger.js';

import { getPackageJson } from '../../lib/00-universal/getPackageJson.js';

import {
    FileSystem,
    Project,
    ProjectConfig,
} from '../../lib/index.js';

import {
    isConfigValid,
    internalConfig,
} from '../../lib/@internal.js';


/**
 * Gets the configuration object for the current node package.
 *
 * Prompts the user in the terminal as needed to complete the configuration.
 *
 * @param params   Input CLI params to convert.
 * @param console  Instance used to log messages and debugging info.
 * @param level    Depth level for this message.
 * 
 * @returns  Complete config instance.
 *
 * @since 0.1.0-alpha
 * 
 * @internal
 */
export async function getConfig(
    params: CLI.Params,
    console: Logger | null = null,
    level: number = 0,
): Promise<ProjectConfig> {

    if ( !console ) {
        console = await Project.getConsole( {
            name: 'getConfig',
            params,
        } );
    }

    if ( params.debug ) {
        console.progress( '[getConfig] Debugging some info...', level );
        level++;
    }

    const defaultConfigPaths = [
        '.scripts/build.config.js',
        'build-utils.config.js',
    ];

    const pathsToCheck = [
        params.config,
        ...defaultConfigPaths,
    ];

    /** Pulled from an existing config file. */
    let config: Partial<Config> | undefined;

    /** Index of the path currently behind checked. */
    let i = 0;

    const maxInterations = pathsToCheck.length;

    const fs = new FileSystem( console );

    console.debug( 'Checking config paths...', level );

    while ( !config && i < maxInterations ) {
        let path = pathsToCheck[ i ];
        i++;

        // continues
        if ( !path ) {
            continue;
        }

        console.debug( `path #${ i.toString() }: ${ VariableInspector.stringify( { path } ) }`, 1 + level );

        path = fs.pathResolve( path );

        // continues
        if ( !fs.exists( path ) ) {
            continue;
        }

        const content = ( await import( path ) ).default;

        console.vi.debug( { content }, 2 + level );

        if ( content && typeof content === 'object' ) {
            config = content;
            console.debug( 'content approved for config', 2 + level );
        }
    }

    if ( !config ) {
        config = {};
    }

    const pkg = getPackageJson( fs );

    const validConfig = isConfigValid( config !== null && config !== void 0 ? config : {} );

    // returns
    if ( validConfig ) {
        console.vi.debug( { 'valid config': config }, 1 + level );

        const configInstance = new ProjectConfig( internalConfig( validConfig, console ) );
        console.vi.debug( { return: configInstance }, level );
        return configInstance;
    }

    // adds config from package.json as backup defaults
    config = {
        ...pkg.config,
        ...config,
    };

    console.vi.debug( { 'partial config': config }, 1 + level );

    /**
     * What to do since no valid config was found.
     */
    const noConfigPrompt = await console.nc.prompt.select( {
        message: 'No valid config file was found.  What next?',
        choices: [
            {
                name: 'Create new config file',
                value: 'create-new',
            },
            {
                name: 'Don’t create a config file and proceed',
                value: 'proceed',
                description: 'You will still be prompted for the values of required fields.',
            },
            {
                name: 'Cancel script and exit',
                value: 'cancel',
            },
        ],
        msgArgs: {
            depth: level,
            linesIn: 1,
        },
    } );

    // exits process
    if ( noConfigPrompt === 'cancel' ) {
        process.exit( 0 );
    }

    const msgArgs = {
        depth: level,
        linesIn: 0,
    };

    const currentYear = timestamp( null, {
        date: false,
        time: true,
        format: { time: { year: 'numeric' } },
    } );

    // the basic minimum object
    /**
     * Basic minimum config constructed because no valid config was found.
     */
    let newConfig: Config = {

        title: await console.nc.prompt.input( {
            message: 'What’s the project’s title? (human-readable, title case)',
            default: config.title,
            required: true,
            msgArgs,
        } ) ?? '',

        launchYear: await console.nc.prompt.input( {
            message: 'What’s the project’s launch year? (four digits)',
            default: config.launchYear ?? currentYear,
            required: true,
            msgArgs,
        } ) ?? currentYear,
    };

    let newCompleteConfig: Config.Internal | undefined = undefined;

    if ( await console.nc.prompt.bool( {
        message: 'Do you want to configure optional arguments too?',
        msgArgs,
    } ) ) {
        msgArgs.linesIn = 1;

        const defaultConfig = internalConfig( newConfig, console );

        newCompleteConfig = {
            ...defaultConfig,

            paths: {
                ...defaultConfig.paths,

                release: newConfig.paths?.release ?? await console.nc.prompt.input( {
                    message: 'What is the path for the release directory?',
                    default: defaultConfig.paths.release,
                    msgArgs,
                } ) ?? defaultConfig.paths.release,

                snapshot: newConfig.paths?.snapshot ?? await console.nc.prompt.input( {
                    message: 'What is the path for the snapshot directory?',
                    default: defaultConfig.paths.snapshot,
                    msgArgs,
                } ) ?? defaultConfig.paths.snapshot,
            },

            stages: {
                ...defaultConfig.stages,

                snapshot: newConfig.paths?.snapshot ?? (
                    defaultConfig.stages.snapshot
                    && await console.nc.prompt.bool( {
                        message: 'Include snapshot stage?',
                        default: !!defaultConfig.stages.snapshot,
                        msgArgs,
                    } )
                ) ? defaultConfig.stages.snapshot : false,
            },
        };
    }

    const builtConfig = internalConfig( newCompleteConfig ?? newConfig, console );

    const configInstance = new ProjectConfig( builtConfig );

    console.vi.debug( { return: configInstance }, level );

    // returns
    if ( noConfigPrompt !== 'create-new' ) {
        return configInstance;
    }

    /** Path for writing the config file. */
    const configPath = await console.nc.prompt.select( {
        message: 'Where should we write the config file?',
        choices: defaultConfigPaths,
        msgArgs,
    } ) ?? defaultConfigPaths[ 0 ];

    /** Whether to force-write the config file. */
    const force = fs.exists( configPath )
        ? ( await console.nc.prompt.bool( {
            message: 'Should the new config file overwrite the current file at `' + configPath + '`?',
            msgArgs,
        } ) )
        : true;

    const configFileContent = [
        `#!/usr/bin/env node`,
        `// @ts-check`,
        `'use strict';`,
        ``,
        `/**`,
        ` * @import { Config } from "@maddimathon/build-utilities"`,
        ` */`,
        ``,
        `/**`,
        ` * @type {Config}`,
        ` */`,
        'const config = ' + builtConfig.toString() + ';',
        ``,
        `export default config;`,
    ].join( '\n' );

    console.vi.debug( { configFileContent }, level );

    fs.write( configPath, configFileContent, { force } );

    return configInstance;
}
/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type { Json } from '@maddimathon/utility-typescript/types';

import { mergeArgs } from '@maddimathon/utility-typescript/functions';
import { VariableInspector } from '@maddimathon/utility-typescript/classes';

import type { CLI, Config, Stage } from '../../types/index.js';

import {
    defaultConfig,
    getFileSystem,
    getPackageJson,
    isConfigValid,

    Project,
    ProjectConfig,
} from '../../index.js';


function _internalConfig( _config: Config | Config & Partial<Config.Internal> | Config.Internal ): Config.Internal {

    const def = defaultConfig();

    const config = {
        ...def,
        ..._config,

        paths: {
            ...def.paths,
            ..._config.paths,
        },

        stages: {
            ...def.stages,
            ..._config.stages,
        },

        compiler: {
            ...def.compiler,
            ..._config.compiler ?? {},

            tsConfig: mergeArgs(
                def.compiler.tsConfig as Json.TsConfig,
                _config.compiler?.tsConfig ?? {},
                true
            ),
        },
    };


    const stages: Config.Internal[ 'stages' ] = def.stages;

    if ( config.stages ) {

        for ( const _stage in config.stages ) {
            const stage = _stage as keyof typeof config.stages;
            const stageConfig = config.stages[ stage ];

            // continues
            if ( typeof stageConfig === 'undefined' ) {
                continue;
            }

            let stageClass: Stage.ClassType | undefined = def.stages[ stage ] || undefined;
            let stageArgs: Partial<Stage.Args> | undefined = undefined;

            // continues
            if ( typeof stageConfig === 'undefined' ) {
                continue;
            }

            // continues
            if ( Array.isArray( stageConfig ) ) {

                const [ tmp_0, tmp_1 ] = stageConfig;

                if ( tmp_0 && typeof tmp_0 === 'function' ) {
                    stageClass = tmp_0;
                }

                if ( tmp_1 && typeof tmp_1 === 'object' ) {
                    stageArgs = tmp_1;
                }

                if ( stageClass ) {
                    stages[ stage ] = [ stageClass, stageArgs ];
                }
                continue;
            }

            // continues
            switch ( typeof stageConfig ) {

                case 'boolean':
                    if ( !stageConfig ) {
                        stages[ stage ] = false;
                    }
                    continue;
                    break;

                case 'object':
                    // is an args object
                    if ( stageClass ) {
                        stages[ stage ] = [ stageClass, stageConfig ];
                    }
                    continue;
                    break;

                default:
                    stages[ stage ] = stageConfig;
                    continue;
                    break;
            }
        }
    }


    const paths: Config.Internal[ 'paths' ] = {
        ...config.paths,

        dist: typeof config.paths.dist === 'function'
            ? {
                _: config.paths.dist(),
                docs: config.paths.dist( 'docs' ),
                scss: config.paths.dist( 'scss' ),
                ts: config.paths.dist( 'ts' ),
            }
            : ( typeof config.paths.dist === 'object'
                ? {
                    _: 'dist',
                    docs: 'docs',
                    scss: 'dist/scss',
                    ts: 'dist/js',

                    ...config.paths.dist,
                }
                : config.paths.dist
            ),

        src: typeof config.paths.src === 'function'
            ? {
                docs: config.paths.src( 'docs' ),
                scss: config.paths.src( 'scss' ),
                ts: config.paths.src( 'ts' ),
            }
            : {
                docs: 'src/docs',
                scss: 'src/scss',
                ts: 'src/ts',

                ...config.paths.src,
            },
    };

    return {
        ...config,

        paths,
        stages,
    };
}

/**
 * Gets the configuration object for the current node package.
 *
 * Prompts the user in the terminal as needed to complete the configuration.
 *
 * @category Config
 *
 * @since 0.1.0-draft
 *
 * @param params   Input CLI params to convert.
 * @param console  And instance of the console class to use for outputting messages.
 * @param level    Optional. Depth level for this message (above the value of {@link CLI.Params.log-base-level}).
 */
export async function getConfig(
    params: CLI.Params,
    console: Stage.Console | null,
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
    let config;

    /** Index of the path currently behind checked. */
    let i = 0;

    const maxInterations = pathsToCheck.length;

    const fs = getFileSystem( console.nc );

    params.debug && console.progress( 'Checking config paths...', level );

    while ( !config && i < maxInterations ) {
        let path = pathsToCheck[ i ];
        i++;

        // continues
        if ( !path ) {
            continue;
        }

        params.debug && console.progress( `path #${ i.toString() }: ${ VariableInspector.stringify( { path } ) }`, 1 + level );

        path = fs.pathResolve( path );

        // continues
        if ( !fs.exists( path ) ) {
            continue;
        }

        const content = ( await import( path ) ).default;

        params.debug && console.varDump.progress( { content }, 2 + level );

        if ( content && typeof content === 'object' ) {
            config = content;
            params.debug && console.progress( 'content approved for config', 2 + level );
        }
    }

    if ( !config ) {
        config = {};
    }

    const pkg = getPackageJson( {
        fs,
        nc: console.nc,
    } );

    const validConfig = isConfigValid( config !== null && config !== void 0 ? config : {} );

    // returns
    if ( validConfig ) {
        params.debug && console.varDump.progress( { 'valid config': config }, 1 + level );

        const configInstance = new ProjectConfig( _internalConfig( validConfig ) );
        params.debug && console.varDump.progress( { return: configInstance }, level );
        return configInstance;
    }

    // adds config from package.json as backup defaults
    config = {
        ...pkg.config,
        ...config,
    };

    params.debug && console.varDump.progress( { 'partial config': config }, 1 + level );

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
        } ) ?? config.title,
    };

    let newCompleteConfig: Config.Internal | undefined = undefined;

    if ( await console.nc.prompt.bool( {
        message: 'Do you want to configure optional arguments too?',
        msgArgs,
    } ) ) {
        msgArgs.linesIn = 1;

        const defaultConfig = _internalConfig( newConfig );

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

    const builtConfig = _internalConfig( newCompleteConfig ?? newConfig );

    const configInstance = new ProjectConfig( builtConfig );

    params.debug && console.varDump.progress( { return: configInstance }, level );

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
        ` * @import { Config } from "@maddimathon/npm-build-utilities"`,
        ` */`,
        ``,
        `/**`,
        ` * @type {Config}`,
        ` */`,
        'const config = ' + builtConfig.toString() + ';',
        ``,
        `export default config;`,
    ].join( '\n' );

    params.debug && console.varDump.progress( { configFileContent }, level );

    fs.writeFile( configPath, configFileContent, { force } );

    return configInstance;
}
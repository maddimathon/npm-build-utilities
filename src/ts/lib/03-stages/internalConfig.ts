/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type { Json } from '@maddimathon/utility-typescript/types';

import {
    mergeArgs,
} from '@maddimathon/utility-typescript/functions';

import {
    Config,
    Stage,
} from '../../types/index.js';

import type { Logger } from '../../types/Logger.js';

import { defaultConfig } from './defaultConfig.js';

/**
 * Takes a partial {@link Config} object and converts it to a
 * {@link Config.Internal} object.
 * 
 * @category Config
 * 
 * @internal
 */
export function internalConfig(
    _config: (
        | Config
        | Config.Internal
        | Config & Partial<Config.Internal>
    ),
    console?: Logger,
): Config.Internal {

    const def = defaultConfig( console );

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


    const stages: Config.Internal.Stages = def.stages;

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
            }
            : ( typeof config.paths.dist === 'object'
                ? {
                    ...def.paths.dist,
                    ...config.paths.dist,
                }
                : {
                    _: config.paths.dist,
                    docs: config.paths.dist.replace( /\/$/gi, '' ) + '/docs',
                    scss: config.paths.dist.replace( /\/$/gi, '' ) + '/scss',
                }
            ),

        scripts: typeof config.paths.scripts === 'string'
            ? {
                _: config.paths.scripts,
                logs: config.paths.scripts.replace( /\/$/gi, '' ) + '/logs',
            }
            : {
                _: config.paths.scripts._ ?? def.paths.scripts._,
                logs: config.paths.scripts.logs ?? def.paths.scripts.logs,
            },

        src: typeof config.paths.src === 'function'
            ? {
                _: config.paths.src(),
                docs: config.paths.src( 'docs' ),
                scss: config.paths.src( 'scss' ),
                ts: config.paths.src( 'ts' ),
            }
            : {
                ...def.paths.src,
                ...config.paths.src,
            },
    };

    return {
        ...config,

        paths,
        stages,
    };
}
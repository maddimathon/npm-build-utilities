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
    Config,
    Stage,
} from '../../types/index.js';

import type { Logger } from '../../types/Logger.js';

import { defaultConfig } from './defaultConfig.js';
import { getDefaultStageClass } from './getDefaultStageClass.js';

/**
 * Converts a single config stage to an internal config stage.
 * 
 * @hidden
 */
function _internalConfig_stage<_StageName extends Stage.Name>(
    name: _StageName,
    config?: (
        | boolean
        | Partial<Stage.Args.All[ _StageName ]>
        | Stage.Class
        | [ Stage.Class ]
        | [ Stage.Class, undefined | Partial<Stage.Args.All[ _StageName ]> ]
    ),
): Config.Internal.Stages[ _StageName ] {

    // returns - sets stage to false first
    if ( typeof config === 'undefined' || config === false ) {
        return false;
    }

    let internalStage: (
        | false
        | [ Stage.Class ]
        | [ Stage.Class, undefined | Partial<Stage.Args.All[ _StageName ]> ]
    );

    // returns - use default class
    if ( config === true ) {

        switch ( name ) {

            case 'compile':
            case 'build':
            case 'document':
            case 'package':
            case 'release':
            case 'snapshot':
            case 'test':
                internalStage = [ getDefaultStageClass( name ) ];
                return internalStage;
        }

        return false;
    }

    // returns - this is a class input
    if ( typeof config === 'function' ) {

        if ( typeof config.prototype !== 'undefined' ) {
            internalStage = [ config ];
            return internalStage;
        }

        return false;
    }

    // returns - this is a class + args input
    if ( Array.isArray( config ) ) {

        // confirms this is a class
        if (
            typeof config[ 0 ] === 'function'
            && typeof config[ 0 ].prototype !== 'undefined'
        ) {

            internalStage = config[ 1 ]
                ? [ config[ 0 ], config[ 1 ] ]
                : [ config[ 0 ] ];

            return internalStage;
        }

        return false;
    }

    const _defaultStage = getDefaultStageClass( name );

    // returns - the args were input
    if ( _defaultStage ) {
        internalStage = [ _defaultStage, config ];
        return internalStage;
    }

    return false;
}

/**
 * Takes a partial {@link Config} object and converts it to a
 * {@link Config.Internal} object.
 * 
 * @category Config
 * 
 * @param inputConfig  Partial config to complete.
 * @param console      Instance used to log messages and debugging info.
 * 
 * @return  Complete object ready for {@link ProjectConfig}.
 * 
 * @since 0.1.0-alpha
 * 
 * @internal
 */
export function internalConfig(

    inputConfig:
        | Config
        | Config.Internal
        | Config & Partial<Config.Internal>,

    console?: Logger,

): Config.Internal {

    const def = defaultConfig( console );


    const stages: Config.Internal.Stages = def.stages;

    if ( inputConfig.stages ) {

        for ( const t_stage in inputConfig.stages ) {
            const _stage = t_stage as keyof typeof stages;

            const _input = inputConfig.stages[ _stage ];

            // @ts-expect-error - confusing me 
            stages[ _stage ] = _internalConfig_stage( _stage, _input );
        }
    }


    const paths: Config.Internal[ 'paths' ] = def.paths;

    if ( inputConfig.paths ) {

        for ( const t_path in inputConfig.paths ) {
            const _path = t_path as keyof typeof inputConfig.paths;

            // continues
            if ( typeof inputConfig.paths[ _path ] === 'undefined' ) {
                continue;
            }

            switch ( _path ) {

                case 'dist':
                    switch ( typeof inputConfig.paths[ _path ] ) {

                        case 'function':
                            paths[ _path ] = {
                                _: inputConfig.paths[ _path ](),
                                docs: inputConfig.paths[ _path ]( 'docs' ),
                                scss: inputConfig.paths[ _path ]( 'scss' ),
                            };
                            break;

                        case 'string':
                            const _distDirString = inputConfig.paths[ _path ]
                                .replace( /\/$/gi, '' );

                            paths[ _path ] = {
                                _: _distDirString,
                                docs: _distDirString + '/docs',
                                scss: _distDirString + '/scss',
                            };
                            break;

                        case 'object':
                            paths[ _path ] = {
                                ...def.paths[ _path ],
                                ...inputConfig.paths[ _path ],
                            };
                            break;
                    }
                    break;

                case 'notes':
                    paths[ _path ] = {
                        ...def.paths[ _path ],
                        ...inputConfig.paths[ _path ],
                    };
                    break;

                case 'scripts':
                    switch ( typeof inputConfig.paths[ _path ] ) {

                        case 'string':
                            const _distDirString = inputConfig.paths[ _path ]
                                .replace( /\/$/gi, '' );

                            paths[ _path ] = {
                                _: _distDirString,
                                logs: _distDirString + '/logs',
                            };
                            break;

                        case 'object':
                            paths[ _path ] = {
                                ...def.paths[ _path ],
                                ...inputConfig.paths[ _path ],
                            };
                            break;
                    }
                    break;

                case 'src':
                    switch ( typeof inputConfig.paths[ _path ] ) {

                        case 'function':
                            paths[ _path ] = {
                                _: inputConfig.paths[ _path ](),
                                docs: inputConfig.paths[ _path ]( 'docs' ),
                                scss: inputConfig.paths[ _path ]( 'scss' ),
                                ts: inputConfig.paths[ _path ]( 'ts' ),
                            };
                            break;

                        case 'object':
                            paths[ _path ] = {
                                ...def.paths[ _path ],
                                ...inputConfig.paths[ _path ],
                            };
                            break;
                    }
                    break;

                default:
                    paths[ _path ] = inputConfig.paths[ _path ];
                    break;
            }
        }
    }



    return {
        ...def,
        ...inputConfig,

        paths,
        stages,

        compiler: {
            ...def.compiler,
            ...inputConfig.compiler ?? {},
        },
    };
}
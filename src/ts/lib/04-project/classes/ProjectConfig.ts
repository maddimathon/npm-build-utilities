/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type {
    Objects,
} from '@maddimathon/utility-typescript/types';

import {
    typeOf,
} from '@maddimathon/utility-typescript/functions';

import type {
    Config,
    Stage,
} from '../../../types/index.js';

import type { Logger } from '../../../types/Logger.js';

import {
    DummyConsole,
    isObjectEmpty,
} from '../../@internal/index.js';

import {
    FileSystem,
} from '../../00-universal/index.js';

// import {
// } from '../../01-config/index.js';

// import {
// } from '../../02-utils/index.js';

import {
    defaultConfig,
} from '../../03-stages/index.js';


/**
 * A super-simple class just for the configuration of the project.
 *
 * @category Config
 *
 * @since 0.1.0-alpha
 * @since 0.1.0-alpha.1 — Now implements {@link Config.Class} instead of 
 *                            {@link Config.Internal}.
 */
export class ProjectConfig implements Config.Class {



    /* STATIC
     * ====================================================================== */

    /** @hidden */
    static #default: ReturnType<typeof defaultConfig>;

    /**
     * A “local” “cache” of default config values, used primarily for
     * {@link ProjectConfig.export}.
     *
     * @since 0.1.0-alpha.1
     */
    protected static get default() {

        if ( typeof ProjectConfig.#default === 'undefined' ) {
            this.#default = defaultConfig( new DummyConsole() );
        }

        return this.#default as Config.Internal;
    }



    /* LOCAL PROPERTIES
     * ====================================================================== */

    /** {@inheritDoc Config.clr} */
    public readonly clr;

    /** {@inheritDoc Config.compiler} */
    public readonly compiler;

    /** {@inheritDoc Config.console} */
    public readonly console;

    /** {@inheritDoc Config.fs} */
    public readonly fs;

    /** {@inheritDoc Config.launchYear} */
    public readonly launchYear;

    /** {@inheritDoc Config.paths} */
    public readonly paths;

    /** {@inheritDoc Config.replace} */
    public readonly replace;

    /** {@inheritDoc Config.stages} */
    public readonly stages;

    /** {@inheritDoc Config.title} */
    public readonly title;



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * To convert a {@link Config} type to a {@link Config.Internal} type, use
     * the {@link internal.internalConfig} function.
     */
    constructor ( config: Config.Internal ) {

        this.clr = config.clr;
        this.compiler = config.compiler;
        this.console = config.console;
        this.fs = config.fs;
        this.launchYear = config.launchYear;
        this.paths = config.paths;
        this.replace = config.replace;
        this.stages = config.stages;
        this.title = config.title;

        if (
            this.stages.compile
            && Array.isArray( this.stages.compile )
        ) {

            if ( !this.stages.compile[ 1 ] ) {
                this.stages.compile[ 1 ] = {};
            }

            if (
                this.stages.compile[ 1 ].files
                && typeof this.stages.compile[ 1 ].files === 'object'
            ) {
                const totalPathCount = Object.values( this.stages.compile[ 1 ].files )
                    .map( arr => arr.length )
                    .reduce( ( runningTotal = 0, current = 0 ) => runningTotal + current );

                if ( totalPathCount < 1 ) {
                    this.stages.compile[ 1 ].files = false;
                }
            }
        }
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /** @hidden */
    #export_path<
        T_PathKey extends keyof Config.Paths
    >( key: T_PathKey ): undefined | Config.Internal.Paths[ T_PathKey ] {

        const defaults = ProjectConfig.default;

        // returns
        switch ( key ) {

            case 'dist':
                let _dist: Partial<Config.Internal.Paths[ 'dist' ]> = {};

                for ( const t_subkey in this.paths.dist ) {
                    const _subkey = t_subkey as keyof Config.Internal.Paths[ 'dist' ];

                    if ( this.paths.dist[ _subkey ] !== defaults.paths.dist[ _subkey ] ) {
                        _dist[ _subkey ] = this.paths.dist[ _subkey ];
                    }
                }

                // returns
                if ( isObjectEmpty( _dist ) ) {
                    return undefined;
                }
                return _dist as Config.Internal.Paths[ T_PathKey ];

            case 'notes':
                let _notes: Partial<Config.Internal.Paths[ 'notes' ]> = {};

                for ( const t_subkey in this.paths.notes ) {
                    const _subkey = t_subkey as keyof Config.Internal.Paths[ 'notes' ];

                    if ( this.paths.notes[ _subkey ] !== defaults.paths.notes[ _subkey ] ) {
                        _notes[ _subkey ] = this.paths.notes[ _subkey ];
                    }
                }

                // returns
                if ( isObjectEmpty( _notes ) ) {
                    return undefined;
                }
                return _notes as Config.Internal.Paths[ T_PathKey ];

            case 'scripts':
                let _scripts: Partial<Config.Internal.Paths[ 'scripts' ]> = {};

                for ( const t_subkey in this.paths.scripts ) {
                    const _subkey = t_subkey as keyof Config.Internal.Paths[ 'scripts' ];

                    if ( this.paths.scripts[ _subkey ] !== defaults.paths.scripts[ _subkey ] ) {
                        _scripts[ _subkey ] = this.paths.scripts[ _subkey ];
                    }
                }

                // returns
                if ( isObjectEmpty( _scripts ) ) {
                    return undefined;
                }
                return _scripts as Config.Internal.Paths[ T_PathKey ];

            case 'src':
                let _src: Partial<Config.Internal.Paths[ 'src' ]> = {};

                for ( const t_subkey in this.paths.src ) {
                    const _subkey = t_subkey as keyof Config.Internal.Paths[ 'src' ];

                    if ( this.paths.src[ _subkey ] !== defaults.paths.src[ _subkey ] ) {
                        // @ts-expect-error - idk
                        _src[ _subkey ] = this.paths.src[ _subkey ];
                    }
                }

                // returns
                if ( isObjectEmpty( _src ) ) {
                    return undefined;
                }
                return _src as Config.Internal.Paths[ T_PathKey ];

            // can only be a string, so should be gone already
            case 'changelog':
            case 'readme':
            case 'release':
            case 'snapshot':
                const _value_str = this.paths[ key as "changelog" | "readme" | "release" | "snapshot" ];

                // returns
                if ( typeof _value_str === 'string' ) {

                    if ( _value_str !== defaults.paths[ key ] ) {
                        return _value_str as Config.Internal.Paths[ T_PathKey ];
                    }

                    return undefined;
                }

                // just type-checking
                const _test2: string = _value_str;
                _test2;
                return undefined;

            default:
                // just type-checking
                const _test3: never = key;
                _test3;
                break;
        }

        return undefined;
    };

    public export(): Config.Default {

        const defaults = ProjectConfig.default;

        const exportObj: Objects.Classify<Config.Default> = {
            title: this.title,
            launchYear: this.launchYear,

            clr: undefined,
            compiler: undefined,
            console: undefined,
            fs: undefined,
            paths: undefined,
            stages: undefined,
        };

        // simple keys to compare to default
        for ( const _key of [
            'clr',
        ] as const ) {

            if ( this[ _key ] !== defaults[ _key ] ) {
                exportObj[ _key ] = this[ _key ];
            }
        }

        // checks that objects are NOT empty
        for ( const _key of [
            'compiler',
            'console',
            'fs',
        ] as const ) {

            if ( this[ _key ] && !isObjectEmpty( this[ _key ] ) ) {
                exportObj[ _key ] = this[ _key ];
            }
        }

        let stages: Required<Config.Default>[ 'stages' ] = {};

        for ( const t_stage in this.stages ) {
            const _stage = t_stage as Stage.Name;

            const _stageValue = this.stages[ _stage ];

            // continues
            if ( typeof _stageValue === 'boolean' ) {

                if ( _stageValue != !!defaults.stages[ _stage ] ) {
                    stages[ _stage ] = _stageValue;
                }
                continue;
            }

            // continues - args are defined
            if ( _stageValue[ 1 ] ) {

                stages[ _stage ] = isObjectEmpty( _stageValue[ 1 ] )
                    ? (
                        !!_stageValue != !!defaults.stages[ _stage ]
                            ? true
                            : undefined
                    )
                    : _stageValue[ 1 ] as Partial<Stage.Args>;
                continue;
            }

            if ( !!_stageValue != !!defaults.stages[ _stage ] ) {
                stages[ _stage ] = !!_stageValue;
            }
        }

        // checks that objects are NOT empty
        if ( !isObjectEmpty( stages ) ) {
            exportObj.stages = stages;
        }

        let paths: Required<Config.Default>[ 'paths' ] = {};

        for ( const t_key in this.paths ) {

            const _key = t_key as keyof Config.Paths;
            const _value = this.#export_path( _key );

            if ( !isObjectEmpty( _value ) ) {
                // @ts-expect-error - no clue
                paths[ _key ] = _value;
            }
        }

        // checks that objects are NOT empty
        if ( !isObjectEmpty( paths ) ) {
            exportObj.paths = paths;
        }

        return exportObj;
    }

    public getDistDir(
        fs: FileSystem,
        subDir?: Config.Paths.DistDirectory,
        ...subpaths: string[]
    ) {

        return fs.pathRelative(
            fs.pathResolve(
                this.paths.dist[ subDir ?? '_' ] ?? './',
                ...subpaths
            )
        );
    }

    public getScriptsPath(
        fs: FileSystem,
        subDir?: "logs",
        ...subpaths: string[]
    ) {

        return fs.pathRelative(
            fs.pathResolve(
                this.paths.scripts[ subDir ?? '_' ] ?? './',
                ...subpaths
            )
        );
    }

    public getSrcDir(
        fs: FileSystem,
        subDir: Config.Paths.SourceDirectory,
        ...subpaths: string[]
    ): string[];

    public getSrcDir(
        fs: FileSystem,
        subDir?: undefined,
        ...subpaths: string[]
    ): string;

    public getSrcDir(
        fs: FileSystem,
        subDir?: Config.Paths.SourceDirectory,
        ...subpaths: string[]
    ): string | string[];

    public getSrcDir(
        fs: FileSystem,
        subDir?: Config.Paths.SourceDirectory,
        ...subpaths: string[]
    ): string | string[] {

        if ( !subDir ) {

            return fs.pathRelative(
                fs.pathResolve(
                    this.paths.src._ ?? './',
                    ...subpaths
                )
            );
        }

        const result = this.paths.src[ subDir ?? '_' ] ?? [];

        return (
            Array.isArray( result ) ? result : [ result ]
        ).map( ( _path ) => fs.pathRelative(
            fs.pathResolve( _path, ...subpaths )
        ) );
    }

    public async getStage(
        stage: Stage.Name,
        console: Logger,
    ): Promise<undefined | [ Stage.Class, Partial<Stage.Args> ]> {

        const stageConfig = this.stages[ stage ];

        // returns
        if ( !stageConfig ) {
            console.debug( `no ${ stage } stage config found, skipping...`, 0, { italic: true } );
            return undefined;
        }

        let stageClass: Stage.Class | undefined;
        let stageArgs: Partial<Stage.Args> | undefined;

        if ( Array.isArray( stageConfig ) ) {

            const [
                _stageClass,
                _stageArgs,
            ] = stageConfig;

            if ( _stageClass && typeOf( _stageClass ) === 'class' ) {
                stageClass = _stageClass;
            }

            if ( _stageArgs && typeof _stageArgs === 'object' ) {
                stageArgs = _stageArgs;
            }
        } else if ( stageConfig ) {
            stageClass = stageConfig;
        }

        // returns
        if ( !stageClass ) {
            console.progress( `no valid ${ stage } stage class found, skipping...`, 0, { italic: true } );
            return undefined;
        }

        return [ stageClass, stageArgs ?? {} ];
    }

    public minimum(): Config {
        return {
            title: this.title,
            launchYear: this.launchYear,
        };
    }



    /* DEFAULT METHODS
     * ====================================================================== */

    public toJSON(): Config.Internal {

        return {
            clr: this.clr,
            compiler: this.compiler,
            console: this.console,
            fs: this.fs,
            launchYear: this.launchYear,
            paths: this.paths,
            replace: this.replace,
            stages: this.stages,
            title: this.title,
        };
    }

    public toString(): string { return JSON.stringify( this, null, 4 ); }
}
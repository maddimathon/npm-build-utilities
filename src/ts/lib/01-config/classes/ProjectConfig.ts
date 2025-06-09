/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import {
    typeOf,
} from '@maddimathon/utility-typescript/functions';

import type {
    Config,
    Stage,
} from '../../../types/index.js';

import type { Logger } from '../../../types/Logger.js';

import {
    FileSystem,
} from '../../00-universal/index.js';


/**
 * A super-simple class just for the configuration of the project.
 *
 * @category Config
 *
 * @since ___PKG_VERSION___
 */
export class ProjectConfig implements Config.Internal {


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

    /**
     * Gets a path to the {@link Config.Paths.dist} directories.
     * 
     * @param fs        Instance used to work with paths and files.
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     * 
     * @return  Relative path.
     */
    public getDistDir(
        fs: FileSystem,
        subDir?: Config.Paths.DistDirectory,
        ...subpaths: string[]
    ): string {

        return fs.pathRelative(
            fs.pathResolve(
                this.paths.dist[ subDir ?? '_' ] ?? './',
                ...subpaths
            )
        );
    }

    /**
     * Gets a path to the {@link Config.Paths.scripts} directories.
     * 
     * @param fs        Instance used to work with paths and files.
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     * 
     * @return  Relative path.
     */
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

    /**
     * Gets a path to the {@link Config.Paths.src} directories.
     * 
     * @param fs        Instance used to work with paths and files.
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     * 
     * @return  Relative path.
     */
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

    /**
     * Gets the instance for the given stage.
     *
     * @param stage  Stage to get.
     *
     * @return  An array with first the stage’s class and then the configured
     *          arguments for that class, or undefined if that class is disabled
     *          by the config.
     */
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

    /**
     * Returns the minimum required properties of this config.
     * 
     * Useful for creating stripped-down or default configuration objects.
     */
    public minimum(): Config {
        return {
            title: this.title,
            launchYear: this.launchYear,
        };
    }



    /* DEFAULT METHODS
     * ====================================================================== */

    /**
     * The object shape used when converting to JSON.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description | JSON.stringify}
     */
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

    /**
     * Overrides the default function to return a string representation of this
     * object.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString | Object.prototype.toString()}
     */
    public toString(): string { return JSON.stringify( this, null, 4 ); }

    // /**
    //  * Overrides the default function to return an object representation of this
    //  * object.
    //  *
    //  * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf | Object.prototype.valueOf()}
    //  * @see {@link ProjectConfig.toJSON | ProjectConfig.toJSON()}
    //  */
    // public valueOf() { return this.toJSON(); }
}
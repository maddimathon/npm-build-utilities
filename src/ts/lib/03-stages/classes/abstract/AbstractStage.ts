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

import type { Node } from '@maddimathon/utility-typescript/types';

import {
    mergeArgs,
    toTitleCase,
} from '@maddimathon/utility-typescript/functions';

import {
    MessageMaker,
} from '@maddimathon/utility-typescript/classes';


import type {
    CLI,
    Config,
    Stage,
} from '../../../../types/index.js';

import type { LocalError } from '../../../../types/LocalError.js';

import {
    errorHandler,
    writeLog,

    SemVer,
    logError,
} from '../../../@internal/index.js';

import {
    FileSystem,
} from '../../../00-universal/index.js';

import { getPackageJson } from '../../../00-universal/getPackageJson.js';

import {
    ProjectConfig,
} from '../../../01-config/index.js';

// import {
// } from '../../../02-utils/index.js';

import { Stage_Console } from '../../../02-utils/classes/Stage_Console.js';
import { Stage_Compiler } from '../../../02-utils/classes/Stage_Compiler.js';


/**
 * Abstract class for a single build stage, along with a variety of utilities
 * for building projects.
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 * 
 * {@include ./AbstractStage.example.md}
 */
export abstract class AbstractStage<
    SubStage extends string = string,
    Args extends Stage.Args = Stage.Args,
> implements Stage.Class<SubStage, Args> {



    /* STATIC
     * ====================================================================== */


    /* Args ===================================== */

    /**
     * Default values for {@link Stage.Args}.
     * 
     * @category Args
     */
    public static get ARGS_DEFAULT() {

        return {
            objs: {},
        } as const satisfies Stage.Args;
    }



    /* PROPERTIES
     * ====================================================================== */

    /** 
     * {@inheritDoc Stage.Class.clr}
     * 
     * @category Args
     */
    public readonly clr;

    /** 
     * {@inheritDoc Stage.Class.config}
     * 
     * @category Args
     */
    public readonly config: ProjectConfig;

    /** 
     * {@inheritDoc Stage.Class.console}
     * 
     * @category Utilities
     */
    public readonly console: Stage_Console;

    /**
     * {@inheritDoc Stage.Class.compiler}
     * 
     * @category Utilities
     */
    public readonly compiler: Stage_Compiler;

    /**
     * {@inheritDoc Stage.Class.fs}
     * 
     * @category Utilities
     */
    public readonly fs: FileSystem;

    /** 
     * {@inheritDoc Stage.Class.name} 
     * 
     * @category Args
     */
    public readonly name;

    /** 
     * {@inheritDoc Stage.Class.params}
     * 
     * @category Args
     */
    public readonly params;

    /** 
     * {@inheritDoc Stage.Class.pkg}
     * 
     * @category Project
     */
    public get pkg() {

        if ( typeof this._pkg === 'undefined' ) {
            this._pkg = this.try( getPackageJson, 1, [ this.fs ] ) as Node.PackageJson;
        }

        return {
            name: this._pkg?.name,
            version: this._pkg?.version,

            description: this._pkg?.description,
            homepage: this._pkg?.homepage,
        } as const satisfies Node.PackageJson;
    }

    /** 
     * {@inheritDoc Stage.Class.version}
     * 
     * @category Project
     */
    public get version(): SemVer {

        if ( typeof this._version === 'undefined' ) {
            this._version = new SemVer( this.pkg.version ?? '0.0.0', this.console );
        }

        return this._version;
    }

    protected set version( input: string | SemVer | undefined ) {
        if ( !input ) { return; }

        // returns
        if ( input instanceof SemVer ) {
            this._version = input;
            return;
        }

        this._version = new SemVer( input, this.console );

        if ( this._pkg ) {
            this._pkg.version = this._version.toString();
        }
    }

    /** 
     * {@inheritDoc Stage.Class.subStages}
     * 
     * @category Args
     */
    public abstract readonly subStages: SubStage[];


    /* Args ===================================== */

    /**
     * Builds a complete version of this class' args, falling back to defaults
     * as needed.
     * 
     * Uses {@link mergeArgs} recursively.
     * 
     * @category Args
     */
    public buildArgs( args?: Partial<Args> ): Args {
        return mergeArgs( this.ARGS_DEFAULT, args ?? {}, true );
    }

    /**
     * {@inheritDoc Stage.Class.args}
     * 
     * @category Args
     */
    public readonly args: Args;

    /** 
     * {@inheritDoc Stage.Class.ARGS_DEFAULT}
     * 
     * @category Args
     */
    public abstract get ARGS_DEFAULT(): Args;



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @param name    Name for this stage used for notices.
     * @param clr     Colour used for colour-coding this class.
     * @param config  Current project config.
     * @param params  Current CLI params.
     * @param args    Partial overrides for the default stage args.
     */
    public constructor (
        name: string,
        clr: MessageMaker.Colour,
        config: ProjectConfig,
        params: CLI.Params,
        args: Partial<Args>,
        protected _pkg: Node.PackageJson | undefined,
        protected _version: SemVer | undefined,
    ) {
        this.name = name;
        this.clr = clr;
        this.config = config;
        this.params = params;
        this.version = _version;

        this.console = new Stage_Console(
            this.clr,
            this.config,
            this.params,
        );

        this.args = this.buildArgs( args );

        this.fs = this.args.objs.fs ?? new FileSystem( this.console, this.config.fs );

        this.compiler = this.args.objs.compiler ?? new Stage_Compiler(
            this.config,
            this.params,
            this.console,
            this.fs,
            this.config.compiler,
        );
    }



    /* METHODS
     * ====================================================================== */

    /** {@inheritDoc Stage.Class.isDraftVersion} */
    public get isDraftVersion(): boolean {
        return !( this.params?.packaging || this.params?.releasing ) || !!this.params?.dryrun;
    }


    /* CONFIG & ARGS ===================================== */

    /** {@inheritDoc Stage.Class.isSubStageIncluded} */
    public isSubStageIncluded(
        subStage: SubStage,
        level: number,
    ): boolean {
        this.params.debug && this.console.verbose( `isSubStageIncluded( '${ subStage }' )`, level, { italic: true } );

        // returns
        if ( !( subStage in this ) || typeof this[ subStage as keyof this ] !== 'function' ) {
            return false;
        }

        // returns
        if ( !this.subStages.includes( subStage ) ) {
            return false;
        }

        this.params.debug && this.console.vi.verbose( { 'this.params.only': this.params.only }, 1 + level, { italic: true } );

        const only = {
            isUndefined: !this.params.only || !this.params.only.length,
        };

        const include: boolean = Boolean(
            only.isUndefined
            || this.params.only == subStage
            || this.params.only.includes( subStage )
        );
        this.params.debug && this.console.vi.verbose( { include }, 1 + level, { italic: true } );

        if ( this.params.debug && this.params.verbose && !include ) {

            this.console.vi.verbose( {
                include: {
                    isUndefined: only.isUndefined,
                    'this.params.only == subStage': this.params.only == subStage,
                    'this.params.only.includes( subStage )': this.params.only.includes( subStage ),
                }
            }, 2 + level, { italic: true } );
        }

        this.params.debug && this.console.vi.verbose( { 'this.params.without': this.params.without }, 1 + level, { italic: true } );

        const without = {
            isDefined: this.params.without || this.params.without.length,
        };

        const exclude: boolean = Boolean(
            without.isDefined
            && (
                this.params.without == subStage
                || this.params.without.includes( subStage )
            )
        );
        this.console.vi.debug( { exclude }, 1 + level, { italic: true } );

        if ( this.params.debug && this.params.verbose && exclude ) {

            this.console.vi.verbose( {
                exclude: {
                    isDefined: without.isDefined,
                    'this.params.without == subStage': this.params.without == subStage,
                    'this.params.without.includes( subStage )': this.params.without.includes( subStage ),
                }
            }, 2 + level, { italic: true } );
        }

        const result = Boolean(
            include
            && !exclude
            && this[ subStage as keyof typeof this ]
        );

        this.console.vi.debug( { 'isSubStageIncluded() return': result }, 1 + level, { italic: true } );

        if ( this.params.debug && this.params.verbose && !result ) {

            this.console.vi.verbose( {
                result: {
                    include,
                    exclude,
                    'this[ subStage as keyof typeof this ]': Boolean( this[ subStage as keyof typeof this ] ),
                }
            }, 2 + level, { italic: true } );
        }

        return result;
    }

    /** {@inheritDoc Stage.Class.getDistDir} */
    public getDistDir( subDir?: Config.Paths.DistDirectory ): string {
        return this.config.paths.dist[ subDir ?? '_' ];
    }

    /**
     * Gets an absolute path to the {@link Config.Paths['scripts']} directories.
     */
    public getScriptsPath( subDir?: "logs", ...subpaths: string[] ) {

        return this.fs.pathResolve(
            this.config.paths.scripts[ subDir ?? '_' ],
            ...subpaths
        );
    }

    public getSrcDir( subDir: Config.Paths.SourceDirectory ): string[];
    public getSrcDir( subDir?: undefined ): string;

    /** {@inheritDoc Stage.Class.getSrcDir} */
    public getSrcDir( subDir?: Config.Paths.SourceDirectory ): string | string[] {

        if ( !subDir ) {
            const result: string = this.config.paths.src._;
            return result;
        }

        const result = this.config.paths.src[ subDir ?? '_' ] ?? [];

        return Array.isArray( result ) ? result : [ result ];
    }

    /**
     * Alias for {@link internal.logError}.
     */
    public logError(
        logMsg: string,
        error: unknown,
        level: number,
        errMsg?: string,
        date?: Date,
    ) {

        return logError(
            logMsg,
            error,
            level,
            {
                errMsg,
                console: this.console,
                fs: this.fs,
                date,
            },
        );
    }

    /**
     * Alias for {@link internal.writeLog}.
     */
    public writeLog(
        msg: string | string[] | MessageMaker.BulkMsgs,
        filename: string,
        subDir: string[] = [],
        date: null | Date = null,
    ) {
        if ( !msg.length ) { return; }

        return writeLog(
            msg,
            filename,
            {
                config: this.config,
                date: date ?? new Date(),
                fs: this.fs,
                subDir,
            }
        );
    }


    /* ERRORS ===================================== */

    protected handleError(
        error: any,
        level: number,
        args?: Partial<LocalError.Handler.Args>,
    ): void {
        errorHandler( error, level, this.console, this.fs, args );
    }


    /**
     * @param tryer     Function to run inside the try {}.
     * @param level     Depth level for the error handler.
     * @param params    Parameters passed to the tryer function, if any.
     */
    protected try<
        Params extends never[],
        Return extends unknown,
    >(
        tryer: ( ...params: Params ) => Return,
        level: number,
        params?: Params,
    ): Return;

    protected try<
        Params extends unknown[],
        Return extends unknown,
    >(
        tryer: ( ...params: Params ) => Return,
        level: number,
        params: Params,
    ): Return;

    /**
     * Runs a function, with parameters as applicable, and catches (& handles)
     * anything thrown.
     * 
     * Overloaded for better function param typing.
     * 
     * @category Errors
     * 
     * @experimental
     */
    protected try<
        Params extends unknown[] | never[],
        Return extends unknown,
    >(
        tryer: ( ...params: Params ) => Return,
        level: number,
        params?: Params,
    ): Return {

        try {

            return tryer( ...( params ?? [] as Params ) );

        } catch ( error ) {
            this.handleError( error as LocalError.Input, level );
            throw error;
        }
    }


    /* MESSAGES ===================================== */

    /** {@inheritDoc Stage.Class.startEndNotice} */
    public startEndNotice(
        which: "start" | "end" | null,
        watcherVersion: boolean = false,
    ): void | Promise<void> {
        if ( !this.params.notice ) { return; }

        const uppercase = {
            name: this.name.toUpperCase(),
            which: which?.toUpperCase() ?? '',
        };

        const messages: {
            default: MessageMaker.BulkMsgs,
            start: MessageMaker.BulkMsgs,
            end: MessageMaker.BulkMsgs,
        } = ( watcherVersion && (
            this.params.watchedWatcher
            || this.params.watchedFilename
            || this.params.watchedEvent
        ) ) ? {
                default: [ [ '👀 ', { flag: false } ], [ `[watch-change-${ which }] file ${ this.params.watchedEvent }: ${ this.params.watchedFilename }` ] ],
                start: [ [ '🚨 ', { flag: false } ], [ `[watch-change-${ which }] file ${ this.params.watchedEvent }: ${ this.params.watchedFilename }` ] ],
                end: [ [ '✅ ', { flag: false } ], [ `[watch-change-${ which }] file ${ this.params.watchedEvent }: ${ this.params.watchedFilename }` ] ],
            } : {
                default: [ [ `${ uppercase.which }ING ${ uppercase.name }` ] ],
                start: [ [ `${ uppercase.name } ${ uppercase.which }ING...` ] ],
                end: [ [ '✓ ', { flag: false } ], [ `${ toTitleCase( this.name ) } Complete!`, { italic: true } ] ],
            };

        this.console.startOrEnd( messages[ which ?? 'default' ], which );
    }


    /* RUNNING ===================================== */

    /**
     * Runs the entire stage (asynchronously).
     *
     * This method should probably not be overwritten, except in completely
     * custom class implementations.
     *
     * Cycles through each substage and runs {@link AbstractStage.runSubStage}
     * if {@link AbstractStage.isSubStageIncluded} returns true.
     */
    public async run(): Promise<void> {

        /* start */
        await this.startEndNotice( 'start' );

        this.console.vi.debug( { subStages: this.subStages }, 1 );

        /* loop through the steps in order */
        for ( const method of this.subStages ) {

            this.params.debug && this.console.verbose( `testing method: ${ method }`, 1, { italic: true } );

            if (
                ( method in this )
                && typeof this[ method as keyof this ] === 'function'
                && this.isSubStageIncluded( method, (
                    ( this.params.debug && this.params.verbose ) ? 2 : 1
                ) )
            ) {
                await this.runSubStage( method );
            }
        }

        /* end */
        await this.startEndNotice( 'end' );
    }

    /**
     * Runs the given stage as a sub-stage to the current one.
     * 
     * **This method should probably not be overwritten.**
     * 
     * @param stage   Stage to run as a substage.
     * @param level   Depth level to add to {@link CLI.Params.log-base-level | this.params['log-base-level']}.
     */
    protected async runStage<S extends Stage.Name>(
        stage: S,
        level: number,
    ): Promise<void> {

        const _onlyKey: CLI.ParamOnlyStageKey = `only-${ stage }`;
        const _withoutKey: CLI.ParamWithoutStageKey = `without-${ stage }`;

        const _subParams: CLI.Params = {
            ...this.params,

            'log-base-level': level + this.params[ 'log-base-level' ],

            only: this.params[ _onlyKey ],
            without: this.params[ _withoutKey ],
        };

        const _subConsole = new Stage_Console( this.clr, this.config, _subParams );

        const [
            stageClass,
            stageArgs = {},
        ] = await this.config.getStage( stage, _subConsole, ) ?? [];

        // returns
        if ( !stageClass ) {
            return;
        }

        this.params.debug && this.console.vi.verbose( { _subParams }, level );

        return ( new stageClass(
            this.config,
            _subParams,
            stageArgs,
            this._pkg,
            this._version,
        ) ).run();
    }

    /**
     * Used to run a single stage within this class; used by
     * {@link AbstractStage.run}.
     */
    protected abstract runSubStage( subStage: SubStage ): Promise<void>;
}
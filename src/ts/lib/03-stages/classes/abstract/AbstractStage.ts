/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import * as sass from 'sass-embedded';

import type {
    Json,
} from '@maddimathon/utility-typescript/types';

import {
    escRegExp,
    escRegExpReplace,
    mergeArgs,
    toTitleCase,
} from '@maddimathon/utility-typescript/functions';

import {
    MessageMaker,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';


import type {
    CLI,
    Config,
    Stage,
} from '../../../../types/index.js';

import {
    errorHandler,
    writeLog,

    type AbstractError,
    SemVer,
    logError,
    StageError,
    errorStringify,
    getErrorInfo,
} from '../../../@internal/index.js';

import {
    FileSystem,
} from '../../../00-universal/index.js';

import { getPackageJson } from '../../../00-universal/getPackageJson.js';

// import {
// } from '../../../01-config/index.js';

import { Stage_Compiler } from '../../../02-utils/classes/Stage_Compiler.js';
import { Stage_Console } from '../../../02-utils/classes/Stage_Console.js';


/**
 * Abstract class for a single build stage, along with a variety of utilities
 * for building projects.
 * 
 * @category Stages
 * 
 * @typeParam T_Args      Argument object for this stage.
 * @typeParam T_SubStage  String literal of substages to run within this stage.
 * 
 * @since 0.1.0-alpha
 */
export abstract class AbstractStage<
    T_Args extends Stage.Args,
    T_SubStage extends string,
> implements Stage<T_Args, T_SubStage> {



    /* PROPERTIES
     * ====================================================================== */

    /** 
     * {@inheritDoc Stage.clr}
     * 
     * @category Config
     */
    public readonly clr;

    /** 
     * {@inheritDoc Stage.config}
     * 
     * @category Config
     */
    public readonly config: Config.Class;

    /** 
     * {@inheritDoc Stage.console}
     * 
     * @category Utilities
     */
    public readonly console: Stage_Console;

    /**
     * {@inheritDoc Stage.compiler}
     * 
     * @category Utilities
     */
    public readonly compiler: Stage_Compiler;

    /** @hidden */
    #fs: FileSystem | undefined;

    /**
     * {@inheritDoc Stage.fs}
     * 
     * @category Utilities
     */
    public get fs(): FileSystem {

        // returns
        if ( typeof this.#fs === 'undefined' ) {
            return new FileSystem( this.console, this.config.fs );
        }

        return this.#fs;
    }

    /**
     * {@inheritDoc Stage.fs}
     * 
     * @category Utilities
     */
    public set fs( fs: FileSystem | undefined ) {
        this.#fs = fs ?? new FileSystem( this.console, this.config.fs );
    }

    /** 
     * {@inheritDoc Stage.name} 
     * 
     * @category Config
     */
    public readonly name;

    /** 
     * {@inheritDoc Stage.params}
     * 
     * @category Config
     */
    public readonly params;

    /** @hidden */
    #pkg: Json.PackageJson | undefined;

    /** 
     * {@inheritDoc Stage.pkg}
     * 
     * @category Project
     */
    public get pkg() {

        if ( typeof this.#pkg === 'undefined' ) {
            this.#pkg = this.try(
                getPackageJson,
                1,
                [ this.fs ]
            ) as Json.PackageJson;
        }

        const repository = typeof this.#pkg?.repository === 'string'
            ? this.#pkg?.repository
            : this.#pkg?.repository?.url;

        return {

            name: this.#pkg?.name,
            version: this.#pkg?.version,

            description: this.#pkg?.description,
            homepage: this.#pkg?.homepage,

            config: this.#pkg?.config,

            license: this.#pkg?.license,

            repository,

            engines: this.#pkg?.engines,
            files: this.#pkg?.files,
            main: this.#pkg?.main,
            bin: this.#pkg?.bin,
            bugs: this.#pkg?.bugs,

        } as const satisfies Json.PackageJson;
    }

    /** @hidden */
    #releaseDir: string | undefined;

    /**
     * Path to release directory for building a package for the current version.
     * 
     * @category Config
     */
    public get releaseDir(): string {

        if ( this.#releaseDir === undefined ) {

            const name = this.pkg.name.replace( /^@([^\/]+)\//, '$1_' );
            const version = this.version.toString( this.isDraftVersion ).replace( /\./gi, '-' );

            this.#releaseDir = this.fs.pathRelative( this.fs.pathResolve(
                this.config.paths.release,
                `${ name }@${ version }`
            ) );
        }

        return this.#releaseDir;
    }

    /** 
     * {@inheritDoc Stage.subStages}
     * 
     * @category Running
     */
    public abstract readonly subStages: T_SubStage[];

    /** @hidden */
    #version: SemVer | undefined;

    /** 
     * {@inheritDoc Stage.version}
     * 
     * @category Project
     */
    public get version(): SemVer {

        if ( typeof this.#version === 'undefined' ) {

            try {

                this.console.vi.debug( { 'SemVer input': this.pkg.version ?? '0.0.0' }, 1 );
                this.#version = new SemVer( this.pkg.version ?? '0.0.0', this.console );

            } catch ( error ) {

                error = new StageError(
                    'Error while constructing SemVer',
                    {
                        class: 'AbstractStage',
                        method: 'get version',
                        file: 'src/ts/lib/03-stages/classes/abstract/AbstractStage.ts',
                    },
                    { cause: error }
                );

                this.handleError( error, 1 );

                throw error;
            }
        }

        return this.#version;
    }

    /**
     * If undefined, nothing is set.  Otherwise, a {@link SemVer} is created and
     * the value of {@link AbstractStage.pkg}.version is updated.
     */
    protected set version( input: string | SemVer | undefined ) {
        if ( !input ) { return; }

        // returns
        if ( input instanceof SemVer ) {
            this.#version = input;
            return;
        }

        try {

            this.console.vi.debug( { 'SemVer input': this.pkg.version ?? '0.0.0' }, 1 );
            this.#version = new SemVer( input, this.console );

        } catch ( error ) {

            error = new StageError(
                'Error while constructing SemVer',
                {
                    class: 'AbstractStage',
                    method: 'set version',
                    file: 'src/ts/lib/03-stages/classes/abstract/AbstractStage.ts',
                },
                { cause: error }
            );

            this.handleError( error, 1 );

            throw error;
        }

        if ( this.#pkg ) {
            this.#pkg.version = this.#version.toString();
        }
    }


    /* Args ===================================== */

    /**
     * Builds a complete version of this class' args, falling back to defaults
     * as needed.
     * 
     * Uses {@link mergeArgs} recursively.
     * 
     * @category Config
     */
    public buildArgs( args?: Partial<T_Args> ): T_Args {
        return mergeArgs( this.ARGS_DEFAULT, args ?? {}, true );
    }

    /**
     * {@inheritDoc Stage.args}
     * 
     * @category Config
     */
    public readonly args: T_Args;

    /** 
     * {@inheritDoc Stage.ARGS_DEFAULT}
     * 
     * @category Config
     */
    public abstract get ARGS_DEFAULT(): T_Args;



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @category Constructor
     * 
     * @param name     Name for this stage used for notices.
     * @param clr      Colour used for colour-coding this class.
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param args     Partial overrides for the default stage args.
     * @param pkg      Parsed contents of the project’s package.json file.
     * @param version  Version object for the project’s version.
     */
    public constructor (
        name: string,
        clr: MessageMaker.Colour,
        config: Config.Class,
        params: CLI.Params,
        args: Partial<T_Args>,
        pkg: Json.PackageJson | undefined,
        version: SemVer | undefined,
    ) {
        this.#pkg = pkg;
        this.name = name;
        this.clr = clr;
        this.config = config;
        this.params = params;
        this.version = version;

        this.console = new Stage_Console(
            this.clr,
            this.config,
            this.params,
        );

        this.args = this.buildArgs( args );

        this.fs = this.args.utils.fs;

        this.compiler = this.args.utils.compiler ?? new Stage_Compiler(
            this.config,
            this.params,
            this.console,
            this.fs,
        );

        this.uncaughtErrorListener = this.uncaughtErrorListener.bind( this );
    }



    /* METHODS
     * ====================================================================== */

    /** {@inheritDoc Stage.isDraftVersion} */
    public get isDraftVersion(): boolean {
        return !( this.params?.packaging || this.params?.releasing ) || !!this.params?.dryrun;
    }

    /**
     * Whether the current run is the result of a watched change.
     * 
     * @since 0.3.0-alpha.1
     */
    public get isWatchedUpdate(): boolean {

        return Boolean(
            !( this.params?.packaging || this.params?.releasing )
            && (
                this.params.watchedWatcher
                || this.params.watchedFilename
                || this.params.watchedEvent
            )
        );
    }

    /**
     * Default scss options according to config & params.
     * 
     * @since 0.3.0-alpha.1
     */
    public get sassOpts(): Stage.Compiler.Args.Sass {
        return {
            isWatchedUpdate: this.isWatchedUpdate,
        };
    }

    /**
     * Replaces placeholders in files as defined by {@link Config.replace}.
     * 
     * @category Utilities
     * 
     * @param globs     Where to find & replace placeholders.
     * @param version   Which version of the replacements to run.
     * @param level     Depth level for output to the console.
     * @param ignore    Globs to ignore while replacing. Default {@link FileSystem.globs.SYSTEM}.
     * @param docsMode  Whether to make the replacements in 'docs' mode (i.e., 
     *                  assumes markdown in comments was converted to HTML).
     * 
     * @return  Paths where placeholders were replaced.
     */
    public replaceInFiles(
        globs: string[],
        version: "current" | "package",
        level: number,
        ignore: string[] = [],
        docsMode: boolean = false,
    ): string[] {

        let replacements = typeof this.config.replace === 'function'
            ? this.config.replace( this )[ version ]
            : this.config.replace[ version ];

        // returns
        if ( !replacements ) {
            return [];
        }

        this.console.verbose( `making ${ version } replacements...`, level );

        if ( docsMode ) {
            this.console.verbose( `running in docs mode`, 1 + level );

            replacements = replacements.map( ( [ _find, _repl ] ) => {

                // returns
                if ( typeof _find !== 'string' ) {

                    const _findString = _find.toString().replace( /(^\/|\/[a-z]+$)/g, '' );

                    // returns
                    if ( _findString.match( /^___[^\s]+___$/g ) === null ) {
                        return [ _find, _repl ];
                    }

                    const _findHTML = '<em><strong>'
                        + _findString.replace( /(^___|___$)/g, '' )
                        + '<\\/strong><\\/em>';

                    const _regex = new RegExp(
                        `(${ _findString }|${ _findHTML })`,
                        _find.toString().match(
                            /(^\/|(?<=\/)([a-z]+)$)/g
                        )?.[ 1 ] || 'g'
                    );

                    return [ _regex, _repl ];
                }

                // returns
                if ( _find.match( /^___[^\s]+___$/g ) === null ) {
                    return [ _find, _repl ];
                }

                const _findHTML = '<em><strong>'
                    + _find.replace( /(^___|___$)/g, '' )
                    + '</strong></em>';

                const _regex = new RegExp(
                    `(${ escRegExp( _find ) }|${ escRegExp( _findHTML ) })`,
                    'g'
                );

                return [ _regex, _repl ];
            } );
        }

        const replaced = this.fs.replaceInFiles(
            globs,
            replacements,
            ( this.params.verbose ? 1 : 0 ) + level,
            {
                ignore: ignore ?? FileSystem.globs.SYSTEM,
            },
        );

        this.console.verbose(
            `replaced ${ version } placeholders in ${ replaced.length } files`,
            1 + level,
            { italic: true },
        );

        return replaced;
    }

    /**
     * Alias for {@link internal.writeLog}.
     * 
     * @category Errors
     * 
     * @param msg       Log message to write.
     * @param filename  File name for the log.
     * @param subDir    Subdirectories used for the path to write the log file.
     * @param date      Used for the timestamp.
     * 
     * @return  If false, writing the log failed. Otherwise, this is the path to
     *          the written log file.
     */
    public writeLog(
        msg: string | string[] | MessageMaker.BulkMsgs,
        filename: string,
        subDir: string[] = [],
        date: null | Date = null,
    ) {
        if ( !msg.length ) { return false; }

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


    /* CONFIG & ARGS ===================================== */

    /** 
     * {@inheritDoc Stage.isSubStageIncluded}
     * 
     * @category Config
     */
    public isSubStageIncluded(
        subStage: T_SubStage,
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

    /** 
     * {@inheritDoc Stage.getDistDir}
     * 
     * @category Config
     */
    public getDistDir(
        subDir?: Config.Paths.DistDirectory,
        ...subpaths: string[]
    ): string {
        return this.config.getDistDir( this.fs, subDir, ...( subpaths ?? [] ) );
    }

    /** 
     * {@inheritDoc Stage.getScriptsPath}
     * 
     * @category Config
     */
    public getScriptsPath(
        subDir?: "logs",
        ...subpaths: string[]
    ) {
        return this.config.getScriptsPath( this.fs, subDir, ...( subpaths ?? [] ) );
    }

    public getSrcDir(
        subDir: Config.Paths.SourceDirectory,
        ...subpaths: string[]
    ): string[];

    public getSrcDir(
        subDir?: undefined,
        ...subpaths: string[]
    ): string;

    /** 
     * {@inheritDoc Stage.getSrcDir}
     * 
     * @category Config
     */
    public getSrcDir(
        subDir?: undefined | Config.Paths.SourceDirectory,
        ...subpaths: string[]
    ): string | string[] {
        return this.config.getSrcDir( this.fs, subDir, ...( subpaths ?? [] ) );
    }


    /* ERRORS ===================================== */

    /**
     * Alias for {@link errorHandler}.
     * 
     * @category Errors
     * 
     * @param error    Error to handle.
     * @param level    Depth level for output to the console.
     * @param args     Overrides for default options.
     */
    protected handleError(
        error: any,
        level: number,
        args?: Partial<AbstractError.Handler.Args>,
    ) {
        return errorHandler(
            error,
            level,
            this.console,
            this.fs,
            args,
        );
    }

    /**
     * Alias for {@link internal.logError}.
     * 
     * @category Errors
     * 
     * @param logMsg  Message to prepend to the return for output to the console.
     * @param error   Caught error to log.
     * @param level   Depth level for output to the console.
     * @param errMsg  See {@link logError.Args.errMsg}.
     * @param date    Used for the timestamp.
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
     * Handles uncaught errors in node.
     * 
     * @param error  To handle.
     * 
     * @since 0.2.0-alpha
     */
    public uncaughtErrorListener( error: unknown ) {
        this.handleError( error as AbstractError.Input, 1 );
    }

    /**
     * Handles errors thrown during sass compile.
     * 
     * @since 0.3.0-alpha.3
     */
    protected sassErrorHandler(
        error: any,
        level: number,
        opts: Stage.Compiler.Args.Sass,
        args?: Partial<AbstractError.Handler.Args>,
    ): string[] {

        const msgs: MessageMaker.BulkMsgs = [];

        if ( typeof error == 'object' ) {

            const errArgs = { exitProcess: false };
            const [ typedError, errInfo ] = getErrorInfo( error, level, this.console, this.fs, errArgs );

            const isSassError = 'sassStack' in error || 'sassMessage' in error;

            if ( isSassError ) {

                const _typedError = typedError as ( typeof typedError ) & {
                    sassMessage?: string;
                    sassStack?: string;
                    span?: sass.SourceSpan;
                };

                const fullMessage = this.compiler.sassErrorStackFilter(
                    String( _typedError.message ).trim().replace( /^\s*(Error:\s*)+\s+/gi, '' ),
                    opts,
                ).join( '\n' ).trim();

                const shortMessage = _typedError.sassMessage?.trim().replace(
                    /^\s*(Error:\s*)+\s+/gs,
                    ''
                ) ?? '';

                const shortMessage_regex = shortMessage.split( /\n+/ ).map(
                    line => escRegExp( line )
                ).join( '[\\n\\s]*' );

                const messageDetails = fullMessage.replace(
                    new RegExp(
                        `^\s*((Error:\s*)*\s+)?\s*(${ shortMessage_regex })?`,
                        'gs'
                    ),
                    ''
                ).replace(
                    /^\s*(\\x1b\[[\d;:]+m\s*)*/gs,
                    ''
                ).trim();

                msgs.push(
                    [ `[Sass: Error] ${ shortMessage }`, { bold: true, italic: false } ],
                    [ messageDetails, { bold: false, italic: false } ],
                    ...errorStringify.cause( error, errInfo, level, this.console, this.fs, errArgs ),
                    ...errorStringify.output( error, errInfo, level, this.console, this.fs, errArgs ),
                );

                if ( error.stack ) {

                    let _rawStack = String( error.stack );

                    if ( error.message ) {
                        _rawStack = _rawStack.replace(
                            new RegExp(
                                `^\s*(Error: )*\s*${ escRegExp( error.message ) }`,
                                'g'
                            ),
                            ''
                        );
                    }

                    msgs.push( [
                        '\n' + this.compiler.sassErrorStackFilter( _rawStack, opts ).join( '\n' ),
                        {
                            bold: false,
                            italic: true,
                            maxWidth: null,
                        }
                    ] );
                }

                if ( this.params.debug ) {
                    msgs.push(
                        ...errorStringify.details( error, errInfo, level, this.console, this.fs, errArgs ),
                        ...errorStringify.dump( error, errInfo, level, this.console, this.fs, errArgs ),
                    );
                }

            } else if ( error instanceof Error ) {

                msgs.push(
                    ...errorStringify.message( error, errInfo, level, this.console, this.fs, errArgs ),
                    ...errorStringify.output( error, errInfo, level, this.console, this.fs, errArgs ),
                    ...errorStringify.cause( error, errInfo, level, this.console, this.fs, errArgs ),
                    ...errorStringify.stack( error, errInfo, level, this.console, this.fs, errArgs ),
                    ...errorStringify.details( error, errInfo, level, this.console, this.fs, errArgs ),
                );
            } else {
                msgs.push( [ VariableInspector.stringify( { error } ) ] );
            }
        } else {
            msgs.push( [ VariableInspector.stringify( { error } ) ] );
        }

        this.console.warn( msgs, level, {
            bold: true,
            clr: 'red',
            italic: false,

            linesIn: 1,
            linesOut: 1,

            ...args ?? {},

            joiner: '\n',
        } );

        // exits
        if ( this.params.packaging || this.params.releasing ) {
            process.exit();
        }
        process.exitCode = 0;

        return [];
    }


    /**
     * If the `tryer` function has no params, then they are optional.
     * 
     * If the handler must exit, then 'FAILED' is not possible.
     * 
     * @param tryer     Function to run inside the try {}.
     * @param level     Depth level for the error handler.
     * @param params    Parameters passed to the tryer function, if any.
     * 
     * @return  The `tryer` function’s return, or 'FAILED' if an error is caught
     *          and the process isn’t exited.
     */
    protected try<
        T_Params extends never[],
        T_Return extends unknown,
    >(
        tryer: () => T_Return,
        level: number,
        params?: NoInfer<T_Params>,
        handlerArgs?: Partial<AbstractError.Handler.Args> & { exitProcess?: false; },
    ): T_Return;

    /**
     * If the `tryer` function *has* params, then they are required.
     * 
     * If the handler must exit, then 'FAILED' is not possible.
     */
    protected try<
        T_Params extends unknown[],
        T_Return extends unknown,
    >(
        tryer: ( ...params: T_Params ) => T_Return,
        level: number,
        params: NoInfer<T_Params>,
        handlerArgs?: Partial<AbstractError.Handler.Args> & { exitProcess?: false; },
    ): T_Return;

    /**
     * If the `tryer` function has no params, then they are optional.
     * 
     * If the handler won't exit, then 'FAILED' is possible.
     */
    protected try<
        T_Params extends never[],
        T_Return extends unknown,
    >(
        tryer: () => T_Return,
        level: number,
        params: NoInfer<T_Params> | undefined,
        handlerArgs: Partial<AbstractError.Handler.Args> & { exitProcess: true | boolean; },
    ): T_Return | "FAILED";

    /**
     * If the `tryer` function *has* params, then they are required.
     */
    protected try<
        T_Params extends unknown[],
        T_Return extends unknown,
    >(
        tryer: ( ...params: T_Params ) => T_Return,
        level: number,
        params: NoInfer<T_Params>,
        handlerArgs: Partial<AbstractError.Handler.Args> & { exitProcess: true | boolean; },
    ): T_Return | "FAILED";

    /**
     * Runs a function, with parameters as applicable, and catches (& handles)
     * anything thrown.
     * 
     * For the asynchronous method, see {@link AbstractStage.atry}.
     *
     * Overloaded for better function param typing.
     *
     * @category Errors
     *
     * @experimental
     */
    protected try<
        T_Params extends unknown[] | never[],
        T_Return extends unknown,
    >(
        tryer: ( ...params: T_Params ) => T_Return,
        level: number,
        params?: NoInfer<T_Params>,
        handlerArgs?: Partial<AbstractError.Handler.Args>,
    ): T_Return | "FAILED" {

        try {

            return tryer( ...( params ?? [] as T_Params ) );

        } catch ( error ) {

            this.handleError(
                error,
                level,
                handlerArgs,
            );

            return 'FAILED';
        }
    }


    /**
     * If the `tryer` function has no params, then they are optional.
     * 
     * If the handler must exit, then 'FAILED' is not possible.
     * 
     * @param tryer     Function to run inside the try {}.
     * @param level     Depth level for the error handler.
     * @param params    Parameters passed to the tryer function, if any.
     * 
     * @return  The `tryer` function’s return, or 'FAILED' if an error is caught
     *          and the process isn’t exited.
     */
    protected async atry<
        T_Params extends never[],
        T_Return extends unknown,
    >(
        tryer: () => T_Return | Promise<T_Return>,
        level: number,
        params?: NoInfer<T_Params>,
        handlerArgs?: Partial<AbstractError.Handler.Args> & { exitProcess?: false; },
    ): Promise<T_Return>;

    /**
     * If the `tryer` function *has* params, then they are required.
     * 
     * If the handler must exit, then 'FAILED' is not possible.
     */
    protected async atry<
        T_Params extends unknown[],
        T_Return extends unknown,
    >(
        tryer: ( ...params: T_Params ) => T_Return | Promise<T_Return>,
        level: number,
        params: NoInfer<T_Params>,
        handlerArgs?: Partial<AbstractError.Handler.Args> & { exitProcess?: false; },
    ): Promise<T_Return>;

    /**
     * If the `tryer` function has no params, then they are optional.
     * 
     * If the handler won't exit, then 'FAILED' is possible.
     */
    protected async atry<
        T_Params extends never[],
        T_Return extends unknown,
    >(
        tryer: () => T_Return | Promise<T_Return>,
        level: number,
        params: NoInfer<T_Params> | undefined,
        handlerArgs: Partial<AbstractError.Handler.Args> & { exitProcess: true | boolean; },
    ): Promise<T_Return | "FAILED">;

    /**
     * If the `tryer` function *has* params, then they are required.
     */
    protected async atry<
        T_Params extends unknown[],
        T_Return extends unknown,
    >(
        tryer: ( ...params: T_Params ) => T_Return | Promise<T_Return>,
        level: number,
        params: NoInfer<T_Params>,
        handlerArgs: Partial<AbstractError.Handler.Args> & { exitProcess: true | boolean; },
    ): Promise<T_Return | "FAILED">;

    /**
     * Runs a function (asynchronously), with parameters as applicable, and
     * catches (& handles) anything thrown.
     * 
     * For the synchronous method, see {@link AbstractStage.try}.
     *
     * Overloaded for better function param typing.
     *
     * @category Errors
     *
     * @experimental
     */
    protected async atry<
        T_Params extends unknown[] | never[],
        T_Return extends unknown,
    >(
        tryer: ( ...params: T_Params ) => T_Return | Promise<T_Return>,
        level: number,
        params?: NoInfer<T_Params>,
        handlerArgs?: Partial<AbstractError.Handler.Args>,
    ): Promise<T_Return | "FAILED"> {

        return Promise.resolve(
            tryer( ...( params ?? [] as T_Params ) )
        ).catch( ( error ) => {

            this.handleError(
                error,
                level,
                handlerArgs,
            );

            return 'FAILED';
        } );
    }


    /* MESSAGES ===================================== */

    /** 
     * {@inheritDoc Stage.startEndNotice}
     * 
     * @category Running
     */
    public startEndNotice(
        which: "start" | "end" | null,
        watcherVersion: boolean = false,
    ): void | Promise<void> {
        watcherVersion = watcherVersion && this.isWatchedUpdate;

        const uppercase = {
            name: this.name.toUpperCase(),
            which: which?.toUpperCase() ?? '',
        };

        const watchFileName = () => {

            let msg = '';

            if ( this.params.watchedEvent ) {
                msg += ` ${ this.params.watchedEvent }`;

                if ( this.params.watchedFilename ) {
                    msg += `: ${ this.params.watchedFilename }`;
                }
            } else if ( this.params.watchedFilename ) {
                msg += ` ${ this.params.watchedFilename }`;
            }

            return msg;
        };

        const watchFileNameMsg = watcherVersion && watchFileName();

        const messages: {
            default: MessageMaker.BulkMsgs,
            start: MessageMaker.BulkMsgs,
            end: MessageMaker.BulkMsgs,
        } = watcherVersion
                ? {
                    default: [ [ '👀 ', { flag: false } ], [ `[watch-change-${ which }] ${ watchFileNameMsg || '' }` ] ],
                    start: [ [ '🚨 ', { flag: false } ], [ `[watch-change-${ which }] ${ watchFileNameMsg || '' }` ] ],
                    end: [ [ '✅ ', { flag: false } ], [ `[watch-change-${ which }] ${ watchFileNameMsg || '' }` ] ],
                }
                : {
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
     * 
     * @category Running
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
     * @param stage  Stage to run as a substage.
     * @param level  Depth level for output to the console.
     * 
     * @category Running
     * 
     * @since 0.3.0-alpha.10 — Added option to run a custom stage class.
     */
    protected async runStage(
        stageInput: Stage.Name | [ string, Stage.Class ],
        level: number,
    ): Promise<void> {

        const [
            stage,
            stageClassCustom,
        ] = typeof stageInput === 'string'
                ? [ stageInput ]
                : stageInput;

        const _onlyKey: `only-${ Stage.Name }` = `only-${ stage as Stage.Name }`;
        const _withoutKey: `without-${ Stage.Name }` = `without-${ stage as Stage.Name }`;

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
        ] = stageClassCustom
                ? [ stageClassCustom ]
                : ( await this.config.getStage(
                    stage as Stage.Name,
                    _subConsole,
                ) ?? [] );

        // returns
        if ( !stageClass ) {
            return;
        }

        if ( stageArgs.utils?.compiler ) {
            stageArgs.utils.compiler = undefined;
        }

        if ( stageArgs.utils?.fs ) {
            stageArgs.utils.fs = undefined;
        }

        this.params.debug && this.console.vi.verbose( { _subParams }, level );

        return ( new stageClass(
            this.config,
            _subParams,
            stageArgs,
            this.#pkg,
            this.#version,
        ) ).run();
    }

    /**
     * Used to run a single stage within this class; used by
     * {@link AbstractStage.run}.
     * 
     * @category Running
     */
    protected abstract runSubStage( subStage: T_SubStage ): Promise<void>;

    /**
     * This runs a custom sub-stage that only copies a whole folder at the given
     * subpath from the source to the dist directories.
     * 
     * Deletes any existing, logs update messages, etc.
     * 
     * @category Running
     * 
     * @param subpath       The subdriectory, relative to src path.
     * @param _distDir      Optionally force a diffrent output directory than the auto-generated one.
     * @param logLevelBase  Base output level for log messages.
     * 
     * @since 0.1.4-alpha
     * @since 0.2.0-alpha.1 — Added logLevelBase param.
     * 
     * @experimental
     */
    protected async runCustomDirCopySubStage(
        subpath: string,
        _distDir?: string,
        logLevelBase: number = 1,
    ) {
        this.console.progress( 'copying ' + subpath + ' to dist...', 0 + logLevelBase );

        const distDir = _distDir ?? this.getDistDir( undefined ).replace( /\/$/g, '' );

        if ( !this.isWatchedUpdate && this.fs.exists( distDir ) ) {
            this.console.verbose( 'deleting any existing files...', 1 + logLevelBase );
            this.fs.delete(
                [ distDir + '/' + subpath ],
                ( this.params.verbose ? 2 : 1 ) + logLevelBase,
            );
        }

        const srcDir = this.getSrcDir( undefined ).replace( /\/+$/gi, '' );

        // returns
        if ( !this.fs.exists( srcDir + '/' + subpath ) ) {
            this.console.verbose( 'ⅹ source dir ' + this.fs.pathRelative( srcDir ) + ' does not exist, exiting...', 1 + logLevelBase );
            return;
        }

        // returns
        if ( !this.fs.isDirectory( srcDir + '/' + subpath ) ) {
            this.console.verbose( 'ⅹ source dir ' + this.fs.pathRelative( srcDir ) + ' is not a directory, exiting...', 1 + logLevelBase );
            return;
        }

        this.console.verbose( 'copying files...', 1 + logLevelBase );
        this.try(
            this.fs.copy,
            ( this.params.verbose ? 2 : 1 ) + logLevelBase,
            [
                subpath,
                ( this.params.verbose ? 2 : 1 ) + logLevelBase,
                distDir,
                srcDir,
                {
                    force: true,
                    rename: false,
                    recursive: true,
                },
            ],
        );
    }


    /**
     * This runs a custom sub-stage that uses globs to find non-partial
     * scss/sass files and compile them at the given subpath from the source to
     * the dist directories.
     *
     * Deletes any existing, logs update messages, etc.
     *
     * @param subpath       The subdirectory, relative to src path.
     * @param distDir       Force a diffrent output directory than the auto-generated one.
     * @param opts          Additional options. See {@link AbstractStage.runCustomScssDirSubStage.DEFAULT_OPTS} for defaults.
     * @param logLevelBase  Base output level for log messages. Default 1.
     *
     * @since 0.1.4-alpha
     * @since 0.2.0-alpha — Added `postCSS` param and PostCSS compatibility.
     * @since 0.2.0-alpha.1 — Added `logLevelBase` param.
     * 
     * @since 0.2.0-alpha.2 — Changed `postCSS` param to `opts` object param. Added returning output css filepaths. Improved some issues with the async compiling and sub-file finding. 
     * 
     * @since 0.3.0-alpha.1 — Added `sassOpts` param and allowed `subpath` to be an array.
     */
    protected async runCustomScssDirSubStage(
        subpath: string | string[],
        distDir?: string,
        opts?: Partial<AbstractStage.runCustomScssDirSubStage.Opts>,
        logLevelBase?: number,
        sassOpts?: Stage.Compiler.Args.Sass,
    ): Promise<string[]>;

    /**
     * Deprecated overload here for forward-compatibility.  Please use the
     * overload above instead.
     *
     * @deprecated 0.2.0-alpha.2 — Please pass an
     *             {@link AbstractStage.runCustomScssDirSubStage.Opts} object as 
     *             the third param instead.
     */
    protected async runCustomScssDirSubStage(
        subpath: string | string[],
        distDir?: string,
        postCSS?: boolean,
        logLevelBase?: number,
        sassOpts?: Stage.Compiler.Args.Sass,
    ): Promise<string[]>;

    /**
     * @category Running
     * 
     * @experimental
     */
    protected async runCustomScssDirSubStage(
        _subpath: string | string[],
        _distDir?: string,
        _opts?: boolean | Partial<AbstractStage.runCustomScssDirSubStage.Opts>,
        logLevelBase: number = 1,
        sassOpts: Stage.Compiler.Args.Sass = {},
    ): Promise<string[]> {
        const subpaths = Array.isArray( _subpath ) ? _subpath : [ _subpath ];

        const opts = mergeArgs(
            AbstractStage.runCustomScssDirSubStage.DEFAULT_OPTS,
            typeof _opts === 'boolean' ? { postCSS: _opts, } : _opts
        );

        const srcDir = ( opts.srcDir ?? this.getSrcDir() ).replace( /\/$/g, '' );

        const srcSubpaths = subpaths.map(
            path => this.fs.pathResolve( srcDir, path )
        );

        const distDir = ( _distDir ?? this.getDistDir() ).replace( /\/$/g, '' );

        this.console.progress( 'compiling ' + srcSubpaths.map( this.fs.pathRelative ).join( ', ' ) + ' to css at ' + distDir + '...', 0 + logLevelBase );

        const distSubpaths = subpaths.map(
            path => this.fs.pathResolve( distDir, path )
        );

        // if the output dir exists, we should delete the old contents
        if ( !this.isWatchedUpdate && distSubpaths.filter( this.fs.exists ).length ) {
            this.console.verbose( 'deleting existing dist files...', 1 + logLevelBase );
            this.fs.delete( distDir, ( this.params.verbose ? 2 : 1 ) + logLevelBase );
        }

        // returns
        if ( !srcSubpaths.filter( this.fs.exists ).length ) {
            this.console.progress(
                `ⅹ source dir(s) ${ subpaths.map( this.fs.pathRelative ).join( ', ' ) } do not exist in ${ srcDir }, exiting...`,
                1 + logLevelBase,
            );
            return [];
        }

        // returns
        if ( !srcSubpaths.filter( this.fs.isDirectory ).length ) {
            this.console.progress(
                `ⅹ source dir(s) ${ subpaths.map( this.fs.pathRelative ).join( ', ' ) } in ${ srcDir } are not directories, exiting...`,
                1 + logLevelBase,
            );
            return [];
        }

        this.params.debug && this.console.verbose( 'globbing for scss files...', 1 + logLevelBase );

        const scssPaths = this.fs.glob(
            opts.globs.map( _g => srcSubpaths.map(
                src => src + '/' + _g.replace( /^\//gi, '' )
            ) ).flat(),
            {
                ignore: [
                    ...FileSystem.globs.SYSTEM,
                    ...opts.ignoreGlobs,
                ]
            },
        ).filter( this.fs.isFile ).map( this.fs.pathRelative );

        // returns
        if ( !scssPaths.length ) {
            this.console.progress(
                `ⅹ no css, sass, or scss files found in ${ srcDir } subpaths ${ subpaths.map( this.fs.pathRelative ).join( ', ' ) }, exiting...`,
                1 + logLevelBase,
                { italic: true }
            );
            return [];
        }

        const regex = {
            srcDir: new RegExp(
                escRegExp( srcDir + '/' ),
                'gi'
            ),
        };

        const regex_replace = {
            distDir: escRegExpReplace( distDir + '/' ),
        };

        const scssPaths_mapped = scssPaths.map( ( input ) => ( {
            input,
            output: (
                this.fs.pathRelative( input )
                    .replace( regex.srcDir, regex_replace.distDir )
                    .replace( /\.(sass|scss)$/gi, '.css' )
                    .replace( /\/_?index\.css$/gi, '.css' )
            ),
        } ) );

        this.console.verbose( 'compiling to css at ' + distDir + '...', 1 + logLevelBase );

        const completeSassOpts = { ...this.sassOpts, ...sassOpts };

        const compile = (
            scssPaths_mapped.length < 2
            && scssPaths_mapped[ 0 ]?.input
            && scssPaths_mapped[ 0 ]?.output
        )
            ? this.compiler.scss(
                scssPaths_mapped[ 0 ].input,
                scssPaths_mapped[ 0 ].output,
                ( this.params.verbose ? 2 : 1 ) + logLevelBase,
                completeSassOpts,
            ).catch(
                error => this.sassErrorHandler(
                    error,
                    ( this.params.verbose ? 2 : 1 ) + logLevelBase,
                    completeSassOpts,
                )
            )
            : this.compiler.scssBulk(
                scssPaths_mapped,
                ( this.params.verbose ? 2 : 1 ) + logLevelBase,
                completeSassOpts,
                opts.maxConcurrent,
            ).catch(
                error => this.sassErrorHandler(
                    error,
                    ( this.params.verbose ? 2 : 1 ) + logLevelBase,
                    completeSassOpts,
                )
            );

        return compile.then( async ( _outputPaths ) => {
            const outputPaths = typeof _outputPaths == 'string' ? [ _outputPaths ] : _outputPaths;

            // returns
            if ( !opts.postCSS ) {
                return outputPaths;
            }

            this.console.verbose( 'processing with postcss...', 1 + logLevelBase );
            return this.atry(
                this.compiler.postCSS,
                ( this.params.verbose ? 2 : 1 ) + logLevelBase,
                [
                    outputPaths.map( from => ( { from } ) ),
                    ( this.params.verbose ? 2 : 1 ) + logLevelBase,
                ],
            ).then( () => outputPaths );
        } );
    }
}

/**
 * Utilities for the {@link AbstractStage} class.
 * 
 * @since 0.2.0-alpha.2
 */
export namespace AbstractStage {

    /**
     * Utilities for the {@link AbstractStage.runCustomScssDirSubStage} method.
     * 
     * @since 0.2.0-alpha.2
     */
    export namespace runCustomScssDirSubStage {

        /**
         * Default options for the {@link AbstractStage.runCustomScssDirSubStage}
         * method.
         * 
         * @see {@link Opts} For property details.
         *
         * @since 0.2.0-alpha.2
         * 
         * @source
         */
        export const DEFAULT_OPTS: AbstractStage.runCustomScssDirSubStage.Opts = {

            globs: [
                '**/*.scss',
                '**/*.sass',
                '**/*.css',
            ],

            ignoreGlobs: [
                '**/_*',
            ],

            maxConcurrent: undefined,

            postCSS: true,
        };

        /**
         * Options for the {@link AbstractStage.runCustomScssDirSubStage}
         * method.
         *
         * @since 0.2.0-alpha.2
         */
        export interface Opts {

            /**
             * Globs used to find scss files to compile. Relative to subpath param.
             * 
             * @default 
             * [
             *     '/**\/*.scss',
             *     '/**\/*.sass',
             *     '/**\/*.css',
             * ]
             */
            globs: string[];

            /**
             * Globs of files to ignore when fetching scss files to compile.
             *
             * @default [ '**\/_ *' ]
             */
            ignoreGlobs: string[];

            /**
             * Passed to {@link Stage.Compiler.sassBulk}.
             * 
             * @since 0.3.0-alpha.1
             */
            maxConcurrent: undefined | number;

            /**
             * Whether to run PostCSS on the output css.
             * 
             * @default true
             */
            postCSS: boolean;

            /**
             * The base path for the source directory (used to rewrite the
             * output path).
             *
             * @since 0.3.0-alpha.1
             */
            srcDir?: string;
        }
    }
}
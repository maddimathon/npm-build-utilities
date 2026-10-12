/**
 * @since 0.3.0-beta.3
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type * as sass from 'sass-embedded';

import type {
    PackageJson,
} from '@maddimathon/utility-typescript/types';

import {
    type MessageMaker,

    escRegExp,
    escRegExpReplace,
    mergeArgs,
    softWrapText,
    toTitleCase,
    VariableInspector,
} from '@maddimathon/utility-typescript';


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
    getErrorInfo,
    errorStringify,
} from '../../../@internal/index.js';

import {
    FileSystem,
} from '../../../00-universal/index.js';

import { getPackageJson } from '../../../00-universal/getPackageJson.js';

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
 * @since 0.3.0-beta.3 — Is a pared-down version of {@link AbstractStage} (which now extends this class) and relocated many of its methods.
 */
export abstract class MinimumStage<
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
    #pkg: PackageJson | undefined;

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
            ) as PackageJson;
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

        } as const satisfies PackageJson;
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
                        class: 'MinimumStage',
                        method: 'get version',
                        file: 'src/ts/lib/03-stages/classes/abstract/MinimumStage.ts',
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
     * the value of {@link MinimumStage.pkg}.version is updated.
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
                    class: 'MinimumStage',
                    method: 'set version',
                    file: 'src/ts/lib/03-stages/classes/abstract/MinimumStage.ts',
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
        pkg: PackageJson | undefined,
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

        this.atry = this.atry.bind( this );
        this.getDistDir = this.getDistDir.bind( this );
        this.getScriptsPath = this.getScriptsPath.bind( this );
        this.getSrcDir = this.getSrcDir.bind( this );
        this.logError = this.logError.bind( this );
        this.replaceInFiles = this.replaceInFiles.bind( this );
        this.run = this.run.bind( this );
        this.startEndNotice = this.startEndNotice.bind( this );
        this.try = this.try.bind( this );
        this.uncaughtErrorListener = this.uncaughtErrorListener.bind( this );
        this.writeLog = this.writeLog.bind( this );

        this.compiler = this.args.utils.compiler ?? new Stage_Compiler(
            this,
            this.handleError,
        );
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
     * @category Config
     * 
     * @since 0.3.0-alpha.1
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
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
     * @category Sass
     * 
     * @since 0.3.0-alpha.1
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
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


    /* COMPILERS ===================================== */

    /**
     * Takes completed arguments and runs sass functions with proper error
     * handling.
     * 
     * @category Sass
     *
     * @since 0.3.0-beta
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     */
    protected async compileScss(
        paths: {
            input: string;
            output: string;
        }[],
        logLevelBase: number,
        completeSassOpts: Stage.Compiler.Args.Sass,
        opts: Partial<MinimumStage.compileScss.Opts> = {},
    ): Promise<string[]> {

        const level_1 = logLevelBase + ( this.params.verbose ? 1 : 0 );

        const catcher = ( error: any ) => this.sassErrorHandler( error, level_1, completeSassOpts );

        this.console.verbose( opts.startMsg ?? 'compiling to css...', logLevelBase );

        const compile = (
            paths.length < 2
            && paths[ 0 ]?.input
            && paths[ 0 ]?.output
        )
            ? this.compiler.scss(
                paths[ 0 ].input,
                paths[ 0 ].output,
                level_1,
                completeSassOpts,
            ).catch( catcher )
            : this.compiler.scssBulk(
                paths,
                level_1,
                completeSassOpts,
                opts.maxConcurrent,
            ).catch( catcher );

        return compile.then(
            async ( _outputPaths ) => {
                const outputPaths = typeof _outputPaths == 'string' ? [ _outputPaths ] : _outputPaths;

                if ( opts.replace ) {
                    this.console.verbose( 'replacing in compiled files...', logLevelBase );

                    for ( const _key of [ 'current', 'package' ] as const ) {
                        this.try(
                            this.replaceInFiles,
                            level_1,
                            [ outputPaths, _key, level_1 ],
                        );
                    }
                }

                if ( opts.postCSS ) {
                    this.console.verbose( 'processing with postcss...', logLevelBase );

                    let _postCSSpaths = outputPaths;

                    const { ignoreGlobs, ...postCssOpts } = typeof opts.postCSS === 'object'
                        ? opts.postCSS
                        : {};

                    if ( ignoreGlobs?.length ) {
                        _postCSSpaths = this.fs.glob( _postCSSpaths, { ignore: ignoreGlobs } );
                    }

                    await this.atry(
                        this.compiler.postCSS,
                        level_1,
                        [
                            _postCSSpaths.map( from => ( { from } ) ),
                            level_1,
                            postCssOpts,
                        ],
                    );
                }

                if ( opts.prettier ) {
                    this.console.verbose( 'formatting with prettier...', logLevelBase );

                    await this.atry(
                        this.fs.prettier,
                        level_1,
                        [ outputPaths, 'scss' ],
                    );
                }

                return outputPaths;
            }
        );
    }


    /* CONFIG & ARGS ===================================== */

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
        subDir?: undefined,
        ...subpaths: string[]
    ): string;

    public getSrcDir(
        subDir: Config.Paths.SourceDirectory,
        ...subpaths: string[]
    ): string[];

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
    public handleError(
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
     * Handles uncaught errors in 
     * 
     * @param error  To handle.
     * 
     * @since 0.2.0-alpha
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     */
    public uncaughtErrorListener( error: unknown ) {
        this.handleError( error as AbstractError.Input, 1 );
    }

    /**
     * Handles errors thrown during sass compile.
     * 
     * @category Sass
     * 
     * @since 0.3.0-alpha.3
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     */
    public sassErrorHandler(
        error: any,
        level: number,
        opts: Stage.Compiler.Args.Sass,
        _args?: Partial<AbstractError.Handler.Args> & {
            method?: 'error' | 'warn';
        },
    ): string[] {

        const {
            method = 'error',
            ...args
        } = _args ?? {};

        const errorArr = Array.isArray( error ) && error.every( err => err instanceof Error )
            ? error
            : [ error ];

        const regex_clrs = /^\s*(\\x1b\[[\d;:]+m\s*)*/gs;

        const stackFilter = <T_Input>( stack: T_Input ): string | T_Input => stack
            ? this.compiler.sassErrorStackFilter(
                String( stack ).replace( regex_clrs, '' ).trim(),
                opts,
            ).join( '\n' )
            : typeof stack === 'string'
                ? stack.replace( regex_clrs, '' ).trim()
                : stack;

        for ( const err of errorArr ) {
            const msgs: MessageMaker.BulkMsgs = [];

            const isSassError = typeof err == 'object' && ( 'sassStack' in err || 'sassMessage' in err );

            if ( isSassError || err instanceof Error ) {
                const errArgs = { exitProcess: false };

                const [ typedError, errInfo ] = getErrorInfo( err, this.console, this.fs, errArgs );

                if ( isSassError ) {

                    const _typedError = typedError as ( typeof typedError ) & {
                        sassMessage?: string;
                        sassStack?: string;
                        span?: sass.SourceSpan;
                    };

                    const shortMessage = _typedError.sassMessage?.trim().replace(
                        /^\s*(Error:\s*)+\s+/gs,
                        ''
                    ) ?? '';

                    const _regexMaker_msgStart = ( msg: string ) => new RegExp(
                        '^\\s*((Error:\\s*)*\\s+)?\\s*(' + msg.split( /\s*\n+\s*/g ).map(
                            line => escRegExp( line )
                        ).join( '[\\n\\s]*' ) + ')?',
                        'gs'
                    );

                    if ( shortMessage ) {
                        const _regex_short_msg = _regexMaker_msgStart( shortMessage );

                        if ( errInfo.stack ) {
                            errInfo.stack = errInfo.stack.replace( _regex_short_msg, '' );
                        }

                        if ( errInfo.message ) {
                            errInfo.message = errInfo.message.replace( _regex_short_msg, '' );
                        }
                    }

                    const includeStack = !( errInfo.message && errInfo.stack );

                    errInfo.stack = errInfo.stack?.replace(
                        _regexMaker_msgStart( errInfo.message ?? '' ),
                        '    ',
                    );

                    let message: MessageMaker.BulkMsgs = errInfo.message
                        ? [ [ stackFilter( errInfo.message ) ] ]
                        : [];

                    if ( !includeStack && errInfo.stack ) {

                        const _msg = errInfo.message
                            ? softWrapText(
                                errInfo.message,
                                this.console.nc.msg.args.msg.maxWidth ?? 80,
                            )
                            : errInfo.message;

                        message = [
                            [
                                (
                                    _msg ? stackFilter( _msg ) + '\n\n' : ''
                                ) + '    ' + stackFilter( errInfo.stack ),
                                { bold: false, italic: false, maxWidth: null },
                            ]
                        ];
                    }

                    errInfo.stack = stackFilter( errInfo.stack );

                    msgs.push(
                        [
                            `[Sass: Error] ${ stackFilter( shortMessage ) }`,
                            { bold: true, italic: false },
                        ],
                        ...message,
                        ...errorStringify.output( err, errInfo, this.console, this.fs, errArgs ),
                        ...errorStringify.cause( errInfo, level, this.console, this.fs, errArgs ),

                        ...(
                            errInfo.message && errInfo.stack
                                ? []
                                : errorStringify.stack( errInfo, this.console, this.fs, errArgs )
                        ),
                    );

                    if ( this.params.debug ) {
                        msgs.push(
                            ...errorStringify.details( errInfo, this.console, this.fs, errArgs ),
                            ...errorStringify.dump( err, errInfo, this.console, this.fs, errArgs, {
                                isSassError,
                            } ),
                        );
                    }

                } else {
                    msgs.push(
                        ...errorStringify.message( errInfo ),
                        ...errorStringify.output( err, errInfo, this.console, this.fs, errArgs ),

                        ...errorStringify.cause( errInfo, level, this.console, this.fs, errArgs ),
                        ...errorStringify.stack( errInfo, this.console, this.fs, errArgs ),
                        ...errorStringify.details( errInfo, this.console, this.fs, errArgs ),

                        ...errorStringify.dump( err, errInfo, this.console, this.fs, errArgs, {
                            isSassError,
                            sassOpts: opts,
                        } ),
                    );
                }
            } else {
                msgs.push( [ VariableInspector.stringify( { err } ), { bold: false, italic: false, maxWidth: null } ] );
            }

            this.console[ method ]( msgs, level, {
                linesIn: 1,
                linesOut: 1,

                ...args ?? {},

                joiner: '\n\n',
            } );
        }

        // exits
        if ( this.params.packaging || this.params.releasing ) {
            process.exit();
        }

        return [];
    }


    /**
     * Runs a function, with parameters as applicable, and catches (& handles)
     * anything thrown.
     * 
     * For the asynchronous method, see {@link MinimumStage.atry}.
     *
     * Overloaded for better function param typing.
     *
     * @category Errors
     *
     * @experimental
     */
    public readonly try: Stage.TryerFunction<'sync'> = <
        T_Params extends unknown[] | never[],
        T_Return extends unknown,
        T_FallbackReturn extends any = "FAILED",
    >(
        tryer: ( ...params: T_Params ) => T_Return,
        level: number,
        params?: T_Params,
        handlerArgs?: Partial<AbstractError.Handler.Args>,
        fallbackReturn: T_FallbackReturn = 'FAILED' as T_FallbackReturn,
    ): T_Return | T_FallbackReturn => {

        try {
            return tryer( ...( params ?? [] as T_Params ) );
        } catch ( error ) {

            this.handleError( error, level, handlerArgs );
            return fallbackReturn;
        }
    };

    /**
     * Runs a function (asynchronously), with parameters as applicable, and
     * catches (& handles) anything thrown.
     * 
     * For the synchronous method, see {@link MinimumStage.try}.
     *
     * Overloaded for better function param typing.
     *
     * @category Errors
     *
     * @experimental
     */
    public readonly atry: Stage.TryerFunction<'async'> = <
        T_Params extends unknown[] | never[],
        T_Return extends unknown,
        T_FallbackReturn extends any = "FAILED",
    >(
        tryer: ( ...params: T_Params ) => T_Return | Promise<T_Return>,
        level: number,
        params?: T_Params,
        handlerArgs?: Partial<AbstractError.Handler.Args>,
        fallbackReturn: T_FallbackReturn = 'FAILED' as T_FallbackReturn,
    ): Promise<T_Return | T_FallbackReturn> =>
        Promise.resolve(
            tryer( ...( params ?? [] as T_Params ) )
        ).catch( ( error ) => {

            this.handleError( error, level, handlerArgs );
            return fallbackReturn ?? 'FAILED' as T_FallbackReturn;
        } );


    /* MESSAGES ===================================== */

    /** 
     * {@inheritDoc Stage.startEndNotice}
     * 
     * @category Running
     */
    public startEndNotice(
        _which: "start" | "end" | {
            args?: Partial<MessageMaker.MsgArgs>;
            flag: string;
            message: string | string[] | MessageMaker.BulkMsgs;
            watcherMessage?: undefined | string | string[] | MessageMaker.BulkMsgs;
        } | null,
        watcherVersion: boolean = false,
    ): void | Promise<void> {
        watcherVersion = watcherVersion && this.isWatchedUpdate;

        const { message, messageArgs = {}, watcherMessage, which } = _which && typeof _which === 'object'
            ? {
                message: _which.message,
                messageArgs: _which.args,
                watcherMessage: _which.watcherMessage,
                which: _which.flag,
            }
            : {
                which: _which,
            };

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

        const watchChangeNoticeSlug = this.params.watchedWatcher
            ? `${ this.params.watchedWatcher } - ${ which }`
            : `watched change: ${ which }`;

        switch ( which ) {

            case 'start':
            case 'end':
            case null:
                const messages: {
                    default: MessageMaker.BulkMsgs,
                    start: MessageMaker.BulkMsgs,
                    end: MessageMaker.BulkMsgs,
                } = watcherVersion
                        ? {
                            default: [ [ '👀 ', { flag: false } ], [ `[${ watchChangeNoticeSlug }] ${ watchFileNameMsg || '' }` ] ],
                            start: [ [ '🚨 ', { flag: false } ], [ `[${ watchChangeNoticeSlug }] ${ watchFileNameMsg || '' }` ] ],
                            end: [ [ '✅ ', { flag: false } ], [ `[${ watchChangeNoticeSlug }] ${ watchFileNameMsg || '' }` ] ],
                        }
                        : {
                            default: [ [ `${ uppercase.which }ING ${ uppercase.name }` ] ],
                            start: [ [ `${ uppercase.name } ${ uppercase.which }ING...` ] ],
                            end: [ [ '✓ ', { flag: false } ], [ `${ toTitleCase( this.name ) } Complete!`, { italic: true } ] ],
                        };

                this.console.startOrEnd( messages[ which ?? 'default' ], which );
                break;

            default:
                const customMessage = watcherVersion
                    ? watcherMessage ?? message ?? []
                    : message ?? [];

                this.console.log(
                    customMessage,
                    0,
                    {
                        bold: true,
                        italic: false,

                        joiner: '',

                        ...messageArgs,
                    },
                );
                break;
        }
    }


    /* RUNNING ===================================== */

    /**
     * Use a custom runner.
     */
    public async run<T_Return extends any>( callback: MinimumStage.RunnerFunction<T_Return> ): Promise<T_Return>;

    /**
     * Without a custom runner
     */
    public async run<T_Return extends any>( callback?: never ): Promise<void>;

    /**
     * Runs the entire stage (asynchronously).
     *
     * This method should probably not be overwritten, except in completely
     * custom class implementations.
     * 
     * @category Running
     */
    public async run<T_Return extends any>( callback?: MinimumStage.RunnerFunction<T_Return> ): Promise<T_Return | void>;

    public async run<T_Return extends any>( callback?: MinimumStage.RunnerFunction<T_Return> ): Promise<T_Return | void> {
        // returns
        if ( !callback ) {
            await this.startEndNotice( {
                args: { flag: false },
                flag: 'skipped',
                message: [ [ '⨉ ', { flag: false } ], [ 'Skipped run', { flag: true } ], [ 'No callback param was passed.', { italic: true } ] ],
                watcherMessage: [ [ '⛔️ ', { flag: false } ], [ 'Skipped run', { flag: true } ], [ 'No callback param was passed.', { italic: true } ] ],
            } );
            return undefined;
        }

        /* start */
        await this.startEndNotice( 'start' );

        const result = await callback.bind( this )();

        /* end */
        await this.startEndNotice( 'end' );

        return result;
    }

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
     * @since 0.3.0-beta.2 — Renamed from runCustomDirCopySubStage to customCopySubstage.
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     * 
     * @experimental
     */
    protected async customCopySubstage(
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
     * @category Running
     *
     * @since 0.1.4-alpha
     * @since 0.2.0-alpha — Added `postCSS` param and PostCSS compatibility.
     * @since 0.2.0-alpha.1 — Added `logLevelBase` param.
     * @since 0.2.0-alpha.2 — Changed `postCSS` param to `options` object param. Added returning output css filepaths. Improved some issues with the async compiling and sub-file finding.
     * @since 0.3.0-alpha.1 — Added `sassOpts` param and allowed `subpath` to be an array.
     * @since 0.3.0-beta.2 — Changed `sassOpts` param to a property in `options`. Renamed from runCustomScssDirSubStage to customScssSubstage and switched from a method to an object returning dir and demoDir methods.
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     * 
     * @experimental
     */
    protected get customScssSubstage(): MinimumStage.customScssSubstage {

        const _baseMethod: MinimumStage.customScssSubstage[ 'dir' ] = async function (
            this: MinimumStage<T_Args, T_SubStage>,
            _subpaths: string | string[],
            _distDir?: undefined | string,
            _opts?: Partial<MinimumStage.customScssSubstage.Opts>,
            logLevelBase: number = 1,
        ) {
            const subpaths = Array.isArray( _subpaths ) ? _subpaths : [ _subpaths ];

            const {
                sass: sassOpts,
                ...opts
            } = mergeArgs(
                MinimumStage.customScssSubstage.DEFAULT_OPTS as MinimumStage.customScssSubstage.Opts,
                _opts,
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
            if ( opts.clearOutputDir && !this.isWatchedUpdate && distSubpaths.filter( this.fs.exists ).length ) {
                this.console.verbose( 'deleting existing dist files...', 1 + logLevelBase );

                this.fs.delete(
                    opts.clearOutputDir === 'complete' ? distDir : [
                        `${ distDir }/**/*.css`,
                        `${ distDir }/**/*.css.map`,
                    ],
                    ( this.params.verbose ? 2 : 1 ) + logLevelBase,
                );
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

            return this.compileScss(
                scssPaths_mapped,
                ( this.params.verbose ? 2 : 1 ) + logLevelBase,
                { ...this.sassOpts, ...sassOpts },
                {
                    startMsg: 'compiling to css at ' + distDir + '...',
                    ...opts,
                },
            );
        }.bind( this );

        return {

            dir: async function (
                this: MinimumStage<T_Args, T_SubStage>,
                ...args: Parameters<MinimumStage.customScssSubstage[ 'dir' ]>
            ) {
                return _baseMethod( ...args );
            }.bind( this ),

            demoDir: async function (
                this: MinimumStage<T_Args, T_SubStage>,
                subpaths: string | string[],
                distDir?: undefined | string,
                opts: Partial<MinimumStage.customScssSubstage.Opts> = {},
                logLevelBase?: number,
            ) {
                return _baseMethod(
                    subpaths,
                    distDir,
                    {
                        clearOutputDir: false,
                        postCSS: false,
                        replace: true,
                        prettier: true,
                        ...opts,
                    },
                    logLevelBase,
                );
            }.bind( this ),
        };
    }
}

/**
 * Utilities for the {@link MinimumStage} class.
 * 
 * @category Stages
 * 
 * @since 0.3.0-beta.3 — Is a pared-down version of {@link AbstractStage} (which now extends this class) and relocated many of its methods.
 */
export namespace MinimumStage {

    /**
     * @since 0.3.0-beta.3
     */
    export type RunnerFunction<T_Return extends any | void> = () => T_Return | Promise<T_Return>;

    /**
     * @since 0.3.0-beta
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     */
    export namespace compileScss {

        /**
         * @since 0.3.0-beta
         * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
         */
        export interface Opts {

            /**
             * Passed to {@link Stage.Compiler.scssBulk}.
             * 
             * @since 0.3.0-alpha.1
             * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
             */
            maxConcurrent: undefined | number;

            /**
             * Whether to run PostCSS on the output css.
             * 
             * @default true
             * 
             * @since 0.2.0-alpha.2
             * @since 0.3.0-beta.2 — Added option to pass an object of args instead.
             * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
             */
            postCSS: boolean | Stage.Compiler.Args.PostCSS & {
                /**
                 * @since 0.3.0-beta.2
                 */
                ignoreGlobs?: string[];
            };

            /**
             * Whether to run prettier on the output css.
             * 
             * @default false
             */
            prettier: boolean;

            /** 
             * Runs standard replacements on the compiled files.
             * 
             * @default false
             */
            replace?: boolean | undefined;

            /**
             * String for the starting progress message.
             */
            startMsg?: string | undefined;
        }
    }

    /**
     * Methods available for running custom scss substages.
     * 
     * @since 0.3.0-beta.2
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     */
    export interface customScssSubstage {
        /**
         * For simple compiling all non-partials in the given directory.
         * 
         * @param subpath       The subdirectory, relative to src path.
         * @param distDir       Force a diffrent output directory than the auto-generated one.
         * @param opts          Additional options. See {@link customScssSubstage.DEFAULT_OPTS} for defaults.
         * @param logLevelBase  Base output level for log messages. Default 1.
         * 
         * @since 0.3.0-beta.2
         */
        dir(
            subpaths: string | string[],
            distDir?: undefined | string,
            opts?: Partial<customScssSubstage.Opts>,
            logLevelBase?: number,
        ): Promise<string[]>;

        /**
         * For simple compiling all non-partials in the given directory as demo files.
         * 
         * @param subpath       The subdirectory, relative to src path.
         * @param distDir       Force a diffrent output directory than the auto-generated one.
         * @param opts          Additional options. See {@link customScssSubstage.DEFAULT_OPTS} for defaults. Some defaults are changed for better demo output.
         * @param logLevelBase  Base output level for log messages. Default 1.
         * 
         * @since 0.3.0-beta.2
         */
        demoDir(
            subpaths: string | string[],
            distDir?: undefined | string,
            opts?: Partial<customScssSubstage.Opts>,
            logLevelBase?: number,
        ): Promise<string[]>;
    }

    /**
     * Utilities for the {@link MinimumStage.customScssSubstage} methods.
     * 
     * @since 0.2.0-alpha.2
     * @since 0.3.0-beta.2 — Renamed from runCustomScssDirSubStage to customScssSubstage.
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     */
    export namespace customScssSubstage {

        /**
         * Default options for the {@link MinimumStage.customScssSubstage}
         * methods.
         * 
         * @see {@link customScssSubstage.Opts} For property details.
         *
         * @since 0.2.0-alpha.2
         * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
         * 
         * @source
         */
        export const DEFAULT_OPTS = {

            clearOutputDir: 'targeted',

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
            prettier: false,

            replace: false,
            startMsg: undefined,
        } satisfies customScssSubstage.Opts;

        /**
         * Options for the {@link MinimumStage.customScssSubstage}
         * methods.
         *
         * @since 0.2.0-alpha.2
         * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
         */
        export interface Opts extends compileScss.Opts {

            /**
             * Whether to delete the entire output directory before compiling.
             *
             * Complete deletes the directory. Targeted deleted files that match
             * *.css or *.css.map globs. False does neither.
             * 
             * @default "targeted"
             * 
             * @since 0.3.0-alpha.15
             */
            clearOutputDir: "complete" | "targeted" | false;

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
             * {@inheritDoc MinimumStage.compileScss.Opts.prettier}
             * 
             * @default true
             * 
             * @since 0.3.0-beta
             */
            prettier: boolean;

            /**
             * Sass args for the compiler.
             * 
             * @since 0.3.0-beta.2
             */
            sass?: undefined | Stage.Compiler.Args.Sass;

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
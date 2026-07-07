/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.1
 * @license MIT
 */
import type { PackageJson, TsConfig } from '@maddimathon/utility-typescript/types';
import type { NodeFiles } from '@maddimathon/utility-typescript/node';
import { type MessageMaker } from '@maddimathon/utility-typescript';
import type { CLI, Config, Stage } from '../../../../types/index.js';
import { type AbstractError, SemVer } from '../../../@internal/index.js';
import { FileSystem } from '../../../00-universal/index.js';
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
export declare abstract class AbstractStage<T_Args extends Stage.Args, T_SubStage extends string> implements Omit<Stage<T_Args, T_SubStage>, 'atry' | 'try'> {
    #private;
    /**
     * {@inheritDoc Stage.clr}
     *
     * @category Config
     */
    readonly clr: MessageMaker.Colour;
    /**
     * {@inheritDoc Stage.config}
     *
     * @category Config
     */
    readonly config: Config.Class;
    /**
     * {@inheritDoc Stage.console}
     *
     * @category Utilities
     */
    readonly console: Stage_Console;
    /**
     * {@inheritDoc Stage.compiler}
     *
     * @category Utilities
     */
    readonly compiler: Stage_Compiler;
    /**
     * {@inheritDoc Stage.fs}
     *
     * @category Utilities
     */
    get fs(): FileSystem;
    /**
     * {@inheritDoc Stage.fs}
     *
     * @category Utilities
     */
    set fs(fs: FileSystem | undefined);
    /**
     * {@inheritDoc Stage.name}
     *
     * @category Config
     */
    readonly name: string;
    /**
     * {@inheritDoc Stage.params}
     *
     * @category Config
     */
    readonly params: CLI.Params;
    /**
     * {@inheritDoc Stage.pkg}
     *
     * @category Project
     */
    get pkg(): {
        readonly name: string;
        readonly version: string;
        readonly description: string | undefined;
        readonly homepage: string | undefined;
        readonly config: {
            [key: string]: any;
            [key: number]: any;
        } | undefined;
        readonly license: string | undefined;
        readonly repository: string | undefined;
        readonly engines: {
            [key: string]: string;
        } | undefined;
        readonly files: string[] | undefined;
        readonly main: string | undefined;
        readonly bin: string | {
            [key: string]: string;
        } | undefined;
        readonly bugs: {
            url?: string;
            email?: string;
        } | undefined;
    };
    /**
     * Path to release directory for building a package for the current version.
     *
     * @category Config
     */
    get releaseDir(): string;
    /**
     * {@inheritDoc Stage.subStages}
     *
     * @category Running
     */
    abstract readonly subStages: T_SubStage[];
    /**
     * {@inheritDoc Stage.version}
     *
     * @category Project
     */
    get version(): SemVer;
    /**
     * If undefined, nothing is set.  Otherwise, a {@link SemVer} is created and
     * the value of {@link AbstractStage.pkg}.version is updated.
     */
    protected set version(input: string | SemVer | undefined);
    /**
     * Builds a complete version of this class' args, falling back to defaults
     * as needed.
     *
     * Uses {@link mergeArgs} recursively.
     *
     * @category Config
     */
    buildArgs(args?: Partial<T_Args>): T_Args;
    /**
     * {@inheritDoc Stage.args}
     *
     * @category Config
     */
    readonly args: T_Args;
    /**
     * {@inheritDoc Stage.ARGS_DEFAULT}
     *
     * @category Config
     */
    abstract get ARGS_DEFAULT(): T_Args;
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
    constructor(name: string, clr: MessageMaker.Colour, config: Config.Class, params: CLI.Params, args: Partial<T_Args>, pkg: PackageJson | undefined, version: SemVer | undefined);
    /** {@inheritDoc Stage.isDraftVersion} */
    get isDraftVersion(): boolean;
    /**
     * Whether the current run is the result of a watched change.
     *
     * @category Config
     *
     * @since 0.3.0-alpha.1
     */
    get isWatchedUpdate(): boolean;
    /**
     * Default scss options according to config & params.
     *
     * @category Sass
     *
     * @since 0.3.0-alpha.1
     */
    get sassOpts(): Stage.Compiler.Args.Sass;
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
    replaceInFiles(globs: string[], version: "current" | "package", level: number, ignore?: string[], docsMode?: boolean): string[];
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
    writeLog(msg: string | string[] | MessageMaker.BulkMsgs, filename: string, subDir?: string[], date?: null | Date): string | false;
    /**
     * Takes an input tsconfig object and attempts to resolve and
     * include the values from any configs in its "extends".
     *
     * @category Typescript
     *
     * @since 0.3.0-beta
     */
    writeTsConfig(outputPath: string, level: number, tsconfig: Partial<TsConfig>, { errorIfNotFound, ...args }?: Partial<NodeFiles.WriteFileArgs & {
        errorIfNotFound?: boolean;
    }>): Promise<string | false>;
    /**
     * Takes completed arguments and runs sass functions with proper error
     * handling.
     *
     * @since 0.3.0-beta
     */
    protected compileScss(paths: {
        input: string;
        output: string;
    }[], logLevelBase: number, completeSassOpts: Stage.Compiler.Args.Sass, opts?: Partial<AbstractStage.compileScss.Opts>): Promise<string[]>;
    /**
     * {@inheritDoc Stage.isSubStageIncluded}
     *
     * @category Config
     *
     * @since 0.3.0-alpha.11 — Added args param.
     */
    isSubStageIncluded(subStage: T_SubStage, level: number, args?: {
        checkIfSubStageIsMethod?: boolean;
        checkIfSubStageIsDefaultIncluded?: boolean;
    }): boolean;
    /**
     * {@inheritDoc Stage.getDistDir}
     *
     * @category Config
     */
    getDistDir(subDir?: Config.Paths.DistDirectory, ...subpaths: string[]): string;
    /**
     * {@inheritDoc Stage.getScriptsPath}
     *
     * @category Config
     */
    getScriptsPath(subDir?: "logs", ...subpaths: string[]): string;
    getSrcDir(subDir?: undefined, ...subpaths: string[]): string;
    getSrcDir(subDir: Config.Paths.SourceDirectory, ...subpaths: string[]): string[];
    /**
     * Alias for {@link errorHandler}.
     *
     * @category Errors
     *
     * @param error    Error to handle.
     * @param level    Depth level for output to the console.
     * @param args     Overrides for default options.
     */
    handleError(error: any, level: number, args?: Partial<AbstractError.Handler.Args>): void;
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
    logError(logMsg: string, error: unknown, level: number, errMsg?: string, date?: Date): MessageMaker.BulkMsgs;
    /**
     * Handles uncaught errors in
     *
     * @param error  To handle.
     *
     * @since 0.2.0-alpha
     */
    uncaughtErrorListener(error: unknown): void;
    /**
     * Handles errors thrown during sass compile.
     *
     * @category Sass
     *
     * @since 0.3.0-alpha.3
     */
    sassErrorHandler(error: any, level: number, opts: Stage.Compiler.Args.Sass, _args?: Partial<AbstractError.Handler.Args> & {
        method?: 'error' | 'warn';
    }): string[];
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
    readonly try: Stage.TryerFunction<'sync'>;
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
    readonly atry: Stage.TryerFunction<'async'>;
    /**
     * {@inheritDoc Stage.startEndNotice}
     *
     * @category Running
     */
    startEndNotice(which: "start" | "end" | null, watcherVersion?: boolean): void | Promise<void>;
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
    run(): Promise<void>;
    /**
     * Runs the given stage as a sub-stage to the current one.
     *
     * **This method should probably not be overwritten.**
     *
     * @param stageInput  Stage to run as a substage.
     * @param level       Depth level for output to the console.
     *
     * @category Running
     *
     * @since 0.3.0-alpha.10 — Added option to run a custom stage class.
     */
    protected runStage(stageInput: Stage.Name | [string, Stage.Class], level: number): Promise<void>;
    /**
     * Used to run a single stage within this class; used by
     * {@link AbstractStage.run}.
     *
     * @category Running
     */
    protected abstract runSubStage(subStage: T_SubStage): Promise<void>;
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
    protected runCustomDirCopySubStage(subpath: string, _distDir?: string, logLevelBase?: number): Promise<void>;
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
    protected runCustomScssDirSubStage(subpath: string | string[], distDir?: string, opts?: Partial<AbstractStage.runCustomScssDirSubStage.Opts>, logLevelBase?: number, sassOpts?: Stage.Compiler.Args.Sass): Promise<string[]>;
    /**
     * Deprecated overload here for forward-compatibility.  Please use the
     * overload above instead.
     *
     * @deprecated 0.2.0-alpha.2 — Please pass an
     *             {@link AbstractStage.runCustomScssDirSubStage.Opts} object as
     *             the third param instead.
     */
    protected runCustomScssDirSubStage(subpath: string | string[], distDir?: string, postCSS?: boolean, logLevelBase?: number, sassOpts?: Stage.Compiler.Args.Sass): Promise<string[]>;
}
/**
 * Utilities for the {@link AbstractStage} class.
 *
 * @since 0.2.0-alpha.2
 */
export declare namespace AbstractStage {
    /**
     * @since 0.3.0-beta
     */
    namespace compileScss {
        /**
         * @since 0.3.0-beta
         */
        interface Opts {
            /**
             * Passed to {@link Stage.Compiler.scssBulk}.
             *
             * @since 0.3.0-alpha.1
             */
            maxConcurrent: undefined | number;
            /**
             * Whether to run PostCSS on the output css.
             *
             * @default true
             *
             * @since 0.2.0-alpha.2
             */
            postCSS: boolean;
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
     * Utilities for the {@link AbstractStage.runCustomScssDirSubStage} method.
     *
     * @since 0.2.0-alpha.2
     */
    namespace runCustomScssDirSubStage {
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
        const DEFAULT_OPTS: {
            clearOutputDir: "targeted";
            globs: string[];
            ignoreGlobs: string[];
            maxConcurrent: undefined;
            postCSS: true;
            prettier: false;
            replace: false;
            startMsg: undefined;
        };
        /**
         * Options for the {@link AbstractStage.runCustomScssDirSubStage}
         * method.
         *
         * @since 0.2.0-alpha.2
         */
        interface Opts extends compileScss.Opts {
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
             * {@inheritDoc AbstractStage.compileScss.prettier}
             *
             * @default true
             *
             * @since 0.3.0-beta
             */
            prettier: boolean;
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

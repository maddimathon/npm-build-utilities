/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.2.0-alpha
 * @license MIT
 */
import type { Json } from '@maddimathon/utility-typescript/types';
import { MessageMaker } from '@maddimathon/utility-typescript/classes';
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
export declare abstract class AbstractStage<T_Args extends Stage.Args, T_SubStage extends string> implements Stage<T_Args, T_SubStage> {
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
    constructor(name: string, clr: MessageMaker.Colour, config: Config.Class, params: CLI.Params, args: Partial<T_Args>, pkg: Json.PackageJson | undefined, version: SemVer | undefined);
    /** {@inheritDoc Stage.isDraftVersion} */
    get isDraftVersion(): boolean;
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
     * {@inheritDoc Stage.isSubStageIncluded}
     *
     * @category Config
     */
    isSubStageIncluded(subStage: T_SubStage, level: number): boolean;
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
    getSrcDir(subDir: Config.Paths.SourceDirectory, ...subpaths: string[]): string[];
    getSrcDir(subDir?: undefined, ...subpaths: string[]): string;
    /**
     * Alias for {@link errorHandler}.
     *
     * @category Errors
     *
     * @param error    Error to handle.
     * @param level    Depth level for output to the console.
     * @param args     Overrides for default options.
     */
    protected handleError(error: any, level: number, args?: Partial<AbstractError.Handler.Args>): void;
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
     * Handles uncaught errors in node.
     *
     * @param error  To handle.
     *
     * @since 0.2.0-alpha
     */
    uncaughtErrorListener(error: unknown): void;
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
    protected try<T_Params extends never[], T_Return extends unknown>(tryer: () => T_Return, level: number, params?: NoInfer<T_Params>, handlerArgs?: Partial<AbstractError.Handler.Args> & {
        exitProcess?: false;
    }): T_Return;
    /**
     * If the `tryer` function *has* params, then they are required.
     *
     * If the handler must exit, then 'FAILED' is not possible.
     */
    protected try<T_Params extends unknown[], T_Return extends unknown>(tryer: (...params: T_Params) => T_Return, level: number, params: NoInfer<T_Params>, handlerArgs?: Partial<AbstractError.Handler.Args> & {
        exitProcess?: false;
    }): T_Return;
    /**
     * If the `tryer` function has no params, then they are optional.
     *
     * If the handler won't exit, then 'FAILED' is possible.
     */
    protected try<T_Params extends never[], T_Return extends unknown>(tryer: () => T_Return, level: number, params: NoInfer<T_Params> | undefined, handlerArgs: Partial<AbstractError.Handler.Args> & {
        exitProcess: true | boolean;
    }): T_Return | "FAILED";
    /**
     * If the `tryer` function *has* params, then they are required.
     */
    protected try<T_Params extends unknown[], T_Return extends unknown>(tryer: (...params: T_Params) => T_Return, level: number, params: NoInfer<T_Params>, handlerArgs: Partial<AbstractError.Handler.Args> & {
        exitProcess: true | boolean;
    }): T_Return | "FAILED";
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
    protected atry<T_Params extends never[], T_Return extends unknown>(tryer: () => Promise<T_Return>, level: number, params?: NoInfer<T_Params>, handlerArgs?: Partial<AbstractError.Handler.Args> & {
        exitProcess?: false;
    }): Promise<T_Return>;
    /**
     * If the `tryer` function *has* params, then they are required.
     *
     * If the handler must exit, then 'FAILED' is not possible.
     */
    protected atry<T_Params extends unknown[], T_Return extends unknown>(tryer: (...params: T_Params) => Promise<T_Return>, level: number, params: NoInfer<T_Params>, handlerArgs?: Partial<AbstractError.Handler.Args> & {
        exitProcess?: false;
    }): Promise<T_Return>;
    /**
     * If the `tryer` function has no params, then they are optional.
     *
     * If the handler won't exit, then 'FAILED' is possible.
     */
    protected atry<T_Params extends never[], T_Return extends unknown>(tryer: () => Promise<T_Return>, level: number, params: NoInfer<T_Params> | undefined, handlerArgs: Partial<AbstractError.Handler.Args> & {
        exitProcess: true | boolean;
    }): Promise<T_Return | "FAILED">;
    /**
     * If the `tryer` function *has* params, then they are required.
     */
    protected atry<T_Params extends unknown[], T_Return extends unknown>(tryer: (...params: T_Params) => Promise<T_Return>, level: number, params: NoInfer<T_Params>, handlerArgs: Partial<AbstractError.Handler.Args> & {
        exitProcess: true | boolean;
    }): Promise<T_Return | "FAILED">;
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
     * @param stage  Stage to run as a substage.
     * @param level  Depth level for output to the console.
     *
     * @category Running
     */
    protected runStage(stage: Stage.Name, level: number): Promise<void>;
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
     * @param subpath  The subdriectory, relative to src path.
     * @param _distDir  Optionally force a diffrent output directory than the auto-generated one.
     *
     * @since 0.1.4-alpha
     *
     * @experimental
     */
    protected runCustomDirCopySubStage(subpath: string, _distDir?: string): Promise<void>;
    /**
     * This runs a custom sub-stage that uses globs to find non-partial
     * scss/sass files and compile them at the given subpath from the source to
     * the dist directories.
     *
     * Deletes any existing, logs update messages, etc.
     *
     * @category Running
     *
     * @param subpath   The subdriectory, relative to src path.
     * @param _distDir  Optionally force a diffrent output directory than the auto-generated one.
     * @param postCSS   Whether to run PostCSS on the output css. Default true.
     *
     * @since 0.1.4-alpha
     * @since 0.2.0-alpha — Added postCSS param and PostCSS compatibility.
     *
     * @experimental
     */
    protected runCustomScssDirSubStage(subpath: string, _distDir?: string, postCSS?: boolean): Promise<void>;
}
//# sourceMappingURL=AbstractStage.d.ts.map
/**
 * Types for the build stage classes.
 * 
 * @category Types
 * 
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

import * as sass from 'sass';
import typescript from 'typescript';

import type {
    Json,
    Objects,
} from '@maddimathon/utility-typescript/types';

import {
    node,
    MessageMaker,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';

import type * as CLI from './CLI.js';
import type { Config } from './Config.js';

import type {
    FileSystem,
    ProjectConfig,
    Stage_Compiler,
} from '../lib/index.js';


/**
 * The required shape for every stage's arguments.
 */
export interface Args<
    SubStage extends string = string,
> {

    /**
     * Optional class argument overrides to use.
     */
    args: {
        console?: Partial<Console.Args>,
    };

    /**
     * Optional class instances to use.
     */
    objs: {
        cpl?: Stage_Compiler,
        fs?: FileSystem,
    };
};

/**
 * Type utilities for stage class argument objects.
 * 
 * @since ___PKG_VERSION___
 */
export namespace Args {

    /**
     * An object with an instance of each stage's args.
     *
     * Those that are optional only have abstract classes included in this
     * package (test, document).
     *
     * @expand
     */
    export type All = {
        build: Args.Build,
        compile: Args.Compile,
        document: Args.Document,
        package: Args.Package,
        release: Args.Release,
        snapshot: Args.Snapshot,
        test: Args.Test,
    };

    /**
     * The required shape for a build stage.
     */
    export interface Build<
        SubStage extends string = string,
    > extends Args<SubStage> { };

    /**
     * The required shape for a compile stage.
     */
    export interface Compile<
        SubStage extends string = string,
    > extends Args<SubStage> {

        /**
         * Whether to include this sub-stage.
         *
         * If an object, paths to files copied to the dist directory during
         * compile.
         * 
         * @default false
         */
        files: false | {

            /**
             * Paths relative to the project root — to copy to the dist
             * directory.
             */
            root?: string[];

            /**
             * Paths relative to the source directory — to copy to the dist
             * directory.
             */
            src?: string[];
        };

        /**
         * Whether to include this sub-stage.
         * 
         * @default true
         */
        scss: boolean;

        /**
         * Whether to include this sub-stage.
         * 
         * @default true
         */
        ts: boolean;
    };

    /**
     * The required shape for a document stage.
     */
    export interface Document<
        SubStage extends string = string,
    > extends Args<SubStage> { };

    /**
     * The required shape for a package stage.
     */
    export interface Package<
        SubStage extends string = string,
    > extends Args<SubStage> { };

    /**
     * The required shape for a release stage.
     */
    export interface Release<
        SubStage extends string = string,
    > extends Args<SubStage> { };

    /**
     * The required shape for a snapshot stage.
     */
    export interface Snapshot<
        SubStage extends string = string,
    > extends Args<SubStage> { };

    /**
     * The required shape for a test stage.
     */
    export interface Test<
        SubStage extends string = string,
    > extends Args<SubStage> { };
}

/**
 * Implementation of a single build stage class.
 *
 * For a type that matches the class instead of the object, see
 * {@link ClassType}.
 */
export interface Class<
    SubStage extends string = string,
    A extends Args = Args,
> {

    /**
     * A completed args object.
     * 
     * @category Args
     */
    readonly args: A;

    /**
     * The default args object.
     * 
     * @category Args
     */
    readonly ARGS_DEFAULT: Args;

    /**
     * Colour used for colour-coding this class.
     * 
     * @category Args
     */
    readonly clr: MessageMaker.Colour;

    /**
     * Complete project configuration.
     * 
     * @category Args
     */
    readonly config: Config.Class;

    /**
     * Instance used to send messages to the console.
     * 
     * @category Utilities
     */
    readonly log: Objects.Classify<Console>;

    /**
     * Name for this stage used for notices.
     * 
     * @category Args
     */
    readonly name: string;

    /**
     * Current CLI params.
     * 
     * @category Args
     */
    readonly params: CLI.Params;

    /**
     * All substage available in this stage.
     * 
     * @category Args
     */
    readonly subStages: SubStage[];

    /**
     * Runs the entire stage (asynchronously).
     *
     * **This method should probably not be overwritten after
     * {@link AbstractStage}.**
     *
     * @category Running
     */
    run(): Promise<void>;

    /**
     * Builds a complete version of this class' args, falling back to defaults
     * as needed.
     * 
     * @category Args
     * 
     * @see Class.ARGS_DEFAULT
     */
    buildArgs( args?: Partial<A> ): A;

    /**
     * Whether the given substage should be run according to the values of
     * {@link CLI.Params.only} and {@link CLI.Params.without}.
     *
     * @category Running
     *
     * @param subStage  Substage to check.
     * @param level     Depth level for this message (above the value of 
     *                  {@link CLI.Params.log-base-level}).
     *
     * @return  Whether to run this sub-stage.
     */
    isSubStageIncluded(
        subStage: SubStage,
        level: number,
    ): boolean;

    /**
     * Gets the paths from the config for the given dist sub directory.
     * 
     * @category Utilities
     * 
     * @param subDir  Sub-path to get.
     */
    getDistDir( subDir?: Config.Paths.SourceDirectory ): string;

    /**
     * Gets the paths from the config for the given src sub directory.
     * 
     * @category Utilities
     * 
     * @param subDir  Sub-path to get.
     */
    getSrcDir( subDir?: Config.Paths.SourceDirectory ): string | string[];

    /**
     * Prints a message to the console signalling the start or end of this build
     * stage.
     *
     * @category Running
     * 
     * @param which           Whether we are starting or ending.
     * @param watcherVersion  Optional. Whether to display the watcher version of the notice. Default false.
     */
    startEndNotice(
        which: "start" | "end" | null,
        watcherVersion?: boolean,
    ): void | Promise<void>;
};

/**
 * Type utilities for stage class objects.
 * 
 * @see {@link Stage.Class}
 * 
 * @since ___PKG_VERSION___
 */
export namespace Class {

    /**
     * An object with an instance of each stage's class.
     *
     * Those that are optional only have abstract classes included in this
     * package (test, document).
     *
     * @expand
     */
    export type All = {
        [ K in WithDefaultClass ]: Class;
    } & {
        [ K in WithAbstractClass ]?: Class;
    };

    export type Build = Class<SubStage.Build, Args.Build>;
    export type Compile = Class<SubStage.Compile, Args.Compile>;
    export type Document = Class<SubStage.Document, Args.Document>;
    export type Package = Class<SubStage.Package, Args.Package>;
    export type Release = Class<SubStage.Release, Args.Release>;
    export type Snapshot = Class<SubStage.Snapshot, Args.Snapshot>;
    export type Test = Class<SubStage.Test, Args.Test>;
}

/**
 * Any stage class compatible with this package.
 * 
 * @expand
 */
export type ClassType = ( new (
    config: ProjectConfig,
    params: CLI.Params,
    args: Partial<Args>,
) => Class );

/**
 * Any stage class compatible with this package.
 * 
 * @expand
 */
export type ClassTypeGeneric<
    SubStage extends string = string,
    A extends Args<SubStage> = Args<SubStage>,
    C extends Class<SubStage, A> = Class<SubStage, A>,
> = ( new (
    config: ProjectConfig,
    params: CLI.Params,
    args: Partial<A>,
) => C );

/**
 * Type utilities for stage class types.
 * 
 * @see {@link Stage.ClassType}
 * 
 * @since ___PKG_VERSION___
 */
export namespace ClassType {

    /**
     * An object with an instance of each stage's class.
     * 
     * @interface
     */
    export type All = {
        [ K in keyof Class.All ]: ClassType;
    };

    export type Build = ClassTypeGeneric<SubStage.Build, Args.Build, Class.Build>;
    export type Compile = ClassTypeGeneric<SubStage.Compile, Args.Compile, Class.Compile>;
    export type Document = ClassTypeGeneric<SubStage.Document, Args.Document, Class.Document>;
    export type Package = ClassTypeGeneric<SubStage.Package, Args.Package, Class.Package>;
    export type Release = ClassTypeGeneric<SubStage.Release, Args.Release, Class.Release>;
    export type Snapshot = ClassTypeGeneric<SubStage.Snapshot, Args.Snapshot, Class.Snapshot>;
    export type Test = ClassTypeGeneric<SubStage.Test, Args.Test, Class.Test>;
}

/**
 * Shape of the utility class for compiling file types.
 */
export interface Compiler {
};

/**
 * Type utilities for {@link Compiler} classes.
 * 
 * @see {@link Stage.ClassType}
 * 
 * @since ___PKG_VERSION___
 */
export namespace Compiler {

    /**
     * Optional configuration for {@link Compiler} classes.
     * 
     * @since ___PKG_VERSION___
     */
    export interface Args {

        /**
         * Optional default configuration to use when compiling sass.
         */
        sass: sass.Options<"sync">;

        /**
         * Optional default configuration to use when compiling typescript.
         */
        ts: typescript.CompilerOptions,

        /**
         * Optional default configuration for a tsConfig file.
         */
        tsConfig: Json.TsConfig;
    };
};

/**
 * Shape of the console utility class to be available in each stage.
 * 
 * @since ___PKG_VERSION___
 */
export interface Console {

    /**
     * Instance to use within the class.
     */
    readonly nc: node.NodeConsole;

    /**
     * Instance to use within the class.
     */
    readonly varDump: Console.VarInspect;

    /**
     * Outputs the given error message to the console.
     * 
     * @category Errors
     * 
     * @param msg       Error message(s).
     * @param level     Depth level for this message (above the value of 
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    error(
        msg: MessageMaker.BulkMsgs,
        level: number,
        msgArgs?: Partial<MessageMaker.MsgArgs>,
        timeArgs?: Partial<MessageMaker.MsgArgs>,
    ): void;

    /**
     * Prints a timestamped log message to the console.
     * 
     * @category Messagers
     * 
     * @see {@link AbstractStage.msgArgs}  Generates default arguments.
     * 
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of 
     *                  {@link Args.log-base-level}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    log(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        msgArgs?: Partial<MessageMaker.MsgArgs>,
        timeArgs?: Partial<MessageMaker.MsgArgs>,
    ): void;

    /**
     * Prints a timestamped log message to the console. Only if 
     * `{@link Stage.Args}.notice` is truthy.
     * 
     * @category Messagers
     * 
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     */
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link Stage.Args['log-base-level']}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    notice(
        msg: Parameters<Console[ 'log' ]>[ 0 ],
        level: Parameters<Console[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<Console[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<Console[ 'log' ]>[ 3 ],
    ): void;

    /**
     * Prints a timestamped log message to the console. Only if 
     * `{@link Stage.Args}.notice` is truthy.
     * 
     * @category Messagers
     */
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link Stage.Args['log-base-level']}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    progress(
        msg: Parameters<Console[ 'log' ]>[ 0 ],
        level: Parameters<Console[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<Console[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<Console[ 'log' ]>[ 3 ],
    ): void;

    /**
     * Method for printing a log message to the console. Only if 
     * `{@link Stage.Args}.verbose` is truthy.
     * 
     * Alias for {@link AbstractStage.progressLog}.
     * 
     * @category Messagers
     */
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link Stage.Args['log-base-level']}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    verbose(
        msg: Parameters<Console[ 'log' ]>[ 0 ],
        level: Parameters<Console[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<Console[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<Console[ 'log' ]>[ 3 ],
    ): void;
};

/**
 * Type utilities for {@link Console} classes.
 * 
 * @see {@link Stage.ClassType}
 * 
 * @since ___PKG_VERSION___
 */
export namespace Console {

    /**
     * Optional configuration for {@link Console} classes.
     * 
     * @since ___PKG_VERSION___
     */
    export interface Args {

        /**
         * Colour used for colour-coding the stage.
         */
        clr: MessageMaker.Colour;

        /**
         * Arguments passed to the {@link node.NodeConsole} constructor.
         */
        nc: Objects.RecursivePartial<node.NodeConsole.Args>;
    };

    /**
     * Shape of the vardump utility class to be available in each
     * {@link Console}.
     */
    export interface VarInspect {

        /**
         * Prints a timestamped log message to the console.
         * 
         * @category Messagers
         * 
         * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
         * 
         * @param variable  Variable to inspect.
         */
        //  * @param level     Depth level for this message (above the value of 
        //  *                  {@link Stage.Args['log-base-level']}).
        //  * @param msgArgs   Optional. Argument overrides for the message.
        //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
        log(
            variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
            level: Parameters<Console[ 'log' ]>[ 1 ],
            msgArgs?: Parameters<Console[ 'log' ]>[ 2 ],
            timeArgs?: Parameters<Console[ 'log' ]>[ 3 ],
        ): void;

        /**
         * Prints a timestamped log message to the console. Only if 
         * `{@link Stage.Args}.notice` is truthy.
         * 
         * @category Messagers
         * 
         * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
         */
        //  * 
        //  * @param variable  Variable to inspect.
        //  * @param level     Depth level for this message (above the value of 
        //  *                  {@link Stage.Args['log-base-level']}).
        //  * @param msgArgs   Optional. Argument overrides for the message.
        //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
        notice(
            variable: Parameters<Console.VarInspect[ 'log' ]>[ 0 ],
            level: Parameters<Console.VarInspect[ 'log' ]>[ 1 ],
            msgArgs?: Parameters<Console.VarInspect[ 'log' ]>[ 2 ],
            timeArgs?: Parameters<Console.VarInspect[ 'log' ]>[ 3 ],
        ): void;

        /**
         * Prints a timestamped log message to the console. Only if 
         * `{@link Stage.Args}.notice` is truthy.
         * 
         * @category Messagers
         * 
         * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
         */
        //  * 
        //  * @param variable  Variable to inspect.
        //  * @param level     Depth level for this message (above the value of 
        //  *                  {@link Stage.Args['log-base-level']}).
        //  * @param msgArgs   Optional. Argument overrides for the message.
        //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
        progress(
            variable: Parameters<Console.VarInspect[ 'log' ]>[ 0 ],
            level: Parameters<Console.VarInspect[ 'log' ]>[ 1 ],
            msgArgs?: Parameters<Console.VarInspect[ 'log' ]>[ 2 ],
            timeArgs?: Parameters<Console.VarInspect[ 'log' ]>[ 3 ],
        ): void;

        /**
         * Method for printing a log message to the console. Only if 
         * `{@link Stage.Args}.verbose` is truthy.
         * 
         * Alias for {@link AbstractStage.progressLog}.
         * 
         * @category Messagers
         */
        //  * 
        //  * @param variable  Variable to inspect.
        //  * @param level     Depth level for this message (above the value of 
        //  *                  {@link Stage.Args['log-base-level']}).
        //  * @param msgArgs   Optional. Argument overrides for the message.
        //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
        verbose(
            variable: Parameters<Console.VarInspect[ 'log' ]>[ 0 ],
            level: Parameters<Console.VarInspect[ 'log' ]>[ 1 ],
            msgArgs?: Parameters<Console.VarInspect[ 'log' ]>[ 2 ],
            timeArgs?: Parameters<Console.VarInspect[ 'log' ]>[ 3 ],
        ): void;
    };
};

/**
 * Any stage class compatible with this package.
 * 
 * These are all lowercase on purpose.
 * 
 * @expand
 */
export type Name =
    | "snapshot"
    | "compile"
    | "test"
    | "document"
    | "build"
    | "package"
    | "release";

/**
 * Default substage names.
 * 
 * @see {@link SubStage} 
 */
export namespace SubStage {

    /**
     * An object with each stage's substages.
     *
     * Those that are optional only have abstract classes included in this
     * package (test, document).
     *
     * @expand
     */
    export type All = {
        build: SubStage.Build,
        compile: SubStage.Compile,
        document: SubStage.Document,
        package: SubStage.Package,
        release: SubStage.Release,
        snapshot: SubStage.Snapshot,
        test: SubStage.Test,
    };

    /**
     * Default substage names for a build stage.
     */
    export type Build =
        | "compile"
        | "document"
        | "minimize"
        | "prettify"
        | "replace"
        | "test";

    /**
     * Default substage names for a compile stage.
     */
    export type Compile = "files" | "scss" | "ts";

    /**
     * Default substage names for a document stage.
     */
    export type Document =
        | "SUBSTAGE_SIMPLE"
        | "SUBSTAGE_STAGE";

    /**
     * Default substage names for a package stage.
     */
    export type Package =
        | "build"
        | "copy"
        | "snapshot"
        | "zip";

    /**
     * Default substage names for a release stage.
     */
    export type Release =
        | "changelog"
        | "commit"
        | "github"
        | "package"
        | "replace"
        | "tidy";

    /**
     * Default substage names for a snapshot stage.
     */
    export type Snapshot = "snap";

    /**
     * Default substage names for a test stage.
     */
    export type Test = "scss" | "ts";
};

/**
 * Stages included in the library with default classes (i.e., required no
 * custom class creation).
 * 
 * @expand
 */
export type WithDefaultClass = Exclude<Name, WithAbstractClass>;

/**
 * Stages included in the library only as abstract classes.
 * 
 * @useDeclaredType
 * @expand
 */
export type WithAbstractClass = ( "document" | "test" | "test-string" ) & Name;
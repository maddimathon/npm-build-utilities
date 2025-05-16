/**
 * Types for the build stage classes.
 *
 * @category Types
 *
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/npm-build-utilities@0.1.0-draft
 * @license MIT
 */
import * as sass from 'sass';
import typescript from 'typescript';
import type { Json, Objects } from '@maddimathon/utility-typescript/types';
import { node, MessageMaker, VariableInspector } from '@maddimathon/utility-typescript/classes';
import type * as CLI from './CLI.js';
import type { Config } from './Config.js';
import type { ProjectConfig, Stage_Compiler } from '../lib/index.js';
/**
 * The required shape for every stage's arguments.
 */
export interface Args<SubStage extends string = string> {
    /**
     * Optional class argument overrides to use.
     */
    args: {
        console?: Partial<Console.Args>;
    };
    /**
     * Optional class instances to use.
     */
    objs: {
        cpl?: Stage_Compiler;
        fs?: node.NodeFiles;
    };
}
/**
 * Type utilities for stage class argument objects.
 *
 * @since 0.1.0-draft
 */
export declare namespace Args {
    /**
     * An object with an instance of each stage's args.
     *
     * Those that are optional only have abstract classes included in this
     * package (test, document).
     *
     * @expand
     */
    type All = {
        build: Args.Build;
        compile: Args.Compile;
        document: Args.Document;
        package: Args.Package;
        release: Args.Release;
        snapshot: Args.Snapshot;
        test: Args.Test;
    };
    /**
     * The required shape for a build stage.
     */
    interface Build<SubStage extends string = string> extends Args<SubStage> {
    }
    /**
     * The required shape for a compile stage.
     */
    interface Compile<SubStage extends string = string> extends Args<SubStage> {
    }
    /**
     * The required shape for a document stage.
     */
    interface Document<SubStage extends string = string> extends Args<SubStage> {
    }
    /**
     * The required shape for a package stage.
     */
    interface Package<SubStage extends string = string> extends Args<SubStage> {
    }
    /**
     * The required shape for a release stage.
     */
    interface Release<SubStage extends string = string> extends Args<SubStage> {
    }
    /**
     * The required shape for a snapshot stage.
     */
    interface Snapshot<SubStage extends string = string> extends Args<SubStage> {
    }
    /**
     * The required shape for a test stage.
     */
    interface Test<SubStage extends string = string> extends Args<SubStage> {
    }
}
/**
 * Implementation of a single build stage class.
 *
 * For a type that matches the class instead of the object, see
 * {@link ClassType}.
 */
export interface Class<SubStage extends string = string, A extends Args = Args> {
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
    buildArgs(args?: Partial<A>): A;
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
    isSubStageIncluded(subStage: SubStage, level: number): boolean;
    /**
     * Gets the paths from the config for the given dist sub directory.
     *
     * @category Utilities
     *
     * @param subDir  Sub-path to get.
     */
    getDistDir(subDir?: Config.SourceDirectory): string;
    /**
     * Gets the paths from the config for the given src sub directory.
     *
     * @category Utilities
     *
     * @param subDir  Sub-path to get.
     */
    getSrcDir(subDir: Config.SourceDirectory): string[];
    /**
     * Prints a message to the console signalling the start or end of this build
     * stage.
     *
     * @category Running
     *
     * @param which           Whether we are starting or ending.
     * @param watcherVersion  Optional. Whether to display the watcher version of the notice. Default false.
     */
    startEndNotice(which: "start" | "end" | null, watcherVersion?: boolean): void | Promise<void>;
}
/**
 * Type utilities for stage class objects.
 *
 * @see {@link Stage.Class}
 *
 * @since 0.1.0-draft
 */
export declare namespace Class {
    /**
     * An object with an instance of each stage's class.
     *
     * Those that are optional only have abstract classes included in this
     * package (test, document).
     *
     * @expand
     */
    type All = {
        [K in WithDefaultClass]: Class;
    } & {
        [K in WithAbstractClass]?: Class;
    };
    type Build = Class<SubStage.Build, Args.Build>;
    type Compile = Class<SubStage.Compile, Args.Compile>;
    type Document = Class<SubStage.Document, Args.Document>;
    type Package = Class<SubStage.Package, Args.Package>;
    type Release = Class<SubStage.Release, Args.Release>;
    type Snapshot = Class<SubStage.Snapshot, Args.Snapshot>;
    type Test = Class<SubStage.Test, Args.Test>;
}
/**
 * Any stage class compatible with this package.
 *
 * @expand
 */
export type ClassType<C extends Class = Class, A extends Args = Args> = (new (config: ProjectConfig, params: CLI.Params, args?: Partial<A>) => C);
/**
 * Type utilities for stage class types.
 *
 * @see {@link Stage.ClassType}
 *
 * @since 0.1.0-draft
 */
export declare namespace ClassType {
    /**
     * An object with an instance of each stage's class.
     *
     * Those that are optional only have abstract classes included in this
     * package (test, document).
     *
     * @interface
     */
    type All = {
        [K in keyof Class.All]: ClassType;
    };
    type Build = ClassType<Class<SubStage.Build, Args.Build>, Args.Build>;
    type Compile = ClassType<Class<SubStage.Compile, Args.Compile>, Args.Compile>;
    type Document = ClassType<Class<SubStage.Document, Args.Document>, Args.Document>;
    type Package = ClassType<Class<SubStage.Package, Args.Package>, Args.Package>;
    type Release = ClassType<Class<SubStage.Release, Args.Release>, Args.Release>;
    type Snapshot = ClassType<Class<SubStage.Snapshot, Args.Snapshot>, Args.Snapshot>;
    type Test = ClassType<Class<SubStage.Test, Args.Test>, Args.Test>;
}
/**
 * Shape of the utility class for compiling file types.
 */
export interface Compiler {
}
/**
 * Type utilities for {@link Compiler} classes.
 *
 * @see {@link Stage.ClassType}
 *
 * @since 0.1.0-draft
 */
export declare namespace Compiler {
    /**
     * Optional configuration for {@link Compiler} classes.
     *
     * @since 0.1.0-draft
     */
    interface Args {
        /**
         * Optional default configuration to use when compiling sass.
         */
        sass: sass.Options<"sync">;
        /**
         * Optional default configuration to use when compiling typescript.
         */
        ts: typescript.CompilerOptions;
        /**
         * Optional default configuration for a tsConfig file.
         */
        tsConfig: Json.TsConfig;
    }
}
/**
 * Shape of the console utility class to be available in each stage.
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
     * Prints a timestamped log message to the console. Only if
     * `{@link Stage.Args}.notice` is truthy.
     *
     * @category Messagers
     *
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     *
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    notice(msg: Parameters<node.NodeConsole['timestampLog']>[0], level: number, msgArgs?: Parameters<node.NodeConsole['timestampLog']>[1], timeArgs?: Parameters<node.NodeConsole['timestampLog']>[2]): void;
    /**
     * Prints a timestamped log message to the console. Only if
     * `{@link Stage.Args}.notice` is truthy.
     *
     * @category Messagers
     *
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     *
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    progress(msg: Parameters<node.NodeConsole['timestampLog']>[0], level: number, msgArgs?: Parameters<node.NodeConsole['timestampLog']>[1], timeArgs?: Parameters<node.NodeConsole['timestampLog']>[2]): void;
    /**
     * Method for printing a log message to the console. Only if
     * `{@link Stage.Args}.verbose` is truthy.
     *
     * Alias for {@link AbstractStage.progressLog}.
     *
     * @category Messagers
     *
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    verbose(msg: Parameters<node.NodeConsole['timestampLog']>[0], level: number, msgArgs?: Parameters<node.NodeConsole['timestampLog']>[1], timeArgs?: Parameters<node.NodeConsole['timestampLog']>[2]): void;
}
/**
 * Type utilities for {@link Console} classes.
 *
 * @see {@link Stage.ClassType}
 *
 * @since 0.1.0-draft
 */
export declare namespace Console {
    /**
     * Optional configuration for {@link Console} classes.
     *
     * @since 0.1.0-draft
     */
    interface Args {
        /**
         * Colour used for colour-coding the stage.
         */
        clr: MessageMaker.Colour;
        /**
         * Arguments passed to the {@link node.NodeConsole} constructor.
         */
        nc: Objects.RecursivePartial<node.NodeConsole.Args>;
    }
    /**
     * Shape of the vardump utility class to be available in each
     * {@link Console}.
     */
    interface VarInspect {
        /**
         * Prints a timestamped log message to the console. Only if
         * `{@link Stage.Args}.notice` is truthy.
         *
         * @category Messagers
         *
         * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
         *
         * @param variable  Variable to inspect.
        //  * @param level     Depth level for this message (above the value of
        //  *                  {@link Stage.Args['log-base-level']}).
        //  * @param msgArgs   Optional. Argument overrides for the message.
        //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
         */
        notice(variable: ConstructorParameters<typeof VariableInspector>[0], level: Parameters<Console['notice']>[1], msgArgs?: Parameters<Console['notice']>[2], timeArgs?: Parameters<Console['notice']>[3]): void;
        /**
         * Prints a timestamped log message to the console. Only if
         * `{@link Stage.Args}.notice` is truthy.
         *
         * @category Messagers
         *
         * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
         *
         * @param variable  Variable to inspect.
        //  * @param level     Depth level for this message (above the value of
        //  *                  {@link Stage.Args['log-base-level']}).
        //  * @param msgArgs   Optional. Argument overrides for the message.
        //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
         */
        progress(variable: ConstructorParameters<typeof VariableInspector>[0], level: Parameters<Console['progress']>[1], msgArgs?: Parameters<Console['progress']>[2], timeArgs?: Parameters<Console['progress']>[3]): void;
        /**
         * Method for printing a log message to the console. Only if
         * `{@link Stage.Args}.verbose` is truthy.
         *
         * Alias for {@link AbstractStage.progressLog}.
         *
         * @category Messagers
         *
         * @param variable  Variable to inspect.
        //  * @param level     Depth level for this message (above the value of
        //  *                  {@link Stage.Args['log-base-level']}).
        //  * @param msgArgs   Optional. Argument overrides for the message.
        //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
         */
        verbose(variable: ConstructorParameters<typeof VariableInspector>[0], level: Parameters<Console['verbose']>[1], msgArgs?: Parameters<Console['verbose']>[2], timeArgs?: Parameters<Console['verbose']>[3]): void;
    }
}
/**
 * Any stage class compatible with this package.
 *
 * These are all lowercase on purpose.
 *
 * @expand
 */
export type Name = "snapshot" | "compile" | "test" | "document" | "build" | "package" | "release";
/**
 * Default substage names.
 *
 * @see {@link SubStage}
 */
export declare namespace SubStage {
    /**
     * An object with each stage's substages.
     *
     * Those that are optional only have abstract classes included in this
     * package (test, document).
     *
     * @expand
     */
    type All = {
        build: SubStage.Build;
        compile: SubStage.Compile;
        document: SubStage.Document;
        package: SubStage.Package;
        release: SubStage.Release;
        snapshot: SubStage.Snapshot;
        test: SubStage.Test;
    };
    /**
     * Default substage names for a build stage.
     */
    type Build = "compile" | "document" | "minimize" | "prettify" | "replace" | "test";
    /**
     * Default substage names for a compile stage.
     */
    type Compile = "files" | "scss" | "ts";
    /**
     * Default substage names for a document stage.
     */
    type Document = "SUBSTAGE_SIMPLE" | "SUBSTAGE_STAGE";
    /**
     * Default substage names for a package stage.
     */
    type Package = "build" | "copy" | "snapshot" | "zip";
    /**
     * Default substage names for a release stage.
     */
    type Release = "changelog" | "commit" | "github" | "package" | "replace" | "tidy";
    /**
     * Default substage names for a snapshot stage.
     */
    type Snapshot = "snap";
    /**
     * Default substage names for a test stage.
     */
    type Test = "scss" | "ts";
}
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
export type WithAbstractClass = ("document" | "test" | "test-string") & Name;
//# sourceMappingURL=Stage.d.ts.map
/**
 * Types for the build stage classes.
 *
 * @category Types
 *
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-alpha.draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import * as sass from 'sass';
import * as typeDoc from "typedoc";
import typescript from 'typescript';
import type { Json, Node } from '@maddimathon/utility-typescript/types';
import { MessageMaker } from '@maddimathon/utility-typescript/classes';
import type * as CLI from './CLI.js';
import type { Config } from './Config.js';
import type { FileSystem, ProjectConfig } from '../lib/index.js';
import type { SemVer } from '../lib/@internal/index.js';
import type { Stage_Compiler } from '../lib/02-utils/classes/Stage_Compiler.js';
import type { FileSystemType } from './FileSystemType.js';
import type { Logger } from './Logger.js';
/**
 * The required shape for every stage's arguments.
 */
export interface Args<SubStage extends string = string> {
    /**
     * Optional class instances to use.
     */
    objs: {
        compiler?: Stage_Compiler;
        fs?: FileSystem;
    };
}
/**
 * Type utilities for stage class argument objects.
 *
 * @since 0.1.0-alpha.draft
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
     *
     * @see {@link BuildStage.ARGS_DEFAULT}  For defaults.
     */
    interface Build<SubStage extends string = string> extends Args<SubStage> {
        /**
         * Whether to include this sub-stage.
         */
        compile: boolean;
        /**
         * Whether to include this sub-stage.
         */
        document: boolean;
        /**
         * Whether to include this sub-stage.
         */
        minimize: false | Build.Minimize | ((stage: Class) => Build.Minimize);
        /**
         * Whether to include this sub-stage.
         *
         * The first tuple item is an array of file globs and the second item is
         * args to pass to the {@link FileSystem.prettier} method, if any.
         */
        prettify: false | Build.Prettify | ((stage: Class) => Build.Prettify);
        /**
         * Whether to include this sub-stage, or the configuration if so.
         */
        replace: false | ((stage: Class) => {
            /**
             * File globs for making {@link Config.Replace.current}
             * replacements.
             */
            current?: string[];
            /**
             * File globs to ignore while making {@link Config.Replace}
             * replacements.
             */
            ignore?: string[];
            /**
             * File globs for making {@link Config.Replace.package}
             * replacements.
             */
            package?: string[];
        });
        /**
         * Whether to include this sub-stage.
         */
        test: boolean;
    }
    /**
     * Types for the {@link Args.Build} interface.
     */
    namespace Build {
        /**
         * Arguments for the {@link BuildStage.minimize} substage.
         *
         * String array should be globs to minimize.
         *
         * @interface
         */
        type Minimize = {
            [K in FileSystemType.Minify.Format]?: false | undefined | string[] | {
                globs: string[];
                ignore?: string[];
                args?: Partial<FileSystemType.Minify.Args>;
                /**
                 * @see {@link FileSystem.minimize}  Uses this renamer.
                 */
                renamer?: ((path: string) => string);
            };
        };
        /**
         * Arguments for the {@link BuildStage.prettify} substage.
         *
         * @interface
         */
        type Prettify = {
            [K in FileSystemType.Prettier.Format]?: false | undefined | [string[]] | [string[], undefined | Partial<FileSystemType.Prettier.Args>] | readonly [readonly string[]] | readonly [readonly string[], undefined | Partial<FileSystemType.Prettier.Args>];
        };
    }
    /**
     * The required shape for a compile stage.
     *
     * @see {@link CompileStage.ARGS_DEFAULT}  For defaults.
     */
    interface Compile<SubStage extends string = string> extends Args<SubStage> {
        /**
         * Whether to include this sub-stage.
         *
         * If an object, paths to files copied to the dist directory during
         * compile.
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
         */
        scss: boolean;
        /**
         * Whether to include this sub-stage.
         */
        ts: boolean;
    }
    /**
     * The required shape for a document stage.
     *
     * @see {@link DocumentStage.ARGS_DEFAULT}  For defaults.
     */
    interface Document<SubStage extends string = string> extends Args<SubStage> {
        /**
         * Passed to typeDoc options.
         *
         * If null, entry point is taken from package.json’s `main`.
         */
        entryPoints: string[] | null;
        /**
         * Whether to include this sub-stage, or the configuration if so.
         */
        replace: false | ((_stage: Class) => {
            /**
             * File globs for making {@link Config.Replace.current}
             * replacements.
             */
            current?: string[];
            /**
             * File globs to ignore while making {@link Config.Replace}
             * replacements.
             */
            ignore?: string[];
            /**
             * File globs for making {@link Config.Replace.package}
             * replacements.
             */
            package?: string[];
        });
        /**
         * Default configuration for typeDoc.  Some configuration is added in
         * {@link DocumentStage.typeDoc}.
         */
        typeDoc: Partial<Omit<typeDoc.TypeDocOptions, "entryPoints">> | ((_stage: Class) => Partial<Omit<typeDoc.TypeDocOptions, "entryPoints">>);
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
     *
     * @see {@link SnapshotStage.ARGS_DEFAULT}  For defaults.
     */
    interface Snapshot<SubStage extends string = string> extends Args<SubStage> {
        /**
         * Globs to ignore when putting together the snapshot.
         */
        ignoreGlobs: string[] | ((stage: Class) => string[]);
    }
    /**
     * The required shape for a test stage.
     *
     * @see {@link TestStage.ARGS_DEFAULT}  For defaults.
     */
    interface Test<SubStage extends string = string> extends Args<SubStage> {
        js: false | {
            /**
             * File globs to be removed after tests are complete.
             */
            tidy: string[];
        };
        scss: boolean;
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
    readonly config: Config.Internal;
    /**
     * Instance used to compile files from the src directory.
     *
     * @category Utilities
     */
    readonly compiler: Compiler;
    /**
     * Instance used to send messages to the console.
     *
     * @category Utilities
     */
    readonly console: Logger;
    /**
     * Instance used to deal with files and paths.
     *
     * @category Utilities
     */
    readonly fs: FileSystem;
    /**
     * Wheather the current project version is a draft (e.g., this is not a
     * non-dryrun release).
     *
     * @category Project
     */
    readonly isDraftVersion: boolean;
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
     * Current value of the package.json file for this project.
     *
     * @category Project
     */
    readonly pkg: Node.PackageJson;
    /**
     * All substage available in this stage.
     *
     * @category Args
     */
    readonly subStages: SubStage[];
    /**
     * Current version object.
     *
     * @category Project
     */
    readonly version: SemVer;
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
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     */
    getDistDir(subDir?: Config.Paths.SourceDirectory, ...subpaths: string[]): string;
    /**
     * Gets an absolute path to the {@link Config.Paths['scripts']} directories.
     *
     * @category Utilities
     *
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     */
    getScriptsPath(subDir?: "logs", ...subpaths: string[]): string;
    /**
     * Gets the paths from the config for the given src sub directory.
     *
     * @category Utilities
     *
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     */
    getSrcDir(subDir: Config.Paths.SourceDirectory, ...subpaths: string[]): string[];
    getSrcDir(subDir?: undefined, ...subpaths: string[]): string;
    getSrcDir(subDir?: Config.Paths.SourceDirectory, ...subpaths: string[]): string | string[];
    /**
     * Prints a message to the console signalling the start or end of this build
     * stage.
     *
     * @category Running
     *
     * @param which           Whether we are starting or ending.
     * @param watcherVersion  Optional. Whether to display the watcher version of the notice **if applicable**. Default false.
     * @param args            Optional. Message argument overrides.
     */
    startEndNotice(which: "start" | "end" | null, watcherVersion?: boolean, args?: Partial<MessageMaker.BulkMsgArgs>): void | Promise<void>;
}
/**
 * Type utilities for stage class objects.
 *
 * @see {@link Stage.Class}
 *
 * @since 0.1.0-alpha.draft
 */
export declare namespace Class {
    /**
     * An object with an instance of each stage's class.
     *
     * Those that are optional only have abstract classes included in this
     * package (test, document).
     *
     * @interface
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
export type ClassType = (new (config: ProjectConfig, params: CLI.Params, args: Partial<Args>, _pkg?: Node.PackageJson, _version?: SemVer) => Class);
/**
 * Any stage class compatible with this package.
 *
 * @expand
 */
export type ClassTypeGeneric<SubStage extends string = string, A extends Args<SubStage> = Args<SubStage>, C extends Class<SubStage, A> = Class<SubStage, A>> = (new (config: ProjectConfig, params: CLI.Params, args: Partial<A>) => C);
/**
 * Type utilities for stage class types.
 *
 * @see {@link ClassType}
 *
 * @since 0.1.0-alpha.draft
 */
export declare namespace ClassType {
    /**
     * An object with an instance of each stage's class.
     *
     * @interface
     */
    type All = {
        [K in keyof Class.All]: ClassType;
    };
    type Build = ClassTypeGeneric<SubStage.Build, Args.Build, Class.Build>;
    type Compile = ClassTypeGeneric<SubStage.Compile, Args.Compile, Class.Compile>;
    type Document = ClassTypeGeneric<SubStage.Document, Args.Document, Class.Document>;
    type Package = ClassTypeGeneric<SubStage.Package, Args.Package, Class.Package>;
    type Release = ClassTypeGeneric<SubStage.Release, Args.Release, Class.Release>;
    type Snapshot = ClassTypeGeneric<SubStage.Snapshot, Args.Snapshot, Class.Snapshot>;
    type Test = ClassTypeGeneric<SubStage.Test, Args.Test, Class.Test>;
}
/**
 * Shape of the utility class for compiling file types.
 */
export interface Compiler {
    /**
     * Default TS config file.
     */
    tsConfig: Json.TsConfig;
}
/**
 * Type utilities for {@link Compiler} classes.
 *
 * @see {@link Stage.ClassType}
 *
 * @since 0.1.0-alpha.draft
 */
export declare namespace Compiler {
    /**
     * Optional configuration for {@link Compiler} classes.
     *
     * @since 0.1.0-alpha.draft
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
     * @interface
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
    type Document = "replace" | "typeDoc";
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
    type Test = "scss" | "js";
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
 * @expand
 */
export type WithAbstractClass = (never) & Name;
//# sourceMappingURL=Stage.d.ts.map
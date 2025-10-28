/**
 * Types for the build stage classes.
 * 
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type postcss from 'postcss';
import type * as postcss_PresetEnv from 'postcss-preset-env';

import type * as sass from 'sass-embedded';
import type * as typeDoc from "typedoc";

import type {
    Json,
    Objects,
} from '@maddimathon/utility-typescript/types';

import type {
    MessageMaker,
} from '@maddimathon/utility-typescript/classes';

import type * as CLI from './CLI.js';
import type { Config } from './Config.js';

import type {
    SemVer,
} from '../lib/@internal/classes/index.js';

import type {
    FileSystem,
} from '../lib/00-universal/classes/index.js';

// import type {
// } from '../lib/01-config/classes/index.js';

import type { Stage_Compiler } from '../lib/02-utils/classes/Stage_Compiler.js';

import type { FileSystemType } from './FileSystemType.js';
import type { Logger } from './Logger.js';


/**
 * Implementation of a single build stage class.
 *
 * For a type that matches the class instead of the object, see
 * {@link Stage.Class}.
 * 
 * @category Types
 *
 * @typeParam T_Args      Complete {@link Stage.args} object for this stage.
 * @typeParam T_SubStage  String literal of all {@link Stage.subStages} options.
 *
 * @since 0.1.0-alpha
 */
export interface Stage<
    T_Args extends Stage.Args = Stage.Args,
    T_SubStage extends string = string,
> {

    /**
     * A completed args object for this instance.
     * 
     * @category Config
     */
    readonly args: T_Args;

    /**
     * Default args for this stage.
     * 
     * @category Config
     */
    readonly ARGS_DEFAULT: T_Args;

    /**
     * Colour used for colour-coding this stage.
     * 
     * @category Config
     */
    readonly clr: MessageMaker.Colour;

    /**
     * Complete project configuration.
     * 
     * @category Config
     */
    readonly config: Config.Internal;

    /**
     * Instance used to compile files from the src directory.
     * 
     * @category Utilities
     */
    readonly compiler: Stage.Compiler;

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
     * @category Config
     */
    readonly name: string;

    /**
     * Current CLI params.
     * 
     * @category Config
     */
    readonly params: CLI.Params;

    /**
     * Current value of the package.json file for this project.
     * 
     * @category Project
     */
    readonly pkg: Json.PackageJson;

    /**
     * All sub-stages to run in this stage (in order).
     * 
     * @category Config
     */
    readonly subStages: T_SubStage[];

    /**
     * Current version object for the project.
     * 
     * @category Project
     */
    readonly version: SemVer;

    /**
     * Builds a complete version of this class' args, falling back to defaults
     * as needed.
     * 
     * @category Config
     * 
     * @see {@link Stage.ARGS_DEFAULT}
     */
    buildArgs( args?: Partial<T_Args> ): T_Args;

    /**
     * Gets the paths from the config for the given dist sub directory.
     * 
     * @category Utilities
     * 
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     */
    getDistDir(
        subDir?: Config.Paths.SourceDirectory,
        ...subpaths: string[]
    ): string;


    /**
     * Gets an absolute path to the {@link Config.Paths.scripts} directories.
     * 
     * @category Utilities
     * 
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     */
    getScriptsPath(
        subDir?: "logs",
        ...subpaths: string[]
    ): string;


    /**
     * If there's a subdir, the return will be an array of strings.
     * 
     * @category Utilities
     * 
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     */
    getSrcDir(
        subDir: Config.Paths.SourceDirectory,
        ...subpaths: string[]
    ): string[];

    /**
     * If there's no subdir, the return will be a string.
     * 
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     */
    getSrcDir(
        subDir?: undefined,
        ...subpaths: string[]
    ): string;

    /**
     * Gets the paths from the config for the given src sub directory.
     * 
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     */
    getSrcDir(
        subDir?: Config.Paths.SourceDirectory,
        ...subpaths: string[]
    ): string | string[];

    /**
     * Whether the given substage should be run according to the values of
     * {@link CLI.Params.only} and {@link CLI.Params.without}.
     *
     * @category Running
     *
     * @param subStage  Substage to check.
     * @param level     Depth level for this message.
     *
     * @return  Whether to run this sub-stage.
     */
    isSubStageIncluded(
        subStage: T_SubStage,
        level: number,
    ): boolean;

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
     * Prints a message to the console signalling the start or end of this build
     * stage.
     *
     * @category Running
     * 
     * @param which           Whether we are starting or ending.
     * @param watcherVersion  Whether to display the watcher version of the message **if applicable**. Default false.
     * @param args            Message argument overrides.
     */
    startEndNotice(
        which: "start" | "end" | null,
        watcherVersion?: boolean,
        args?: Partial<MessageMaker.BulkMsgArgs>,
    ): void | Promise<void>;

    /**
     * Handles uncaught errors after this stage is completely constructed (set
     * in the {@link Project.run} method).
     *
     * @category Errors
     * 
     * @param error  Uncaught exception to handle.
     * 
     * @since 0.2.0-alpha
     */
    uncaughtErrorListener: ( error: unknown ) => void;
};

/**
 * Utility types for the {@link Stage} interface.
 * 
 * @category Types
 * 
 * @since 0.1.0-alpha
 */
export namespace Stage {

    /**
     * Any stage class compatible with this package.
     * 
     * These are all lowercase on purpose.
     * 
     * @since 0.1.0-alpha
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
     * An object with an instance of each stage's class.
     *
     * Those that are optional only have abstract classes included in this
     * package (test, document).
     * 
     * @since 0.1.0-alpha
     * 
     * @interface
     */
    export type All = {
        [ K in Name ]: Stage;
    };

    /** 
     * Shape of the default {@link BuildStage} class.
     * 
     * @since 0.1.0-alpha
     */
    export type Build = Stage<Args.Build, SubStage.Build>;

    /** 
     * Shape of the default {@link CompileStage} class.
     * 
     * @since 0.1.0-alpha
     */
    export type Compile = Stage<Args.Compile, SubStage.Compile>;

    /** 
     * Shape of the default {@link DocumentStage} class.
     * 
     * @since 0.1.0-alpha
     */
    export type Document = Stage<Args.Document, SubStage.Document>;

    /** 
     * Shape of the default {@link PackageStage} class.
     * 
     * @since 0.1.0-alpha
     */
    export type Package = Stage<Args.Package, SubStage.Package>;

    /** 
     * Shape of the default {@link ReleaseStage} class.
     * 
     * @since 0.1.0-alpha
     */
    export type Release = Stage<Args.Release, SubStage.Release>;

    /** 
     * Shape of the default {@link SnapshotStage} class.
     * 
     * @since 0.1.0-alpha
     */
    export type Snapshot = Stage<Args.Snapshot, SubStage.Snapshot>;

    /** 
     * Shape of the default {@link TestStage} class.
     * 
     * @since 0.1.0-alpha
     */
    export type Test = Stage<Args.Test, SubStage.Test>;

    /**
     * The required shape for every stage's arguments.
     * 
     * @since 0.1.0-alpha
     */
    export interface Args {

        /**
         * Optional class instances to use.
         */
        utils: {
            compiler?: Stage_Compiler,
            fs?: FileSystem,
        };
    };

    /**
     * Type utilities for stage class argument objects.
     * 
     * @since 0.1.0-alpha
     */
    export namespace Args {

        /**
         * An object with an instance of each stage's args.
         *
         * Those that are optional only have abstract classes included in this
         * package (test, document).
         * 
         * @since 0.1.0-alpha
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
         * 
         * @see {@link BuildStage.ARGS_DEFAULT}  For defaults.
         * 
         * @since 0.1.0-alpha
         */
        export interface Build extends Args {

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
            minimize:
            | false
            | Build.Minimize
            | ( ( stage: Stage ) => Build.Minimize );

            /**
             * Whether to include this sub-stage.
             *
             * The first tuple item is an array of file globs and the second item is
             * args to pass to the {@link FileSystem.prettier} method, if any.
             */
            prettify:
            | false
            | Build.Prettify
            | ( ( stage: Stage ) => Build.Prettify );

            /**
             * Whether to include this sub-stage, or the configuration if so.
             */
            replace: false | ( ( stage: Stage ) => {

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
            } );

            /**
             * Whether to include this sub-stage.
             */
            test: boolean;
        };

        /**
         * Types for the {@link Args.Build} interface.
         * 
         * @since 0.1.0-alpha
         */
        export namespace Build {

            /**
             * Arguments for the {@link BuildStage.minimize} substage.
             * 
             * String array should be globs to minimize.
             * 
             * @since 0.1.0-alpha
             * 
             * @interface
             */
            export type Minimize = {
                [ K in FileSystemType.Minify.Format ]?:
                | false
                | undefined
                | string[]
                | {
                    globs: string[];
                    ignore?: string[];
                    args?: Partial<FileSystemType.Minify.Args>;

                    /** 
                     * @see {@link FileSystem.minimize}  Uses this renamer.
                     */
                    renamer?: ( ( path: string ) => string );
                }
            };

            /**
             * Arguments for the {@link BuildStage.prettify} substage.
             * 
             * @since 0.1.0-alpha
             * 
             * @interface
             */
            export type Prettify = {
                [ K in FileSystemType.Prettier.Format ]?:
                | false
                | undefined
                | [ string[] ]
                | [ string[], undefined | Partial<FileSystemType.Prettier.Args> ]
                | readonly [ readonly string[] ]
                | readonly [ readonly string[], undefined | Partial<FileSystemType.Prettier.Args> ]
            };
        }

        /**
         * Input options for files to copy during build stages.
         *
         * If a string, the string is the source file and will be copied to the
         * default dist directory.
         *
         * @since 0.3.0-alpha.1
         */
        export type CopyFilesInput = string | {

            /**
             * Source file path.
             */
            from: string;

            /**
             * File output path.
             */
            to?: string | null | undefined;
        };

        /**
         * The required shape for a compile stage.
         * 
         * @see {@link CompileStage.ARGS_DEFAULT}  For defaults.
         * 
         * @since 0.1.0-alpha
         */
        export interface Compile extends Args {

            /**
             * Whether to include this sub-stage.
             *
             * If an object, paths to files copied to the dist directory during
             * compile.
             *
             * @since 0.3.0-alpha.1 — Now using new {@link CopyFilesInput} type.
             */
            files: false | {

                /**
                 * Paths relative to the project root.
                 */
                root?: CopyFilesInput[];

                /**
                 * Paths relative to the source directory.
                 */
                src?: CopyFilesInput[];
            };

            /**
             * Whether to include this sub-stage.
             *
             * If an object, settings for steps within the sub-stage.
             * 
             * @since 0.2.0-alpha — Now can be an object to pass params.
             */
            scss: boolean | {

                /**
                 * Whether to run PostCSS on the compiled css.
                 */
                postCSS: boolean;
            };

            /**
             * Whether to include this sub-stage.
             */
            ts: boolean;
        };

        /**
         * The required shape for a document stage.
         * 
         * @see {@link DocumentStage.ARGS_DEFAULT}  For defaults.
         * 
         * @since 0.1.0-alpha
         */
        export interface Document extends Args {

            /**
             * Passed to typeDoc options.
             * 
             * If null, entry point is taken from package.json’s `main`.
             */
            entryPoints: string[] | null;

            /**
             * Whether to include this sub-stage, or the configuration if so.
             */
            replace: false | ( ( _stage: Stage ) => {

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
            } );

            /**
             * Default configuration for typeDoc.  Some configuration is added in
             * {@link DocumentStage.typeDoc}.
             */
            typeDoc:
            | Partial<Omit<typeDoc.TypeDocOptions, "entryPoints">>
            | ( ( _stage: Stage ) => Partial<Omit<typeDoc.TypeDocOptions, "entryPoints">> );
        };

        /**
         * The required shape for a package stage.
         * 
         * @see {@link PackageStage.ARGS_DEFAULT}  For defaults.
         * 
         * @since 0.1.0-alpha
         */
        export interface Package extends Args { };

        /**
         * The required shape for a release stage.
         * 
         * @see {@link ReleaseStage.ARGS_DEFAULT}  For defaults.
         * 
         * @since 0.1.0-alpha
         */
        export interface Release extends Args {

            /**
             * Files to add to commit after packaging but before release.
             */
            commit: null | (
                /**
                 * @param stage         Instance of the current stage (probably 
                 *                      {@link ReleaseStage}).
                 * @param defaultPaths  The default paths to add to the commit.
                 * 
                 * @return  All relative or absolute paths to add to the commit.
                 */
                ( stage: Stage, defaultPaths?: string[] ) => string[]
            );

            /**
             * Whether to include this sub-stage, or the configuration if so.
             */
            replace: false | ( ( stage: Stage ) => {

                /**
                 * File globs to ignore while making {@link Config.Replace}
                 * replacements.
                 */
                ignore?: string[];

                /**
                 * File globs for making {@link Config.Replace.package}
                 * replacements.
                 */
                package: string[];
            } );
        };

        /**
         * The required shape for a snapshot stage.
         * 
         * @see {@link SnapshotStage.ARGS_DEFAULT}  For defaults.
         * 
         * @since 0.1.0-alpha
         */
        export interface Snapshot extends Args {

            /**
             * Globs to ignore when putting together the snapshot.
             */
            ignoreGlobs: string[] | ( ( stage: Stage ) => string[] );
        };

        /**
         * The required shape for a test stage.
         * 
         * @see {@link TestStage.ARGS_DEFAULT}  For defaults.
         * 
         * @since 0.1.0-alpha
         */
        export interface Test extends Args {

            js: false | {

                /**
                 * File globs to be removed after tests are complete.
                 *
                 * @since 0.2.0-alpha — If undefined, these paths are set by {@link TestStage.tsConfigTidyPaths}.
                 */
                tidy?: string[];
            },

            scss: boolean;
        };
    }

    /**
     * Any stage class compatible with this package.
     * 
     * @since 0.1.0-alpha
     */
    export interface Class {
        new(
            config: Config.Class,
            params: CLI.Params,
            args: Partial<Args>,
            pkg?: Json.PackageJson,
            version?: SemVer,
        ): Stage;
    };

    /**
     * Any stage class compatible with this package.
     * 
     * @since 0.1.0-alpha
     */
    export interface ClassTypeGeneric<
        T_Instance extends Stage<T_Args, T_SubStage>,
        T_Args extends Args = Args,
        T_SubStage extends string = string,
    > {
        new(
            config: Config.Class,
            params: CLI.Params,
            args: Partial<T_Args>,
            pkg?: Json.PackageJson,
            version?: SemVer,
        ): T_Instance;
    };

    /**
     * Type utilities for stage class types.
     * 
     * @see {@link Class}
     * 
     * @since 0.1.0-alpha
     */
    export namespace Class {

        /**
         * An object with an instance of each stage's class.
         * 
         * @since 0.1.0-alpha
         * 
         * @interface
         */
        export type All = {
            [ K in Name ]: Class;
        };


        /**
         * Shape of the default {@link BuildStage} {@link Stage.Args}.
         * 
         * @since 0.1.0-alpha
         */
        export type Build = ClassTypeGeneric<Stage.Build, Args.Build>;

        /**
         * Shape of the default {@link CompileStage} {@link Stage.Args}.
         * 
         * @since 0.1.0-alpha
         */
        export type Compile = ClassTypeGeneric<Stage.Compile, Args.Compile>;

        /**
         * Shape of the default {@link DocumentStage} {@link Stage.Args}.
         * 
         * @since 0.1.0-alpha
         */
        export type Document = ClassTypeGeneric<Stage.Document, Args.Document>;

        /**
         * Shape of the default {@link PackageStage} {@link Stage.Args}.
         * 
         * @since 0.1.0-alpha
         */
        export type Package = ClassTypeGeneric<Stage.Package, Args.Package>;

        /**
         * Shape of the default {@link ReleaseStage} {@link Stage.Args}.
         * 
         * @since 0.1.0-alpha
         */
        export type Release = ClassTypeGeneric<Stage.Release, Args.Release>;

        /**
         * Shape of the default {@link SnapshotStage} {@link Stage.Args}.
         * 
         * @since 0.1.0-alpha
         */
        export type Snapshot = ClassTypeGeneric<Stage.Snapshot, Args.Snapshot>;

        /**
         * Shape of the default {@link TestStage} {@link Stage.Args}.
         * 
         * @since 0.1.0-alpha
         */
        export type Test = ClassTypeGeneric<Stage.Test, Args.Test>;
    }

    /**
     * Shape of the utility class for compiling file types.
     * 
     * @since 0.1.0-alpha
     */
    export interface Compiler {

        /**
         * A completed args object.
         */
        readonly args: Stage.Compiler.Args & {
            sass: Objects.Classify<Compiler.Args.Sass>;
        };

        /**
         * Default values for the args property.
         */
        readonly ARGS_DEFAULT: Stage.Compiler.Args;

        /**
         * Default TS config file.
         */
        readonly tsConfig: Json.TsConfig;

        /**
         * Process css with the 
         * {@link https://www.npmjs.com/package/postCSS | PostCSS npm package}.
         * 
         * @param paths        Css paths to process (from), and optionally where to output them (to).
         * @param level        Depth level for this message.
         * @param postCssOpts  Overrides for the configured PostCSS options in {@link Stage.Compiler.args}.
         * 
         * @since 0.2.0-alpha
         */
        postCSS(
            paths: {
                from: string,
                to?: string,
            }[],
            level: number,
            postCssOpts?: Compiler.Args.PostCSS,
        ): Promise<void>;

        /**
         * Compile scss using the 
         * {@link https://www.npmjs.com/package/sass | sass npm package}.
         * 
         * @param input     Scss input path.
         * @param output    Scss output path.
         * @param level     Depth level for this message.
         * @param sassOpts  Overrides for the configured sass options in {@link Stage.Compiler.args}.
         */
        scss(
            input: string,
            output: string,
            level: number,
            sassOpts?: Compiler.Args.Sass,
        ): Promise<string>;

        /**
         * Compile multiple scss files at once.
         * 
         * @param paths.input   Scss input path.
         * @param paths.output  Scss output path.
         * 
         * @param level         Depth level for this message.
         * @param sassOpts      Overrides for the configured sass options in {@link Stage.Compiler.args}.
         * 
         * @since 0.3.0-alpha.1
         */
        scssBulk(
            paths: {
                input: string;
                output: string;
            }[],
            level: number,
            sassOpts?: Compiler.Args.Sass,
        ): Promise<string[]>;

        /**
         * Compile typescript using the 
         * {@link https://www.npmjs.com/package/typescript | typescript npm package}.
         * 
         * @throws {@link StageError}  If the tsconfig file doesn’t exist.
         * 
         * @param tsconfig         Path to TS config json used to compile the project.
         * @param level            Depth level for this message.
         * @param errorIfNotFound  Whether to throw error if the tsconfig file is not found.
         */
        typescript(
            tsconfig: string,
            level: number,
            errorIfNotFound?: boolean,
        ): Promise<void>;
    };

    /**
     * Type utilities for {@link Compiler} classes.
     * 
     * @see {@link Stage.compiler}
     * 
     * @since 0.1.0-alpha
     */
    export namespace Compiler {

        /**
         * Optional configuration for {@link Compiler} classes.
         * 
         * @since 0.1.0-alpha
         */
        export interface Args {

            /**
             * {@inheritDoc Compiler.Args.PostCSS}
             * 
             * @since 0.2.0-alpha
             */
            postCSS: Args.PostCSS;

            /** {@inheritDoc Compiler.Args.Sass} */
            sass: Args.Sass;

            /**
             * Optional default configuration to use when compiling typescript.
             * 
             * @since 0.1.1 — Removed unused ts prop.
             * @since 0.1.3 — Added it back.
             */
            ts: {

                /**
                 * This is an array of globs, resolved relative to the tsconfig
                 * outDir, to be removed after compilation.
                 *
                 * Used, for example, to delete type-only javascript files.
                 */
                tidyGlobs?: string | string[];
            },
        };

        /**
         * Types for the {@link Compiler.Args} interface.
         * 
         * @since 0.2.0-alpha
         */
        export namespace Args {

            /**
             * Optional default configuration to use when processing css with
             * postCSS.
             *
             * @since 0.2.0-alpha
             */
            export interface PostCSS {

                /**
                 * Instantiated plugins to include.
                 *
                 * Note that postcss-preset-env is included according to
                 * {@link Args.presetEnv}.
                 */
                plugins?: postcss.AcceptedPlugin[];

                /**
                 * Configuration passed to the
                 * {@link https://www.npmjs.com/package/postcss-preset-env | postcss-preset-env plugin}.
                 *
                 * Gets merged with the defaults in
                 * {@link Stage.Compiler.ARGS_DEFAULT}. If false, this plugin is
                 * not used.
                 */
                presetEnv?: false | {
                    [ K in keyof postcss_PresetEnv.pluginOptions ]: postcss_PresetEnv.pluginOptions[ K ];
                };

                /**
                 * Options used with {@link postcss.process}.
                 */
                processor?: {

                    /**
                     * Remapping of {@link postcss.SourceMapOptions} for better
                     * typing and documentation.
                     */
                    map?: boolean | {
                        [ K in keyof postcss.SourceMapOptions ]: postcss.SourceMapOptions[ K ];
                    };

                    parser?: postcss.Parser | postcss.Syntax;
                };
            };

            /**
             * Optional default configuration to use when compiling sass.
             *
             * This is a simple re-mapping of
             * {@link sass.Options | sass.Options<"sync">} for better typing and
             * documentation.
             *
             * @since 0.1.0-alpha
             * @since 0.2.0-alpha — Moved to {@link Stage.Compiler.Args} namespace.
             *
             * @interface
             */
            export type Sass = {

                /**
                 * Whether to output the exact compile time.
                 * 
                 * @since 0.3.0-alpha.1
                 */
                benchmarkCompileTime?: boolean;

                /**
                 * Extra options that only apply to the CLI.
                 * 
                 * @since 0.3.0-alpha.1
                 */
                cli?: {
                    'embed-sources'?: boolean;
                    'embed-source-map'?: boolean;
                    'error-css'?: boolean;
                    indented?: boolean;
                    'source-map-urls'?: "absolute" | "relative";
                    update?: true;
                };

                /**
                 * Whether to compile via CLI rather than the JS API.
                 * 
                 * @since 0.3.0-alpha.1
                 */
                compileViaCLI?: boolean;

                /**
                 * Whether to ignore warnings thrown during packaging. If
                 * falsey, warnings will end the process.
                 *
                 * @since 0.3.0-alpha.3
                 */
                ignoreWarningsInPackaging?: string;

                /**
                 * Whether the current stage is the result of a watched file.
                 * 
                 * @since 0.3.0-alpha.1
                 */
                isWatchedUpdate?: boolean;

                /**
                 * Used to correct the output paths in the Sass stack trace.
                 * 
                 * @since 0.3.0-alpha.3
                 */
                pathToProjectRoot?: string;

            } & {
                [ K in keyof sass.Options<"async"> ]: sass.Options<"async">[ K ];
            };

            /**
             * Format used to transalate the sass options to a CLI-compatible
             * version.
             *
             * @since 0.3.0-alpha.1
             */
            export interface SassCLI {
                charset?: boolean;
                'embed-sources'?: boolean;
                'embed-source-map'?: boolean;
                'error-css'?: boolean;
                'fatal-deprecation'?: sass.Options<"async">[ 'fatalDeprecations' ];
                'future-deprecation'?: sass.Options<"async">[ 'futureDeprecations' ];
                indented?: boolean;
                'load-path'?: string | string[];
                'pkg-importer'?: "node";
                'source-map'?: boolean;
                'source-map-urls'?: "absolute" | "relative";
                style?: sass.Options<"async">[ 'style' ];
                update?: true;
            }
        }
    };

    /**
     * Default substage names.
     * 
     * @see {@link SubStage} 
     * 
     * @since 0.1.0-alpha
     */
    export namespace SubStage {

        /**
         * An object with each stage's substages.
         *
         * Those that are optional only have abstract classes included in this
         * package (test, document).
         * 
         * @since 0.1.0-alpha
         *
         * @interface
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
         * 
         * @since 0.1.0-alpha
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
         * 
         * @since 0.1.0-alpha
         */
        export type Compile = "files" | "scss" | "ts";

        /**
         * Default substage names for a document stage.
         * 
         * @since 0.1.0-alpha
         */
        export type Document = "replace" | "typeDoc";

        /**
         * Default substage names for a package stage.
         * 
         * @since 0.1.0-alpha
         */
        export type Package =
            | "build"
            | "copy"
            | "snapshot"
            | "zip";

        /**
         * Default substage names for a release stage.
         * 
         * @since 0.1.0-alpha
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
         * 
         * @since 0.1.0-alpha
         */
        export type Snapshot = "snap";

        /**
         * Default substage names for a test stage.
         * 
         * @since 0.1.0-alpha
         */
        export type Test = "scss" | "js";
    };
};
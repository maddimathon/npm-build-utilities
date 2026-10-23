/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.4
 * @license MIT
 */
import type { PackageJson, TsConfig } from '@maddimathon/utility-typescript/types';
import type { NodeFiles } from '@maddimathon/utility-typescript/node';
import { type MessageMaker } from '@maddimathon/utility-typescript';
import type { CLI, Config, Stage } from '../../../../types/index.js';
import { SemVer } from '../../../@internal/index.js';
import { MinimumStage } from './MinimumStage.js';
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
export declare abstract class AbstractStage<T_Args extends Stage.Args, T_SubStage extends string> extends MinimumStage<T_Args, T_SubStage> implements Stage.Complete<T_Args, T_SubStage> {
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
    /**
     * Takes an input tsconfig object and attempts to resolve and
     * include the values from any configs in its "extends".
     *
     * @category Typescript
     *
     * @since 0.3.0-beta
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     */
    writeTsConfig(outputPath: string, level: number, tsconfig: Partial<TsConfig>, { appendToLib, errorIfNotFound, ...args }?: Partial<NodeFiles.WriteFileArgs & {
        appendToLib: boolean | 'if-exists';
        errorIfNotFound: boolean;
    }>): Promise<string | false>;
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
     * @deprecated 0.3.0-beta.2 — Use {@link AbstractStage.customCopySubstage} instead.
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
     * @category Running
     *
     * @param subpath       The subdirectory, relative to src path.
     * @param distDir       Force a diffrent output directory than the auto-generated one.
     * @param opts          Additional options. See {@link AbstractStage.runCustomScssDirSubStage.DEFAULT_OPTS} for defaults.
     * @param logLevelBase  Base output level for log messages. Default 1.
     *
     * @since 0.1.4-alpha
     * @since 0.2.0-alpha — Added `postCSS` param and PostCSS compatibility.
     * @since 0.2.0-alpha.1 — Added `logLevelBase` param.
     * @since 0.2.0-alpha.2 — Changed `postCSS` param to `options` object param. Added returning output css filepaths. Improved some issues with the async compiling and sub-file finding.
     * @since 0.3.0-alpha.1 — Added `sassOpts` param and allowed `subpath` to be an array.
     * @since 0.3.0-beta.2 — Changed `sassOpts` param to a property in `options`. Renamed from runCustomScssDirSubStage to customScssSubstage and switched from a method to an object returning dir and demoDir methods.
     *
     * @deprecated 0.3.0-beta.2 — Use {@link AbstractStage.customScssSubstage.dir} instead.
     *
     * @experimental
     */
    protected runCustomScssDirSubStage(subpath: string | string[], distDir?: string, opts?: Partial<AbstractStage.customScssSubstage.Opts>, logLevelBase?: number): Promise<string[]>;
}
/**
 * Utilities for the {@link AbstractStage} class.
 *
 * @category Stages
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
             * @since 0.3.0-beta.2 — Added option to pass an object of args instead.
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
     */
    interface customScssSubstage {
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
        dir(subpaths: string | string[], distDir?: undefined | string, opts?: Partial<customScssSubstage.Opts>, logLevelBase?: number): Promise<string[]>;
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
        demoDir(subpaths: string | string[], distDir?: undefined | string, opts?: Partial<customScssSubstage.Opts>, logLevelBase?: number): Promise<string[]>;
    }
    /**
     * Utilities for the {@link AbstractStage.customScssSubstage} methods.
     *
     * @since 0.2.0-alpha.2
     * @since 0.3.0-beta.2 — Renamed from runCustomScssDirSubStage to customScssSubstage.
     */
    namespace customScssSubstage {
        /**
         * Default options for the {@link AbstractStage.customScssSubstage}
         * methods.
         *
         * @see {@link customScssSubstage.Opts} For property details.
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
         * Options for the {@link AbstractStage.customScssSubstage}
         * methods.
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
             * {@inheritDoc AbstractStage.compileScss.Opts.prettier}
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
    /**
     * Utilities for the {@link AbstractStage.runCustomScssDirSubStage} method.
     *
     * @since 0.2.0-alpha.2
     * @deprecated 0.3.0-beta.2 — Use {@link customScssSubstage} namespace instead.
     */
    namespace runCustomScssDirSubStage {
        /**
         * Default options for the {@link AbstractStage.runCustomScssDirSubStage}
         * method.
         *
         * @see {@link Opts} For property details.
         *
         * @since 0.2.0-alpha.2
         * @deprecated 0.3.0-beta.2 — Use {@link customScssSubstage} namespace instead.
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
         * @deprecated 0.3.0-beta.2 — Use {@link customScssSubstage} namespace instead.
         */
        interface Opts extends customScssSubstage.Opts {
        }
    }
}

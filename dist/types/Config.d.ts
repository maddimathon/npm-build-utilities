/**
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
import type { Objects } from '@maddimathon/utility-typescript/types';
import type { MessageMaker } from '@maddimathon/utility-typescript/classes';
import type { FileSystem } from '../lib/index.js';
import type { Logger } from './Logger.js';
import type * as Stage from './Stage.js';
/**
 * Complete configuration object for a project using this library.
 *
 * @category Config
 *
 * @since 0.1.0-alpha.draft
 */
export interface Config {
    /**
     * Project’s human-friendly name in title case.
     */
    title: string;
    /**
     * Default output colour to the terminal.
     */
    clr?: MessageMaker.Colour;
    /**
     * Optional arguements to use when constructing {@link Stage.Compiler}.
     */
    compiler?: Partial<Stage.Compiler.Args>;
    /**
     * Optional arguements to use when constructing {@link Logger}.
     */
    console?: Partial<Logger.Args>;
    /**
     * Optional arguements to use when constructing {@link FileSystem}.
     */
    fs?: Partial<FileSystem.Args>;
    /** {@inheritDoc Config.Paths} */
    paths?: Partial<Config.Paths>;
    /** {@inheritDoc Config.Replace} */
    replace?: Config.Replace | ((stage: Stage.Class) => Config.Replace);
    /** {@inheritDoc Config.Stages} */
    stages?: Partial<Config.Stages>;
}
/**
 * Types used for project configuration.
 *
 * @category Types
 *
 * @since 0.1.0-alpha.draft
 */
export declare namespace Config {
    /**
     * @hidden
     * @internal
     * @expand
     */
    type Internal_RequiredKeys = "clr";
    /**
     * Complete configuration shape. Requires more properties than
     * {@link Config}.
     *
     * @since 0.1.0-alpha.draft
     *
     * @interface
     *
     * @internal
     */
    export type Internal = Objects.RequirePartially<Omit<Config, "fs" | "paths" | "replace" | "stages">, Internal_RequiredKeys> & {
        /** {@inheritDoc Config.fs} */
        fs: Required<Config>['fs'];
        /** {@inheritDoc Config.Paths} */
        paths: {
            [K in keyof Required<Config>['paths']]-?: Required<Exclude<Required<Config>['paths'][K], Function>>;
        };
        /** {@inheritDoc Config.replace} */
        replace: Required<Config>['replace'];
        /**
         * A version of {@link Config.Stages} with more predictable options.
         */
        stages: Internal.Stages;
    };
    /**
     * Types for the {@link Config.Internal} type.
     */
    export namespace Internal {
        /**
         * @interface
         *
         * @expandType Stage
         * @expandType Stage.Args
         * @expandType Args
         * @expandType Stage.ClassType
         * @expandType ClassType
         */
        type Stages = {
            [K in Stage.Name]: false | Stage.ClassType | [Stage.ClassType, undefined | Partial<Stage.Args.All[K]>];
        };
    }
    /**
     * Paths to files or directories.
     *
     * Absolute *or* relative to node’s cwd.
     */
    export interface Paths {
        /**
         * Destination for compiled files.
         *
         * @default
         * ```ts
         * {
         *     _: 'dist',
         *     docs: 'docs',
         *     scss: 'dist/scss',
         * }
         * ```
         */
        dist: string | ((subDir?: Paths.DistDirectory) => string) | {
            [D in "_" | Paths.DistDirectory]?: string;
        };
        /**
         * Source for files to be compiled.
         *
         * @default
         * ```ts
         * {
         *     _: 'src',
         *     docs: 'src/docs',
         *     scss: 'src/scss',
         *     ts: 'src/ts',
         * }
         * ```
         */
        src: Paths.SourceFunction | ({
            _?: string;
        } & {
            [D in Paths.SourceDirectory]?: string | string[];
        });
        /**
         * Directory for release zip files.
         *
         * @default '@releases'
         */
        release: string;
        /**
         * Directory for snapshot zip files.
         *
         * @default '.snapshots'
         */
        snapshot: string;
    }
    /**
     * Types for the {@link Config.Paths} type.
     */
    export namespace Paths {
        /**
         * Keys for paths in the dist directory.
         *
         * @expand
         */
        type DistDirectory = Exclude<SourceDirectory, "ts">;
        /**
         * Keys for paths in the source directory.
         *
         * @expand
         */
        type SourceDirectory = "docs" | "scss" | "ts";
        /**
         * Function overloads for configuring the source path via function.
         *
         * @expand
         */
        interface SourceFunction {
            (subDir: SourceDirectory): string[];
            (subDir?: undefined): string;
            (subDir?: SourceDirectory): string | string[];
        }
    }
    /**
     * Placeholders to be replaced during the build processes.
     *
     * For default values, see {@link defaultConfig}.
     */
    export interface Replace {
        /**
         * These placeholders are only ever replaced in compiled files and
         * should never be replaced in the source.
         *
         * This is handy for e.g., the current package version or url in source
         * file doc comments.
         */
        current?: [string | RegExp, string][];
        /**
         * These placeholders are replaced in the source ONLY during a non-dryrun release stage.
         *
         * This is handy for e.g., the package version in a doc comment's @since tag for a new function/class/etc.
         */
        package?: [string | RegExp, string][];
    }
    /**
     * A generic for the allowed input types for stage configuration.
     *
     * @internal
     * @expand
     */
    export type StageOpts<C extends Stage.ClassType = Stage.ClassType, A extends Stage.Args = Stage.Args, B extends boolean | never = boolean> = B | Partial<A> | C | [C, undefined | Partial<A>];
    /**
     * A generic for the allowed input types for stage configuration where only
     * an abstract is included in this package (test, document).
     *
     * @internal
     */
    export type StageOptsAbstract<Stage extends Stage.Name, B extends boolean | never = false, A extends Stage.Args.All[Stage] = Stage.Args.All[Stage]> = B | Stage.ClassType.All[Stage] | [Stage.ClassType.All[Stage]] | [
        Stage.ClassType.All[Stage],
        undefined | Partial<A>
    ];
    /**
     * All build stages and whether or not they run, including custom
     * implementations.
     *
     * If true, the default class is run.  If false, it is not run at all.
     *
     * @interface
     */
    export type Stages = {
        [S in Stage.WithDefaultClass]: boolean | Partial<Stage.Args.All[S]> | Stage.ClassType | [Stage.ClassType, undefined | Partial<Stage.Args.All[S]>];
    } & {
        [S in Stage.WithAbstractClass]?: false | Stage.ClassType | [Stage.ClassType, undefined | Partial<Stage.Args.All[S]>];
    };
    export {};
}
//# sourceMappingURL=Config.d.ts.map
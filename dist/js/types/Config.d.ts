/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha
 * @license MIT
 */
import type { MessageMaker } from '@maddimathon/utility-typescript/classes';
import type { FileSystemType } from './FileSystemType.js';
import type { Logger } from './Logger.js';
import type { Stage } from './Stage.js';
/**
 * An input configuration object for a project using this library.
 *
 * Non-required properties are optional here.  For the type of the completed
 * object used within this library, see {@link Config.Internal}.
 *
 * For default values, see {@link defaultConfig}.
 *
 * @category Types
 *
 * @since 0.1.0-alpha
 */
export interface Config {
    /**
     * Project’s human-friendly name in title case.
     */
    title: string;
    /**
     * A four-digit year string representing the launch date of the project.
     */
    launchYear: string;
    /**
     * Default output colour to the terminal.
     */
    clr?: MessageMaker.Colour;
    /**
     * Optional arguments to use when constructing {@link Stage.Compiler}.
     */
    compiler?: Partial<Stage.Compiler.Args>;
    /**
     * Optional arguments to use when constructing {@link Logger}.
     */
    console?: Partial<Logger.Args>;
    /**
     * Optional arguments to use when constructing {@link FileSystem}.
     */
    fs?: Partial<FileSystemType.Args>;
    /** {@inheritDoc Config.Paths} */
    paths?: Partial<Config.Paths>;
    /** {@inheritDoc Config.Replace} */
    replace?: Config.Replace | ((stage: Stage) => Config.Replace);
    /** {@inheritDoc Config.Stages} */
    stages?: Partial<Config.Stages>;
}
/**
 * Utility types for the {@link Config} interface.
 *
 * @category Types
 *
 * @since 0.1.0-alpha
 */
export declare namespace Config {
    /**
     * Complete configuration shape. Requires more properties than
     * {@link Config}.
     *
     * **These properties are properly defined in {@link Config}.**
     *
     * @since 0.1.0-alpha
     *
     * @interface
     * @internal
     */
    type Internal = {
        [_Key in Exclude<keyof Config, "clr" | "fs" | "paths" | "replace" | "stages">]: Config[_Key];
    } & {
        /** {@inheritDoc Config.clr} */
        clr: Required<Config>['clr'];
        /** {@inheritDoc Config.fs} */
        fs: Required<Config>['fs'];
        /** {@inheritDoc Config.Internal.Paths} */
        paths: Internal.Paths;
        /** {@inheritDoc Config.Replace} */
        replace: Required<Config>['replace'];
        /** {@inheritDoc Config.Internal.Stages} */
        stages: Internal.Stages;
    };
    /**
     * Types for the {@link Config.Internal} type.
     *
     * @since 0.1.0-alpha
     */
    namespace Internal {
        /**
         * A version of {@link Config.Paths} with more limited, predictable
         * options.
         *
         * @since 0.1.0-alpha
         *
         * @interface
         */
        interface Paths extends Omit<Config.Paths, "dist" | "notes" | "scripts" | "src"> {
            /** {@inheritDoc Config.Paths.dist} */
            dist: {
                [P in keyof Exclude<Config.Paths['dist'], string | (() => any)>]-?: Exclude<Config.Paths['dist'], string | (() => any)>[P];
            };
            /** {@inheritDoc Config.Paths.notes} */
            notes: {
                [P in keyof Config.Paths['notes']]-?: Config.Paths['notes'][P];
            };
            /** {@inheritDoc Config.Paths.scripts} */
            scripts: {
                [P in keyof Exclude<Config.Paths['scripts'], string>]-?: Exclude<Config.Paths['scripts'], string>[P];
            };
            /** {@inheritDoc Config.Paths.src} */
            src: {
                [P in keyof Exclude<Config.Paths['src'], (() => any)>]-?: Exclude<Config.Paths['src'], (() => any)>[P];
            };
        }
        /**
         * A version of {@link Config.Stages} with more limited, predictable
         * options.
         *
         * @since 0.1.0-alpha
         */
        type Stages = {
            [S in Stage.Name]: false | [Stage.Class] | [Stage.Class, undefined | Partial<Stage.Args.All[S]>];
        };
    }
    /**
     * Paths to files or directories.
     *
     * Absolute *or* relative to node’s cwd.
     *
     * @since 0.1.0-alpha
     */
    interface Paths {
        /**
         * Destination directories for compiled files.
         */
        dist: string | ((subDir?: Paths.DistDirectory) => string) | {
            [D in "_" | Paths.DistDirectory]?: string;
        };
        /**
         * Relative path to notes files used during development.
         */
        notes: {
            /**
             * Release notes file.
             *
             * Used for updating the changelog and the github release notes.
             */
            release?: string;
        };
        /**
         * Location of build scripts and related files.
         */
        scripts: string | {
            _?: string;
            logs?: string;
        };
        /**
         * Source for files to be compiled.
         *
         * - `_` expects a directory
         * - `docs` expects a directory (or array of such)
         * - `scss` expects a directory, file path, or globs (or array of such)
         * - `ts` expects a directory or file path (or array of such)
         */
        src: Paths.SourceFunction | ({
            _?: string;
        } & {
            [D in Paths.SourceDirectory]?: string | string[];
        });
        /**
         * Relative path to changelog file.
         */
        changelog: string;
        /**
         * Relative path to readme file.
         */
        readme: string;
        /**
         * Directory for release zip files.
         */
        release: string;
        /**
         * Directory for snapshot zip files.
         */
        snapshot: string;
    }
    /**
     * Types for the {@link Config.Paths} type.
     *
     * @since 0.1.0-alpha
     */
    namespace Paths {
        /**
         * Keys for paths in the dist directory.
         *
         * @since 0.1.0-alpha
         */
        type DistDirectory = Exclude<SourceDirectory, "ts">;
        /**
         * Keys for paths in the source directory.
         *
         * @since 0.1.0-alpha
         */
        type SourceDirectory = "docs" | "scss" | "ts";
        /**
         * Function overloads for configuring the source path via function.
         *
         * @since 0.1.0-alpha
         *
         * @function
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
     * @since 0.1.0-alpha
     */
    interface Replace {
        /**
         * These placeholders are only ever replaced in compiled files and
         * should never be replaced in the source.
         *
         * This is handy for e.g., the current package version or url in source
         * file doc comments.
         */
        current?: [string | RegExp, string][];
        /**
         * These placeholders are replaced in the source ONLY during a
         * non-dryrun release stage.
         *
         * This is handy for e.g., the package version in a doc comment's
         * `@since` tag for a new function/class/etc.
         */
        package?: [string | RegExp, string][];
    }
    /**
     * All build stages and whether or not they run, including custom
     * implementations.
     *
     * If true, the default class is run.  If false, it is not run at all.
     *
     * @since 0.1.0-alpha
     *
     * @interface
     */
    type Stages = {
        [S in Stage.Name]: boolean | Partial<Stage.Args.All[S]> | Stage.Class | [Stage.Class, undefined | Partial<Stage.Args.All[S]>];
    };
}
//# sourceMappingURL=Config.d.ts.map
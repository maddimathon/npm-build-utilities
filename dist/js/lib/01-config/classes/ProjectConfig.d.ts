/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha
 * @license MIT
 */
import type { Config, Stage } from '../../../types/index.js';
import type { Logger } from '../../../types/Logger.js';
import { FileSystem } from '../../00-universal/index.js';
/**
 * A super-simple class just for the configuration of the project.
 *
 * @category Config
 *
 * @since 0.1.0-alpha
 */
export declare class ProjectConfig implements Config.Internal {
    /** {@inheritDoc Config.clr} */
    readonly clr: import("@maddimathon/utility-typescript/classes").MessageMaker.Colour;
    /** {@inheritDoc Config.compiler} */
    readonly compiler: Partial<Stage.Compiler.Args> | undefined;
    /** {@inheritDoc Config.console} */
    readonly console: Partial<Logger.Args> | undefined;
    /** {@inheritDoc Config.fs} */
    readonly fs: Partial<import("../../@internal.js").FileSystemType.Args>;
    /** {@inheritDoc Config.launchYear} */
    readonly launchYear: string;
    /** {@inheritDoc Config.paths} */
    readonly paths: Config.Internal.Paths;
    /** {@inheritDoc Config.replace} */
    readonly replace: Config.Replace | ((stage: Stage) => Config.Replace);
    /** {@inheritDoc Config.stages} */
    readonly stages: Config.Internal.Stages;
    /** {@inheritDoc Config.title} */
    readonly title: string;
    /**
     * To convert a {@link Config} type to a {@link Config.Internal} type, use
     * the {@link internal.internalConfig} function.
     */
    constructor(config: Config.Internal);
    /**
     * Gets a path to the {@link Config.Paths.dist} directories.
     *
     * @param fs        Instance used to work with paths and files.
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     *
     * @return  Relative path.
     */
    getDistDir(fs: FileSystem, subDir?: Config.Paths.DistDirectory, ...subpaths: string[]): string;
    /**
     * Gets a path to the {@link Config.Paths.scripts} directories.
     *
     * @param fs        Instance used to work with paths and files.
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     *
     * @return  Relative path.
     */
    getScriptsPath(fs: FileSystem, subDir?: "logs", ...subpaths: string[]): string;
    /**
     * Gets a path to the {@link Config.Paths.src} directories.
     *
     * @param fs        Instance used to work with paths and files.
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     *
     * @return  Relative path.
     */
    getSrcDir(fs: FileSystem, subDir: Config.Paths.SourceDirectory, ...subpaths: string[]): string[];
    getSrcDir(fs: FileSystem, subDir?: undefined, ...subpaths: string[]): string;
    getSrcDir(fs: FileSystem, subDir?: Config.Paths.SourceDirectory, ...subpaths: string[]): string | string[];
    /**
     * Gets the instance for the given stage.
     *
     * @param stage  Stage to get.
     *
     * @return  An array with first the stage’s class and then the configured
     *          arguments for that class, or undefined if that class is disabled
     *          by the config.
     */
    getStage(stage: Stage.Name, console: Logger): Promise<undefined | [Stage.Class, Partial<Stage.Args>]>;
    /**
     * Returns the minimum required properties of this config.
     *
     * Useful for creating stripped-down or default configuration objects.
     */
    minimum(): Config;
    /**
     * The object shape used when converting to JSON.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description | JSON.stringify}
     */
    toJSON(): Config.Internal;
    /**
     * Overrides the default function to return a string representation of this
     * object.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString | Object.prototype.toString()}
     */
    toString(): string;
}
//# sourceMappingURL=ProjectConfig.d.ts.map
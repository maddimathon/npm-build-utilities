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
import type { Config, Stage } from '../../../types/index.js';
import type { Logger } from '../../../types/Logger.js';
import { FileSystem } from '../../00-universal/index.js';
/**
 * A super-simple class just for the configuration of the entire project.
 *
 * Includes some utility methods and coverts a {@link Config} object into a
 * complete {@link Config.Internal} object.
 *
 * @category Config
 *
 * @since 0.1.0-alpha.draft
 */
export declare class ProjectConfig implements Objects.Classify<Config> {
    static replace(stage: Stage.Class): Config.Replace;
    readonly clr: import("@maddimathon/utility-typescript/classes/MessageMaker").MessageMaker.Colour;
    readonly compiler: Partial<Stage.Compiler.Args> | undefined;
    readonly console: Partial<Logger.Args> | undefined;
    readonly fs: Partial<import("../../@internal.js").FileSystemType.Args>;
    readonly launchYear: string;
    readonly paths: {
        dist: Required<Exclude<Config.Paths["dist"], string | (() => any)>>;
        scripts: Required<Exclude<Config.Paths["scripts"], string | (() => any)>>;
        src: Required<Exclude<Config.Paths["src"], string | (() => any)>>;
        release: Config.Paths["release"];
        snapshot: Config.Paths["snapshot"];
    };
    readonly replace: Config.Replace | ((stage: Stage.Class) => Config.Replace);
    readonly stages: Config.Internal.Stages;
    readonly title: string;
    constructor(config: Config.Internal);
    /**
     * Gets the paths from the config for the given dist sub directory.
     *
     * @param fs        Instance used to resolve path.
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     */
    getDistDir(fs: FileSystem, subDir?: Config.Paths.DistDirectory, ...subpaths: string[]): string;
    /**
     * Gets an absolute path to the {@link Config.Paths['scripts']} directories.
     *
     * @param fs        Instance used to resolve path.
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     */
    getScriptsPath(fs: FileSystem, subDir?: "logs", ...subpaths: string[]): string;
    /**
     * @param fs        Instance used to resolve path.
     * @param subDir    Sub-path to get.
     * @param subpaths  Optional additional subpaths.
     */
    getSrcDir(fs: FileSystem, subDir: Config.Paths.SourceDirectory, ...subpaths: string[]): string[];
    getSrcDir(fs: FileSystem, subDir?: undefined, ...subpaths: string[]): string;
    getSrcDir(fs: FileSystem, subDir?: Config.Paths.SourceDirectory, ...subpaths: string[]): string | string[];
    /**
     * Gets the instance for the given stage.
     *
     * @category Fetchers
     *
     * @param stage  Stage to get.
     *
     * @return  An array with first the stage’s class and then the configured
     *          arguments for that class, if any.
     */
    getStage(stage: Stage.Name, console: Logger): Promise<undefined | [Stage.ClassType, Partial<Stage.Args>]>;
    /**
     * Returns the minimum required properties of this config.
     *
     * Useful for creating stripped-down or default configuration objects.
     */
    minimum(): Config;
    /**
     * The object shape used when converting to JSON.
     *
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description | JSON.stringify}
     */
    toJSON(): Objects.Classify<Config.Internal>;
    /**
     * Overrides the default function to return a string representation of this
     * object.
     *
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString | Object.prototype.toString()}
     */
    toString(): string;
    /**
     * Overrides the default function to return an object representation of this
     * object.
     *
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf | Object.prototype.valueOf()}
     * @see {@link ProjectConfig.toJSON | ProjectConfig.toJSON()}
     */
    valueOf(): Objects.Classify<Config.Internal>;
}
//# sourceMappingURL=ProjectConfig.d.ts.map
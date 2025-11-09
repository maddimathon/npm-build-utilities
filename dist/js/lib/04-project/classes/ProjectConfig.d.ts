/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.7
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
 * @since 0.1.0-alpha.1 — Now implements {@link Config.Class} instead of
 *                            {@link Config.Internal}.
 */
export declare class ProjectConfig implements Config.Class {
    #private;
    /**
     * A “local” “cache” of default config values, used primarily for
     * {@link ProjectConfig.export}.
     *
     * @since 0.1.0-alpha.1
     */
    protected static get default(): Config.Internal;
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
    export(): Config.Default;
    getDistDir(fs: FileSystem, subDir?: Config.Paths.DistDirectory, ...subpaths: string[]): string;
    getScriptsPath(fs: FileSystem, subDir?: "logs", ...subpaths: string[]): string;
    getSrcDir(fs: FileSystem, subDir: Config.Paths.SourceDirectory, ...subpaths: string[]): string[];
    getSrcDir(fs: FileSystem, subDir?: undefined, ...subpaths: string[]): string;
    getSrcDir(fs: FileSystem, subDir?: Config.Paths.SourceDirectory, ...subpaths: string[]): string | string[];
    getStage(stage: Stage.Name, console: Logger): Promise<undefined | [Stage.Class, Partial<Stage.Args>]>;
    minimum(): Config;
    toJSON(): Config.Internal;
    toString(): string;
}
//# sourceMappingURL=ProjectConfig.d.ts.map
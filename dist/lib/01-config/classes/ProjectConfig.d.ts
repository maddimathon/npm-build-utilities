/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-draft
 * @license MIT
 */
import type { Objects } from '@maddimathon/utility-typescript/types';
import type { CLI, Config, Logger, Stage } from '../../../types/index.js';
/**
 * A super-simple class just for the configuration of the entire project.
 *
 * Includes some utility methods and coverts a {@link Config} object into a
 * complete {@link Config.Internal} object.
 *
 * @category Config
 *
 * @since 0.1.0-draft
 */
export declare class ProjectConfig implements Config.Class {
    readonly clr: import("@maddimathon/utility-typescript/classes/MessageMaker").MessageMaker.Colour;
    readonly compiler: Partial<Stage.Compiler.Args>;
    readonly console: Partial<Logger.Args>;
    readonly fs: Partial<import("../../index.js").FileSystem.Args>;
    readonly paths: {
        dist: string | Required<{
            _?: string | undefined;
            ts?: string | undefined;
            scss?: string | undefined;
            docs?: string | undefined;
        }>;
        src: Required<{
            _?: string;
        } & {
            ts?: string | string[] | undefined;
            scss?: string | string[] | undefined;
            docs?: string | string[] | undefined;
        }>;
        release: string;
        snapshot: string;
    };
    readonly stages: Config.Internal.Stages;
    readonly title: string;
    constructor(config: Config.Internal);
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
    getStage(stage: Stage.Name, console: Logger, params: CLI.Params): Promise<undefined | [Stage.ClassType, Partial<Stage.Args>]>;
    /**
     * Returns the minimum required properties of this config.
     *
     * Useful for creating stripped-down or default configuration objects.
     */
    minimum(): Config & Partial<Config.Internal>;
    /**
     * The object shape used when converting to JSON.
     *
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description | JSON.stringify}
     */
    toJSON(): Objects.Classify<Config.Internal, never>;
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
    valueOf(): Objects.Classify<Config.Internal, never>;
}
//# sourceMappingURL=ProjectConfig.d.ts.map
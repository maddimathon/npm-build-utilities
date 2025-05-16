/**
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
import type { Objects } from '@maddimathon/utility-typescript/types';
import type { CLI, Config, Stage } from '../../../types/index.js';
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
    readonly console: Partial<Stage.Console.Args>;
    readonly fs: Partial<import("@maddimathon/utility-typescript/classes/node/NodeFiles").NodeFiles.Args>;
    readonly paths: {
        dist: string | Required<{
            docs?: string | undefined;
            scss?: string | undefined;
            ts?: string | undefined;
            _?: string | undefined;
        }>;
        src: Required<{
            docs?: string | string[] | undefined;
            scss?: string | string[] | undefined;
            ts?: string | string[] | undefined;
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
     * @param stage  Stage to get.
     */
    getStage<S extends Stage.Name, C extends NonNullable<Stage.ClassType.All[S]>, A extends Stage.Args.All[S]>(stage: S, console: Stage.Console, params: CLI.Params): Promise<undefined | [C, Partial<A>]>;
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
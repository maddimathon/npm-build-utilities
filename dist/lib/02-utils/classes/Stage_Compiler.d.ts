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
import * as sass from 'sass';
import { node } from '@maddimathon/utility-typescript/classes';
import type { CLI, Stage } from '../../../types/index.js';
import { ProjectConfig } from '../../01-config/index.js';
import type { Stage_Console } from './Stage_Console.js';
/**
 * To be used by {@link AbstractStage} and those that inherit from it.
 *
 * Includes a variety of utilities for compiling files (like scss and
 * typescript).
 *
 * @category Utilities
 *
 * @since 0.1.0-draft
 *
 * @internal
 */
export declare class Stage_Compiler implements Stage.Compiler {
    readonly config: ProjectConfig;
    readonly params: CLI.Params;
    readonly log: Stage_Console;
    readonly fs: node.NodeFiles;
    /**
     * Default values for the args property.
     *
     * @category Args
     */
    protected get ARGS_DEFAULT(): Stage_Compiler.Args;
    /**
     * A completed args object.
     *
     * @category Args
     */
    readonly args: Stage_Compiler.Args;
    /**
     * @param config  Current project config.
     * @param params  Current CLI params.
     * @param log     Instance used to send messages to the console.
     * @param fs
     * @param args    Partial overrides for the default args.
     */
    constructor(config: ProjectConfig, params: CLI.Params, log: Stage_Console, fs: node.NodeFiles, args?: Partial<Stage_Compiler.Args>);
    /**
     * Compiles scss using the
     * {@link https://www.npmjs.com/package/sass | sass npm package}.
     *
     * @param input   Scss input path.
     * @param output  Scss output path.
     * @param level   Depth level for this message (above the value of
     *                {@link Stage.Args['log-base-level']}).
     */
    scss(input: string, output: string, level: number, sassOpts?: sass.Options<"sync">): Promise<void>;
    /**
     * Compiles typescript using the
     * {@link https://www.npmjs.com/package/sass | sass npm package}.
     *
     * @param tsConfig  TS config json file path.
     * @param level     Depth level for this message (above the value of
     *                  {@link Stage.Args['log-base-level']}).
     */
    typescript(tsConfig: string, level: number): Promise<void>;
}
/**
 * Used only for {@link Stage_Compiler}.
 *
 * @category Utilities
 */
export declare namespace Stage_Compiler {
    /**
     * Optional configuration for {@link Stage_Compiler}.
     *
     * @since 0.1.0-draft
     */
    interface Args {
    }
}
//# sourceMappingURL=Stage_Compiler.d.ts.map
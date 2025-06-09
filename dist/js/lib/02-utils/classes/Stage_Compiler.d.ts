/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import * as sass from 'sass';
import type { CLI, Stage } from '../../../types/index.js';
import { FileSystem } from '../../00-universal/index.js';
import { ProjectConfig } from '../../01-config/index.js';
import type { Stage_Console } from './Stage_Console.js';
/**
 * To be used by {@link AbstractStage} and those that inherit from it.
 *
 * Includes a variety of utilities for compiling files (like scss and
 * typescript).
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 *
 * @internal
 */
export declare class Stage_Compiler implements Stage.Compiler {
    protected readonly config: ProjectConfig;
    protected readonly params: CLI.Params;
    protected readonly console: Stage_Console;
    protected readonly fs: FileSystem;
    get tsConfig(): {
        readonly extends: "@maddimathon/build-utilities/tsconfig";
        readonly exclude: ["**/node_modules/**/*"];
        readonly compilerOptions: {
            readonly exactOptionalPropertyTypes: false;
            readonly outDir: string;
            readonly baseUrl: string;
        };
    };
    get ARGS_DEFAULT(): {
        readonly sass: {
            readonly charset: true;
            readonly sourceMap: true;
            readonly sourceMapIncludeSources: true;
            readonly style: "expanded";
        };
        readonly ts: {};
    };
    readonly args: Stage.Compiler.Args;
    /**
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param console  Instance used to log messages and debugging info.
     * @param fs       Instance used to work with paths and files.
     */
    constructor(config: ProjectConfig, params: CLI.Params, console: Stage_Console, fs: FileSystem);
    scss(input: string, output: string, level: number, sassOpts?: sass.Options<"sync">): Promise<void>;
    typescript(tsConfig: string, level: number): Promise<void>;
}
//# sourceMappingURL=Stage_Compiler.d.ts.map
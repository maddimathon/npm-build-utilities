/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.2.0-alpha
 * @license MIT
 */
import * as postcss_PresetEnv from 'postcss-preset-env';
import type { Json } from '@maddimathon/utility-typescript/types';
import type { CLI, Config, Stage } from '../../../types/index.js';
import { FileSystem } from '../../00-universal/index.js';
import type { Stage_Console } from './Stage_Console.js';
/**
 * To be used by {@link AbstractStage} and those that inherit from it.
 *
 * Includes a variety of utilities for compiling files (like scss and
 * typescript).
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export declare class Stage_Compiler implements Stage.Compiler {
    protected readonly config: Config.Class;
    protected readonly params: CLI.Params;
    protected readonly console: Stage_Console;
    protected readonly fs: FileSystem;
    /**
     * Gets paths to tsconfig files according to the project configuration.
     *
     * If none is found, a console prompt asks to write a default file.
     *
     * @param stage            Current stage being run.
     * @param level            Depth level for output to the console.
     * @param writeIfNotFound  Whether to prompt (via console) to write a new tsconfig file if none are found.
     *
     * @since 0.2.0-alpha
     */
    static getTsConfigPaths(stage: Stage, level: number, writeIfNotFound?: boolean): Promise<string[]>;
    /**
     * Default configuration for working with PostCSS.
     *
     * @since 0.2.0-alpha
     */
    static get postCssConfig(): {
        readonly presetEnv: {
            readonly features: {
                readonly 'all-property': false;
                readonly 'any-link-pseudo-class': false;
                readonly 'blank-pseudo-class': false;
                readonly 'break-properties': true;
                readonly 'cascade-layers': true;
                readonly 'case-insensitive-attributes': true;
                readonly clamp: {
                    readonly preserve: true;
                };
                readonly 'color-function': {
                    readonly preserve: true;
                };
                readonly 'color-functional-notation': false;
                readonly 'color-mix': false;
                readonly 'color-mix-variadic-function-arguments': false;
                readonly 'content-alt-text': {
                    readonly preserve: true;
                };
                readonly 'custom-media-queries': false;
                readonly 'custom-properties': {
                    readonly preserve: true;
                };
                readonly 'custom-selectors': false;
                readonly 'dir-pseudo-class': false;
                readonly 'display-two-values': false;
                readonly 'double-position-gradients': true;
                readonly 'exponential-functions': true;
                readonly 'float-clear-logical-values': true;
                readonly 'focus-visible-pseudo-class': false;
                readonly 'focus-within-pseudo-class': false;
                readonly 'font-format-keywords': false;
                readonly 'font-variant-property': false;
                readonly 'gamut-mapping': false;
                readonly 'gap-properties': true;
                readonly 'gradients-interpolation-method': false;
                readonly 'has-pseudo-class': false;
                readonly 'hexadecimal-alpha-notation': true;
                readonly 'hwb-function': true;
                readonly 'ic-unit': false;
                readonly 'image-set-function': false;
                readonly 'is-pseudo-class': false;
                readonly 'lab-function': {
                    readonly preserve: true;
                };
                readonly 'light-dark-function': false;
                readonly 'logical-overflow': true;
                readonly 'logical-overscroll-behavior': true;
                readonly 'logical-properties-and-values': true;
                readonly 'logical-resize': true;
                readonly 'logical-viewport-units': true;
                readonly 'media-queries-aspect-ratio-number-values': false;
                readonly 'media-query-ranges': true;
                readonly 'nested-calc': true;
                readonly 'nesting-rules': true;
                readonly 'not-pseudo-class': false;
                readonly 'oklab-function': {
                    readonly preserve: true;
                };
                readonly 'opacity-percentage': true;
                readonly 'overflow-property': true;
                readonly 'overflow-wrap-property': false;
                readonly 'place-properties': true;
                readonly 'prefers-color-scheme-query': false;
                readonly 'random-function': false;
                readonly 'rebeccapurple-color': true;
                readonly 'relative-color-syntax': false;
                readonly 'scope-pseudo-class': false;
                readonly 'sign-functions': false;
                readonly 'stepped-value-functions': false;
                readonly 'system-ui-font-family': false;
                readonly 'text-decoration-shorthand': false;
                readonly 'trigonometric-functions': false;
                readonly 'unset-value': {
                    readonly preserve: true;
                };
            };
            readonly logical: {
                blockDirection: postcss_PresetEnv.DirectionFlow.TopToBottom;
                inlineDirection: postcss_PresetEnv.DirectionFlow.LeftToRight;
            };
            readonly stage: false;
        };
        readonly processor: {
            readonly map: false;
        };
    };
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
        /**
         * This is the value of the {@link Stage_Compiler.postCssConfig}
         * static accessor.
         */
        readonly postCSS: Stage.Compiler.Args.PostCSS;
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
    constructor(config: Config.Class, params: CLI.Params, console: Stage_Console, fs: FileSystem);
    /**
     * Gets the value of the given tsconfig file.
     *
     * @throws {@link StageError}  If the tsconfig file doesn’t exist and errorIfNotFound is truthy.
     *
     * @param tsconfig         Path to TS config json used to compile the project.
     * @param level            Depth level for this message.
     * @param errorIfNotFound  Whether to throw an error if tsconfig is not found.
     *
     * @since 0.2.0-alpha
     */
    getTsConfig(tsconfig: string, level: number, errorIfNotFound?: boolean): Partial<Json.TsConfig>;
    /**
     * Gets the value of the given tsconfig file.
     *
     * @throws {@link StageError}  If the tsconfig file doesn’t exist and errorIfNotFound is truthy.
     *
     * @param tsconfig         Path to TS config json.
     * @param level            Depth level for this message.
     * @param errorIfNotFound  Whether to throw an error if tsconfig is not found.
     *
     * @since 0.2.0-alpha
     */
    getTsConfigOutDir(tsconfig: string | Partial<Json.TsConfig> & {
        path: string;
    }, level: number, errorIfNotFound?: boolean): string | false;
    postCSS(paths: {
        from: string;
        to?: string;
    }[], level: number, _postCssOpts?: Stage.Compiler.Args.PostCSS): Promise<void>;
    scss(input: string, output: string, level: number, sassOpts?: Stage.Compiler.Args.Sass): Promise<void>;
    /**
     * {@inheritDoc Stage.Compiler.typescript}
     *
     * @since 0.2.0-alpha — Now has errorIfNotFound param for use with new {@link Stage_Compiler.getTsConfig} method.
     */
    typescript(tsconfig: string, level: number, errorIfNotFound?: boolean): Promise<void>;
}
//# sourceMappingURL=Stage_Compiler.d.ts.map
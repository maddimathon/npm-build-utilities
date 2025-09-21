/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha
 * @license MIT
 */
import type { Json } from '@maddimathon/utility-typescript/types';
import type { CLI, Config, Stage } from '../../../types/index.js';
import { SemVer } from '../../@internal/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default compile stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 */
export declare class CompileStage extends AbstractStage<Stage.Args.Compile, Stage.SubStage.Compile> {
    /**
     * {@inheritDoc AbstractStage.subStages}
     *
     * @category Running
     *
     * @source
     */
    readonly subStages: Stage.SubStage.Compile[];
    get ARGS_DEFAULT(): {
        readonly files: false;
        readonly scss: {
            postCSS: true;
        };
        readonly ts: true;
        readonly utils: {};
    };
    /**
     * @category Constructor
     *
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param args     Partial overrides for the default args.
     * @param pkg      Parsed contents of the project’s package.json file.
     * @param version  Version object for the project’s version.
     */
    constructor(config: Config.Class, params: CLI.Params, args: Partial<Stage.Args.Compile>, pkg?: Json.PackageJson, version?: SemVer);
    startEndNotice(which: "start" | "end" | null): void | Promise<void>;
    protected runSubStage(subStage: Stage.SubStage.Compile): Promise<void>;
    /**
     * Compiles scss files to css.
     *
     * @category Sub-Stages
     *
     * @since 0.2.0-alpha — Runs PostCSS if {@link Stage.Args.Compile.postCSS} is truthy.
     */
    protected scss(): Promise<void>;
    /**
     * Compiles typescript to javascript.
     *
     * @category Sub-Stages
     */
    protected ts(): Promise<void>;
    /**
     * Copies files to the dist directory.
     *
     * @category Sub-Stages
     */
    protected files(): Promise<void>;
}
//# sourceMappingURL=CompileStage.d.ts.map
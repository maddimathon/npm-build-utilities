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
import type { CLI, Stage } from '../../../types/index.js';
import { ProjectConfig } from '../../01-config/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default compile stage.
 *
 * @category Stages
 *
 * @since 0.1.0-draft
 */
export declare class CompileStage extends AbstractStage<Stage.SubStage.Compile, Stage.Args.Compile> {
    readonly subStages: Stage.SubStage.Compile[];
    get ARGS_DEFAULT(): Stage.Args.Compile;
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     */
    constructor(config: ProjectConfig, params: CLI.Params, args?: Partial<Stage.Args.Compile>);
    /**
     * Prints a message to the console signalling the start or end of this
     * build stage.
     *
     * @param which  Whether we are starting or ending.
     */
    startEndNotice(which: "start" | "end" | null): void;
    protected runSubStage(stage: Stage.SubStage.Compile): Promise<void>;
    protected scss(): Promise<void[] | undefined>;
    protected ts(): Promise<void[] | undefined>;
    protected files(): Promise<void>;
}
//# sourceMappingURL=CompileStage.d.ts.map
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
 * Default release stage.
 *
 * @category Stages
 *
 * @since 0.1.0-draft
 */
export declare class ReleaseStage extends AbstractStage<Stage.SubStage.Release, Stage.Args.Release> {
    readonly subStages: Stage.SubStage.Release[];
    get ARGS_DEFAULT(): Stage.Args.Release;
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     */
    constructor(config: ProjectConfig, params: CLI.Params, args: Partial<Stage.Args.Release>);
    /**
     * Prints a message to the console signalling the start or end of this
     * build stage.
     *
     * @param which  Whether we are starting or ending.
     */
    startEndNotice(which: "start" | "end" | null): void;
    protected runSubStage(subStage: Stage.SubStage.Release): Promise<void>;
    protected changelog(): Promise<void>;
    protected commit(): Promise<void>;
    protected github(): Promise<void>;
    /**
     * Runs the project's package class.
     */
    protected package(): Promise<void>;
    protected replace(): Promise<void>;
    protected tidy(): Promise<void>;
}
//# sourceMappingURL=ReleaseStage.d.ts.map
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
import type { Node } from '@maddimathon/utility-typescript/types';
import type { CLI, Stage } from '../../../types/index.js';
import { ProjectConfig } from '../../01-config/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default release stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 */
export declare class ReleaseStage extends AbstractStage<Stage.SubStage.Release, Stage.Args.Release> {
    readonly subStages: Stage.SubStage.Release[];
    get ARGS_DEFAULT(): Stage.Args.Release;
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     * @param _pkg    The current package.json value, if any.
     */
    constructor(config: ProjectConfig, params: CLI.Params, args: Partial<Stage.Args.Release>, _pkg?: Node.PackageJson);
    /**
     * Runs the prompters to confirm before starting the substages.
     */
    protected startPrompters(): Promise<void>;
    /**
     * Prints a message to the console signalling the start or end of this
     * build stage.
     *
     * @param which  Whether we are starting or ending.
     */
    startEndNotice(which: "start" | "end" | null): Promise<void>;
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
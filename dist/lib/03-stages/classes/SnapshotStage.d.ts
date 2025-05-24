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
 * Default snapshot stage.
 *
 * @category Stages
 *
 * @since 0.1.0-draft
 */
export declare class SnapshotStage extends AbstractStage<Stage.SubStage.Snapshot, Stage.Args.Snapshot> {
    readonly subStages: Stage.SubStage.Snapshot[];
    get ARGS_DEFAULT(): Stage.Args.Snapshot;
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     */
    constructor(config: ProjectConfig, params: CLI.Params, args: Partial<Stage.Args.Snapshot>);
    /**
     * Prints a message to the console signalling the start or end of this
     * build stage.
     *
     * @param which  Whether we are starting or ending.
     */
    startEndNotice(which: "start" | "end" | null): void;
    protected runSubStage(subStage: Stage.SubStage.Snapshot): Promise<void>;
    protected snap(): Promise<void>;
}
//# sourceMappingURL=SnapshotStage.d.ts.map
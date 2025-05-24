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
 * Default snapshot stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 */
export declare class SnapshotStage extends AbstractStage<Stage.SubStage.Snapshot, Stage.Args.Snapshot> {
    readonly subStages: Stage.SubStage.Snapshot[];
    get ARGS_DEFAULT(): Stage.Args.Snapshot;
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     * @param _pkg    The current package.json value, if any.
     */
    constructor(config: ProjectConfig, params: CLI.Params, args: Partial<Stage.Args.Snapshot>, _pkg?: Node.PackageJson);
    protected runSubStage(subStage: Stage.SubStage.Snapshot): Promise<void>;
    protected snap(): Promise<void>;
    protected _copy(): Promise<void>;
    protected _zip(): Promise<void>;
    protected _tidy(): Promise<void>;
}
//# sourceMappingURL=SnapshotStage.d.ts.map
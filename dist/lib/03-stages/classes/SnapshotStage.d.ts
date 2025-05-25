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
import { SemVer } from '../../@internal.js';
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
    /**
     * Output name for the snapshot zip.
     */
    readonly filename: string;
    /**
     * Output directory for the snapshot.
     */
    readonly path: string;
    readonly subStages: Stage.SubStage.Snapshot[];
    get ARGS_DEFAULT(): {
        readonly ignoreGlobs: (stage: Stage.Class) => string[];
        readonly objs: {
            cpl?: import("../../@internal.js").Stage_Compiler;
            fs?: import("../../index.js").FileSystem;
        };
    };
    /**
     * @param config    Complete project configuration.
     * @param params    Current CLI params.
     * @param args      Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor(config: ProjectConfig, params: CLI.Params, args: Partial<Stage.Args.Snapshot>, _pkg?: Node.PackageJson, _version?: SemVer);
    protected runSubStage(subStage: Stage.SubStage.Snapshot): Promise<void>;
    protected snap(): Promise<void>;
    protected _zip(): Promise<void>;
    protected _tidy(): Promise<void>;
}
//# sourceMappingURL=SnapshotStage.d.ts.map
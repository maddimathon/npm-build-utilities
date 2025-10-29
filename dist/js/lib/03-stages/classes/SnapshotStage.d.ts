/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.4
 * @license MIT
 */
import type { Json } from '@maddimathon/utility-typescript/types';
import type { CLI, Config, Stage } from '../../../types/index.js';
import { SemVer } from '../../@internal/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default snapshot stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 */
export declare class SnapshotStage extends AbstractStage<Stage.Args.Snapshot, Stage.SubStage.Snapshot> {
    /**
     * Output name for the snapshot zip.
     *
     * @category Config
     */
    readonly filename: string;
    /**
     * Output directory for the snapshot.
     *
     * @category Config
     */
    readonly path: string;
    readonly subStages: Stage.SubStage.Snapshot[];
    get ARGS_DEFAULT(): {
        readonly utils: {};
        readonly ignoreGlobs: (_stage: Stage) => string[];
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
    constructor(config: Config.Class, params: CLI.Params, args: Partial<Stage.Args.Snapshot>, pkg?: Json.PackageJson, version?: SemVer);
    startEndNotice(which: "start" | "end" | null): Promise<void>;
    protected runSubStage(subStage: Stage.SubStage.Snapshot): Promise<void>;
    /**
     * Runs the whole snapshot.
     *
     * @category Sub-Stages
     */
    protected snap(): Promise<void>;
    /**
     * Deletes any existing snapshot folders.
     *
     * @category Utilities
     */
    protected _tidy(): Promise<void>;
    /**
     * Zips the snapshot folder.
     *
     * @category Utilities
     */
    protected _zip(): Promise<void>;
}
//# sourceMappingURL=SnapshotStage.d.ts.map
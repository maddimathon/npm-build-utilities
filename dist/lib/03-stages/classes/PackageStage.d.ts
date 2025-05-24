import type { CLI, Stage } from '../../../types/index.js';
import { ProjectConfig } from '../../01-config/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default package stage.
 *
 * @category Stages
 *
 * @since 0.1.0-draft
 */
export declare class PackageStage extends AbstractStage<Stage.SubStage.Package, Stage.Args.Package> {
    readonly subStages: Stage.SubStage.Package[];
    get ARGS_DEFAULT(): Stage.Args.Package;
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     */
    constructor(config: ProjectConfig, params: CLI.Params, args: Partial<Stage.Args.Package>);
    /**
     * Prints a message to the console signalling the start or end of this
     * build stage.
     *
     * @param which  Whether we are starting or ending.
     */
    startEndNotice(which: "start" | "end" | null): void;
    protected runSubStage(subStage: Stage.SubStage.Package): Promise<void>;
    /**
     * Runs the project's build class.
     */
    protected build(): Promise<void>;
    protected copy(): Promise<void>;
    /**
     * Runs the project's snapshot class.
     */
    protected snapshot(): Promise<void>;
    protected zip(): Promise<void>;
}
//# sourceMappingURL=PackageStage.d.ts.map
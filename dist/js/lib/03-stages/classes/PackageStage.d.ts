import type { Node } from '@maddimathon/utility-typescript/types';
import type { CLI, Stage } from '../../../types/index.js';
import { SemVer } from '../../@internal/index.js';
import { ProjectConfig } from '../../01-config/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default package stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 */
export declare class PackageStage extends AbstractStage<Stage.SubStage.Package, Stage.Args.Package> {
    readonly subStages: Stage.SubStage.Package[];
    get ARGS_DEFAULT(): {
        readonly objs: {};
    };
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor(config: ProjectConfig, params: CLI.Params, args: Partial<Stage.Args.Package>, _pkg?: Node.PackageJson, _version?: SemVer);
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
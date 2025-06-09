import type { Json } from '@maddimathon/utility-typescript/types';
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
export declare class PackageStage extends AbstractStage<Stage.Args.Package, Stage.SubStage.Package> {
    /**
     * {@inheritDoc AbstractStage.subStages}
     *
     * @category Running
     *
     * @source
     */
    readonly subStages: Stage.SubStage.Package[];
    get ARGS_DEFAULT(): {
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
    constructor(config: ProjectConfig, params: CLI.Params, args: Partial<Stage.Args.Package>, pkg?: Json.PackageJson, version?: SemVer);
    /**
     * Runs the prompters to confirm before starting the substages.
     *
     * @category Running
     */
    protected startPrompters(): Promise<void>;
    startEndNotice(which: "start" | "end" | null): Promise<void>;
    protected runSubStage(subStage: Stage.SubStage.Package): Promise<void>;
    /**
     * Runs the project's build class.
     *
     * @category Sub-Stages
     */
    protected build(): Promise<void>;
    /**
     * Copies all project files to the release directory.
     *
     * @category Sub-Stages
     */
    protected copy(): Promise<void>;
    /**
     * Runs the project's snapshot class.
     *
     * @category Sub-Stages
     */
    protected snapshot(): Promise<void>;
    /**
     * Zips the release directory.
     *
     * @category Sub-Stages
     */
    protected zip(): Promise<void>;
}
//# sourceMappingURL=PackageStage.d.ts.map
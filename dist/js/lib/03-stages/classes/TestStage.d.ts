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
export declare class TestStage extends AbstractStage<Stage.Args.Test, Stage.SubStage.Test> {
    readonly subStages: Stage.SubStage.Test[];
    get ARGS_DEFAULT(): {
        readonly utils: {};
        readonly js: {
            readonly tidy: ["dist/js/**/*.test.d.ts", "dist/js/**/*.test.d.ts.map", "dist/js/**/*.test.js", "dist/js/**/*.test.js.map"];
        };
        readonly scss: false;
    };
    /**
     * Whether any tests being run have passed.
     *
     * Reset to `false` in {@link TestStage.startEndNotice}.
     *
     * @category Sub-Stages
     */
    protected testStatus: boolean;
    /**
     * @category Constructor
     *
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param args     Partial overrides for the default args.
     * @param pkg      Parsed contents of the project’s package.json file.
     * @param version  Version object for the project’s version.
     */
    constructor(config: ProjectConfig, params: CLI.Params, args: Partial<Stage.Args.Test>, pkg?: Json.PackageJson, version?: SemVer);
    startEndNotice(which: "start" | "end" | null): void | Promise<void>;
    protected runSubStage(subStage: Stage.SubStage.Test): Promise<void>;
    /**
     * Not implemented.
     *
     * @category Sub-Stages
     */
    protected scss(): Promise<void>;
    /**
     * Runs jest for javascript testing.
     *
     * @category Sub-Stages
     */
    protected js(): Promise<void>;
}
//# sourceMappingURL=TestStage.d.ts.map
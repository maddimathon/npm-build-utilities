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
export declare class TestStage extends AbstractStage<Stage.SubStage.Test, Stage.Args.Test> {
    readonly subStages: Stage.SubStage.Test[];
    get ARGS_DEFAULT(): {
        readonly js: {
            readonly tidy: ["dist/js/**/*.test.d.ts", "dist/js/**/*.test.d.ts.map", "dist/js/**/*.test.js", "dist/js/**/*.test.js.map"];
        };
        readonly scss: false;
        readonly objs: {};
    };
    protected testStatus: boolean;
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor(config: ProjectConfig, params: CLI.Params, args: Partial<Stage.Args.Test>, _pkg?: Node.PackageJson, _version?: SemVer);
    /**
     * Prints a message to the console signalling the start or end of this
     * build stage.
     *
     * @param which  Whether we are starting or ending.
     */
    startEndNotice(which: "start" | "end" | null): void | Promise<void>;
    protected runSubStage(subStage: Stage.SubStage.Test): Promise<void>;
    protected scss(): Promise<void>;
    protected js(): Promise<void>;
}
//# sourceMappingURL=TestStage.d.ts.map
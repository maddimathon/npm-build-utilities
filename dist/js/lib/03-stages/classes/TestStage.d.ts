import type { Json } from '@maddimathon/utility-typescript/types';
import type { CLI, Config, Stage } from '../../../types/index.js';
import { SemVer } from '../../@internal/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default package stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 */
export declare class TestStage extends AbstractStage<Stage.Args.Test, Stage.SubStage.Test> {
    readonly subStages: Stage.SubStage.Test[];
    /**
     * Default values for {@link Stage.Args.Test | Stage.Args.Test.js.tidy}.
     *
     * These default values are made using
     * {@link Stage_Compiler.getTsConfigPaths} and
     * {@link Stage_Compiler.getTsConfigOutDir}.  Assumes that tests match the
     * globs `**\/*.test.js` and should be deleted with any maps and type
     * definitions.
     *
     * @category Config
     *
     * @param level  Depth level for output to the console.
     *
     * @since 0.2.0-alpha.draft
     */
    protected tsConfigTidyPaths(level: number): Promise<string[]>;
    get ARGS_DEFAULT(): {
        readonly js: {};
        readonly scss: false;
        readonly utils: {};
    };
    /**
     * Whether any tests being run have passed.
     *
     * Reset to empty array in {@link TestStage.startEndNotice}.
     *
     * @category Sub-Stages
     *
     * @since 0.2.0-alpha.draft — Converted from boolean to boolean[].
     */
    protected testResults: boolean[];
    /**
     * @category Constructor
     *
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param args     Partial overrides for the default args.
     * @param pkg      Parsed contents of the project’s package.json file.
     * @param version  Version object for the project’s version.
     */
    constructor(config: Config.Class, params: CLI.Params, args: Partial<Stage.Args.Test>, pkg?: Json.PackageJson, version?: SemVer);
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
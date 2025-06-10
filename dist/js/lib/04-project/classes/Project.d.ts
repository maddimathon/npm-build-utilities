/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import type { CLI, Config, Stage } from '../../../types/index.js';
import type { Logger } from '../../../types/Logger.js';
import { ProjectConfig } from '../../01-config/index.js';
import { Stage_Console } from '../../02-utils/classes/Stage_Console.js';
/**
 * Manages and runs a single project (typically used by the cli).
 *
 * @category Project
 *
 * @since 0.1.0-alpha.draft
 */
export declare class Project {
    readonly params: CLI.Params;
    /**
     * Fetches an instance of {@link internal.Stage_Console} using the given
     * info, if any.
     */
    static getConsole(opts?: {
        name?: string;
        params?: CLI.Params;
        config?: ProjectConfig;
    }): Promise<Stage_Console>;
    /**
     * The configuration object for this project.
     */
    readonly config: ProjectConfig;
    /**
     * @param config  Complete project config.
     * @param params  Complete CLI params.
     */
    constructor(config: Config.Internal | ProjectConfig, params: CLI.Params);
    /**
     * Displays some debugging information.
     *
     * @internal
     */
    protected debug<S extends Stage.Name>(console: Logger, stageClass: null | Stage.Class.All[S], stageArgs: null | Partial<Stage.Args.All[S]>, stageInstance: null | Stage.All[S]): Promise<void>;
    /**
     * Runs the given stage with the project config and current params.
     */
    run(stage: "debug" | Stage.Name): Promise<void>;
}
//# sourceMappingURL=Project.d.ts.map
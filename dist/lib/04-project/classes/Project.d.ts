/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-draft
 * @license MIT
 */
import type { CLI, Config, Logger, Stage } from '../../../types/index.js';
import { ProjectConfig } from '../../01-config/index.js';
import { Stage_Console } from '../../02-utils/classes/Stage_Console.js';
/**
 * Manages and runs a single project (typically used by the cli).
 *
 * @category Project
 *
 * @since 0.1.0-draft
 */
export declare class Project {
    readonly params: CLI.Params;
    static getConsole(opts?: {
        name?: string;
        params?: CLI.Params;
        config?: ProjectConfig;
    }): Promise<Stage_Console>;
    /**
     * The configuration for this project.
     */
    readonly config: ProjectConfig;
    /**
     * Constructs the class.
     *
     * @param config  Complete project config.
     * @param params  Complete CLI params.
     */
    constructor(config: Config.Internal | ProjectConfig, params: CLI.Params);
    /**
     * Displays some debugging information.
     */
    protected debug<S extends Stage.Name>(console: Logger, stageClass: null | Stage.ClassType.All[S], stageArgs: null | Partial<Stage.Args.All[S]>, stageInstance: null | Stage.Class.All[S]): Promise<void>;
    /**
     * Runs the given stage with the params.
     */
    run(stage: "debug" | Stage.Name): Promise<void>;
}
//# sourceMappingURL=Project.d.ts.map
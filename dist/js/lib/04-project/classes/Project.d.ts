/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.2
 * @license MIT
 */
import type { CLI, Config, Stage } from '../../../types/index.js';
import type { Logger } from '../../../types/Logger.js';
import { Stage_Console } from '../../02-utils/classes/Stage_Console.js';
import { ProjectConfig } from './ProjectConfig.js';
/**
 * Manages and runs a single project (typically used by the cli).
 *
 * @category Project
 *
 * @since 0.1.0-alpha
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
     * Handles uncaught errors in node.
     *
     * @param error  To handle.
     *
     * @since 0.2.0-alpha
     */
    static uncaughtErrorListener(error: unknown): void;
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
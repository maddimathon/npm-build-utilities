/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.1
 * @license MIT
 */
import { DummyConsole, errorHandler } from '../../@internal/index.js';
import { FileSystem } from '../../00-universal/index.js';
import { parseParamsCLI } from '../../01-config/index.js';
// import {
// } from '../../02-utils/index.js';
import { Stage_Console } from '../../02-utils/classes/Stage_Console.js';
import { defaultConfig } from '../../03-stages/defaultConfig.js';
import { ProjectConfig } from './ProjectConfig.js';
/**
 * Manages and runs a single project (typically used by the cli).
 *
 * @category Project
 *
 * @since 0.1.0-alpha
 */
export class Project {
    params;
    /* STATIC METHODS
     * ====================================================================== */
    /**
     * Fetches an instance of {@link internal.Stage_Console} using the given
     * info, if any.
     */
    static async getConsole(opts = {}) {
        const params = opts.params ?? parseParamsCLI({});
        const config =
            opts.config ?? new ProjectConfig(defaultConfig(new DummyConsole()));
        return new Stage_Console(config.clr, config, params);
    }
    /**
     * Handles uncaught errors in node.
     *
     * @param error  To handle.
     *
     * @since 0.2.0-alpha
     */
    static uncaughtErrorListener(error) {
        const console = new DummyConsole();
        const fs = new FileSystem(console);
        errorHandler(error, 0, console, fs);
    }
    /* LOCAL PROPERTIES
     * ====================================================================== */
    /**
     * The configuration object for this project.
     */
    config;
    /* CONSTRUCUTOR
     * ====================================================================== */
    /**
     * @param config  Complete project config.
     * @param params  Complete CLI params.
     */
    constructor(config, params) {
        this.params = params;
        this.config =
            config instanceof ProjectConfig ? config : (
                new ProjectConfig(config)
            );
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /**
     * Displays some debugging information.
     *
     * @internal
     */
    async debug(console, stageClass, stageArgs, stageInstance) {
        const level = this.params['log-base-level'];
        console.progress('[Project] Debugging some info...', level);
        stageClass && console.vi.progress({ stageClass }, 1 + level);
        stageArgs && console.vi.progress({ stageArgs }, 1 + level);
        stageInstance
            && console.vi.progress(
                {
                    stageInstance: {
                        params: stageInstance.params,
                        args: stageInstance.args,
                    },
                },
                1 + level,
            );
    }
    /**
     * Runs the given stage with the project config and current params.
     */
    async run(stage) {
        const console = await Project.getConsole({
            name: stage,
            config: this.config,
            params: this.params,
        });
        // returns
        if (stage === 'debug') {
            return this.debug(console, null, null, null);
        }
        const [stageClass, stageArgs = {}] =
            (await this.config.getStage(stage, console)) ?? [];
        // returns
        if (!stageClass) {
            if (this.params.debug) {
                await this.debug(
                    console,
                    stageClass ?? null,
                    stageArgs ?? null,
                    null,
                );
            }
            return;
        }
        const inst = new stageClass(this.config, this.params, stageArgs);
        process.removeListener(
            'uncaughtException',
            Project.uncaughtErrorListener,
        );
        process.on('uncaughtException', inst.uncaughtErrorListener);
        if (this.params.debug) {
            await this.debug(console, stageClass, stageArgs ?? null, inst);
        }
        await inst.run();
        process.on('uncaughtException', Project.uncaughtErrorListener);
        process.removeListener('uncaughtException', inst.uncaughtErrorListener);
    }
}
//# sourceMappingURL=Project.js.map

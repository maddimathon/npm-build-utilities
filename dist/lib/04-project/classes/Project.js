/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/npm-build-utilities@0.1.0-draft
 * @license MIT
 */
import { parseParamsCLI, ProjectConfig, } from '../../01-config/index.js';
import { Stage_Console, } from '../../02-utils/index.js';
import { defaultConfig } from '../../03-stages/defaultConfig.js';
/**
 * Manages and runs a single project (typically used by the cli).
 *
 * @category Project
 *
 * @since 0.1.0-draft
 */
export class Project {
    /* STATIC METHODS
     * ====================================================================== */
    static async getConsole(opts = {}) {
        var _a, _b, _c, _d;
        const params = (_a = opts.params) !== null && _a !== void 0 ? _a : parseParamsCLI({});
        const config = (_b = opts.config) !== null && _b !== void 0 ? _b : new ProjectConfig(defaultConfig());
        return new Stage_Console((_c = opts.name) !== null && _c !== void 0 ? _c : 'Package', config.clr, config, params, {
            clr: (_d = config.clr) !== null && _d !== void 0 ? _d : 'purple',
            ...config.console,
        });
    }
    /* CONSTRUCUTOR
     * ====================================================================== */
    /**
     * Constructs the class.
     *
     * @param config  Complete project config.
     * @param params  Complete CLI params.
     */
    constructor(config, params) {
        this.params = params;
        this.config = config instanceof ProjectConfig
            ? config
            : new ProjectConfig(config);
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /**
     * Displays some debugging information.
     */
    async debug(console, stageClass, stageArgs, stageInstance) {
        const level = this.params['log-base-level'];
        console.progress('[Project] Debugging some info...', level);
        stageClass && console.varDump.progress({ stageClass }, 1 + level);
        stageArgs && console.varDump.progress({ stageArgs }, 1 + level);
        stageInstance && console.varDump.progress({
            stageInstance: {
                // config: stageInstance.config,
                params: stageInstance.params,
                args: stageInstance.args,
            }
        }, 1 + level);
    }
    /**
     * Runs the given stage with the params.
     */
    async run(stage) {
        var _a;
        const console = await Project.getConsole({
            name: stage,
            config: this.config,
            params: this.params,
        });
        // returns
        if (stage === 'debug') {
            return this.debug(console, null, null, null);
        }
        const [stageClass, stageArgs = {},] = (_a = await this.config.getStage(stage, console, this.params)) !== null && _a !== void 0 ? _a : [];
        // returns
        if (!stageClass) {
            if (this.params.debug) {
                await this.debug(console, stageClass, stageArgs !== null && stageArgs !== void 0 ? stageArgs : null, null);
            }
            return;
        }
        const inst = new stageClass(this.config, this.params, stageArgs);
        if (this.params.debug) {
            await this.debug(console, stageClass, stageArgs !== null && stageArgs !== void 0 ? stageArgs : null, inst);
        }
        return inst.run();
    }
}
//# sourceMappingURL=Project.js.map
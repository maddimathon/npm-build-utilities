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
import { typeOf } from '@maddimathon/utility-typescript/functions/typeOf';
/**
 * A super-simple class just for the configuration of the entire project.
 *
 * Includes some utility methods and coverts a {@link Config} object into a
 * complete {@link Config.Internal} object.
 *
 * @category Config
 *
 * @since 0.1.0-draft
 */
export class ProjectConfig {
    clr;
    compiler;
    console;
    fs;
    paths;
    stages;
    title;
    constructor(config) {
        this.clr = config.clr;
        this.compiler = config.compiler ?? {};
        this.console = config.console ?? {};
        this.fs = config.fs;
        this.paths = config.paths;
        this.stages = config.stages;
        this.title = config.title;
        if (this.stages.compile
            && Array.isArray(this.stages.compile)) {
            // const _compileArgs = this.stages.compile[ 1 ] ?? {};
            if (!this.stages.compile[1]) {
                this.stages.compile[1] = {};
            }
            if (this.stages.compile[1].files
                && typeof this.stages.compile[1].files === 'object') {
                const totalPathCount = Object.values(this.stages.compile[1].files)
                    .map(arr => arr.length)
                    .reduce((runningTotal = 0, current = 0) => runningTotal + current);
                if (totalPathCount < 1) {
                    this.stages.compile[1].files = false;
                }
            }
        }
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /**
     * Gets the instance for the given stage.
     *
     * @category Fetchers
     *
     * @param stage  Stage to get.
     *
     * @return  An array with first the stage’s class and then the configured
     *          arguments for that class, if any.
     */
    async getStage(stage, console, params) {
        const stageConfig = this.stages[stage];
        // returns
        if (!stageConfig) {
            params.debug && console.progress(`no ${stage} stage config found, skipping...`, 0, { italic: true });
            return undefined;
        }
        let stageClass;
        let stageArgs;
        if (Array.isArray(stageConfig)) {
            const [_stageClass, _stageArgs,] = stageConfig;
            if (_stageClass && typeOf(_stageClass) === 'class') {
                stageClass = _stageClass;
            }
            if (_stageArgs && typeof _stageArgs === 'object') {
                stageArgs = _stageArgs;
            }
        }
        else if (stageConfig) {
            stageClass = stageConfig;
        }
        // returns
        if (!stageClass) {
            console.progress(`no valid ${stage} stage class found, skipping...`, 0, { italic: true });
            return undefined;
        }
        return [stageClass, stageArgs ?? {}];
    }
    /**
     * Returns the minimum required properties of this config.
     *
     * Useful for creating stripped-down or default configuration objects.
     */
    minimum() {
        return {
            title: this.title,
        };
    }
    /* DEFAULT METHODS
     * ====================================================================== */
    /**
     * The object shape used when converting to JSON.
     *
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description | JSON.stringify}
     */
    toJSON() {
        return this;
    }
    /**
     * Overrides the default function to return a string representation of this
     * object.
     *
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString | Object.prototype.toString()}
     */
    toString() { return JSON.stringify(this, null, 4); }
    /**
     * Overrides the default function to return an object representation of this
     * object.
     *
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf | Object.prototype.valueOf()}
     * @see {@link ProjectConfig.toJSON | ProjectConfig.toJSON()}
     */
    valueOf() { return this.toJSON(); }
}
//# sourceMappingURL=ProjectConfig.js.map
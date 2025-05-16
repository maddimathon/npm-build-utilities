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
    constructor(config) {
        var _a, _b;
        this.clr = config.clr;
        this.compiler = (_a = config.compiler) !== null && _a !== void 0 ? _a : {};
        this.console = (_b = config.console) !== null && _b !== void 0 ? _b : {};
        this.fs = config.fs;
        this.paths = config.paths;
        this.stages = config.stages;
        this.title = config.title;
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /**
     * Gets the instance for the given stage.
     *
     * @param stage  Stage to get.
     */
    async getStage(stage, console, params) {
        const stageConfig = this.stages[stage];
        // const level = 0;
        // returns
        if (!stageConfig) {
            params.debug && console.progress(`no ${stage} stage config found, skipping...`, 0, { italic: true });
            return undefined;
        }
        let stageClass;
        let stageArgs;
        if (Array.isArray(stageConfig)) {
            const [_stageClass, _subArgs,] = stageConfig;
            if (_stageClass && typeOf(_stageClass) === 'class') {
                stageClass = _stageClass;
            }
            if (_subArgs && typeof _subArgs === 'object') {
                stageArgs = _subArgs;
            }
        }
        else if (stageConfig) {
            const tmp_type = typeOf(stageConfig);
            switch (tmp_type) {
                case 'boolean':
                    break;
                case 'class':
                    stageClass = stageConfig;
                    break;
                case 'object':
                    stageArgs = stageConfig;
                    break;
            }
        }
        // returns
        if (!stageClass) {
            console.progress(`no valid ${stage} stage class found, skipping...`, 0, { italic: true });
            return undefined;
        }
        return [stageClass, stageArgs !== null && stageArgs !== void 0 ? stageArgs : {}];
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
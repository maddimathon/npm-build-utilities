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
import { mergeArgs } from '@maddimathon/utility-typescript/functions';
import { getFileSystem, } from '../../../00-universal/index.js';
import { Stage_Compiler, Stage_Console, } from '../../../02-utils/index.js';
/**
 * Abstract class for a single build stage, along with a variety of utilities
 * for building projects.
 *
 * @category Stages
 *
 * @since 0.1.0-draft
 *
 * {@include ./AbstractStage.example.md}
 */
export class AbstractStage {
    /* STATIC
     * ====================================================================== */
    /* Args ===================================== */
    /**
     * Default values for {@link Stage.Args}.
     *
     * @category Args
     */
    static get ARGS_DEFAULT() {
        return {
            args: {},
            objs: {},
        };
    }
    /* Args ===================================== */
    /**
     * Builds a complete version of this class' args, falling back to defaults
     * as needed.
     *
     * Uses {@link mergeArgs} recursively.
     *
     * @category Args
     */
    buildArgs(args) {
        return mergeArgs(this.ARGS_DEFAULT, args !== null && args !== void 0 ? args : {}, true);
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param name    Name for this stage used for notices.
     * @param clr     Colour used for colour-coding this class.
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Partial overrides for the default stage args.
     */
    constructor(name, clr, config, params, args) {
        var _a, _b;
        this.name = name;
        this.clr = clr;
        this.config = config;
        this.params = params;
        this.args = this.buildArgs(args);
        this.log = new Stage_Console(this.name, this.clr, this.config, this.params);
        this.fs = (_a = this.args.objs.fs) !== null && _a !== void 0 ? _a : getFileSystem(this.log.nc);
        this.cpl = (_b = this.args.objs.cpl) !== null && _b !== void 0 ? _b : new Stage_Compiler(this.config, this.params, this.log, this.fs, this.config.compiler);
    }
    /* METHODS
     * ====================================================================== */
    /** {@inheritDoc Stage.Class.isSubStageIncluded} */
    isSubStageIncluded(subStage, level) {
        this.params.debug && this.log.progress(`isSubStageIncluded( '${subStage}' )`, level, { italic: true });
        // returns
        if (!this.subStages.includes(subStage)) {
            return false;
        }
        this.params.debug && this.log.varDump.verbose({ 'this.params.only': this.params.only }, 1 + level, { italic: true });
        const only = {
            isUndefined: !this.params.only || !this.params.only.length,
        };
        const include = Boolean(only.isUndefined
            || this.params.only == subStage
            || this.params.only.includes(subStage));
        this.params.debug && this.log.varDump.progress({ include }, 1 + level, { italic: true });
        if (this.params.verbose && !include) {
            this.log.varDump.progress({
                include: {
                    isUndefined: only.isUndefined,
                    'this.params.only == subStage': this.params.only == subStage,
                    'this.params.only.includes( subStage )': this.params.only.includes(subStage),
                }
            }, 2 + level, { italic: true });
        }
        this.params.debug && this.log.varDump.verbose({ 'this.params.without': this.params.without }, 1 + level, { italic: true });
        const without = {
            isDefined: this.params.without || this.params.without.length,
        };
        const exclude = Boolean(without.isDefined
            && (this.params.without == subStage
                || this.params.without.includes(subStage)));
        this.params.debug && this.log.varDump.progress({ exclude }, 1 + level, { italic: true });
        if (this.params.verbose && exclude) {
            this.log.varDump.progress({
                exclude: {
                    isDefined: without.isDefined,
                    'this.params.without == subStage': this.params.without == subStage,
                    'this.params.without.includes( subStage )': this.params.without.includes(subStage),
                }
            }, 2 + level, { italic: true });
        }
        const result = Boolean(include
            && !exclude
            && this[subStage]);
        this.params.debug && this.log.varDump.progress({ 'isSubStageIncluded() return': result }, 1 + level, { italic: true });
        if (this.params.verbose && !result) {
            this.log.varDump.progress({
                include: {
                    include,
                    exclude,
                    'this[ subStage as keyof typeof this ]': Boolean(this[subStage]),
                }
            }, 2 + level, { italic: true });
        }
        return result;
    }
    /** {@inheritDoc Stage.Class.getDistDir} */
    getDistDir(subDir) {
        let result;
        switch (typeof this.config.paths.dist) {
            case 'string':
                result = this.config.paths.dist.trim().replace(/\/$/g, '') + '/' + subDir;
                break;
            case 'object':
                result = this.config.paths.dist[subDir !== null && subDir !== void 0 ? subDir : '_'];
                break;
        }
        return result;
    }
    /** {@inheritDoc Stage.Class.getSrcDir} */
    getSrcDir(subDir) {
        var _a;
        const result = (_a = this.config.paths.src[subDir]) !== null && _a !== void 0 ? _a : [];
        return Array.isArray(result) ? result : [result];
    }
    /* MESSAGES ===================================== */
    /** {@inheritDoc Stage.Class.startEndNotice} */
    startEndNotice(which, watcherVersion = false) {
        if (this.params.notice === false) {
            return;
        }
        const depth = this.params['log-base-level'];
        let linesIn = 2;
        let linesOut = 1;
        const uppercase = {
            name: this.name.toUpperCase(),
            which: (which !== null && which !== void 0 ? which : '').toUpperCase(),
        };
        const messages = (watcherVersion && (this.params.watchedWatcher
            || this.params.watchedFilename
            || this.params.watchedEvent)) ? {
            default: `👀 [watch-change-${which}] file ${this.params.watchedEvent}: ${this.params.watchedFilename}`,
            start: `🚨 [watch-change-${which}] file ${this.params.watchedEvent}: ${this.params.watchedFilename}`,
            end: `✅ [watch-change-${which}] file ${this.params.watchedEvent}: ${this.params.watchedFilename}`,
        } : {
            default: `${uppercase.which}ING ${uppercase.name}`,
            start: `${uppercase.name} ${uppercase.which}ING`,
            end: `${uppercase.name} FINISHED`,
        };
        let msg = messages.default;
        switch (which) {
            case 'start':
                msg = messages.start;
                linesOut = 0;
                if (depth < 1) {
                    linesIn += 1;
                }
                break;
            case 'end':
                msg = messages.end;
                if (depth < 1) {
                    linesOut += 1;
                }
                break;
        }
        this.log.notice([[
                msg,
                { flag: true },
            ]], 0, {
            bold: true,
            italic: false,
            linesIn,
            linesOut,
        });
    }
    /* RUNNING ===================================== */
    /**
     * Runs the entire stage (asynchronously).
     *
     * This method should probably not be overwritten, except in completely
     * custom class implementations.
     *
     * Cycles through each substage and runs {@link AbstractStage.runSubStage}
     * if {@link AbstractStage.isSubStageIncluded} returns true.
     */
    //  *
    //  * @param config  Complete project configuration.
    //  * @param params  Current CLI params.
    async run(
    // config: Config.Internal,
    // params: CLI.Params,
    ) {
        /* start */
        await this.startEndNotice('start');
        this.params.debug && this.log.varDump.progress({ subStages: this.subStages }, 1);
        /* loop through the steps in order */
        for (const method of this.subStages) {
            this.params.debug && this.log.verbose(`testing method: ${method}`, 1, { italic: true });
            if (this.isSubStageIncluded(method, ((this.params.debug && this.params.verbose) ? 2 : 1))) {
                await this.runSubStage(method);
            }
        }
        /* end */
        await this.startEndNotice('end');
    }
    /**
     * Runs the given stage as a sub-stage to the current one.
     *
     * **This method should probably not be overwritten.**
     *
     * @param stage   Stage to run as a substage.
     * @param level   Depth level to add to {@link CLI.Params.log-base-level | this.params['log-base-level']}.
     */
    //  * @param config  Current project config.
    //  * @param params  Current CLI params.
    async runStage(stage, level) {
        var _a;
        const onlyKey = `only-${stage}`;
        const withoutKey = `without-${stage}`;
        const subParams = {
            ...this.params,
            'log-base-level': level + this.params['log-base-level'],
            only: this.params[onlyKey],
            without: this.params[withoutKey],
        };
        const [stageClass, stageArgs = {},] = (_a = await this.config.getStage(stage, new Stage_Console(stage, this.clr, this.config, subParams), this.params)) !== null && _a !== void 0 ? _a : [];
        // returns
        if (!stageClass) {
            return;
        }
        this.params.debug && this.log.varDump.verbose({ subParams }, level);
        return (new stageClass(this.config, subParams, { ...this.args, ...stageArgs })).run();
    }
}
//# sourceMappingURL=AbstractStage.js.map
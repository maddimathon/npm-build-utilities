/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-alpha.draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import { mergeArgs, toTitleCase } from '@maddimathon/utility-typescript/functions';
import { errorHandler, SemVer, } from '../../../@internal/index.js';
import { FileSystem, } from '../../../00-universal/index.js';
import { getPackageJson } from '../../../00-universal/getPackageJson.js';
// import {
// } from '../../../02-utils/index.js';
import { Stage_Console } from '../../../02-utils/classes/Stage_Console.js';
import { Stage_Compiler } from '../../../02-utils/classes/Stage_Compiler.js';
/**
 * Abstract class for a single build stage, along with a variety of utilities
 * for building projects.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 *
 * {@include ./AbstractStage.example.md}
 */
export class AbstractStage {
    _pkg;
    _version;
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
            objs: {},
        };
    }
    /* PROPERTIES
     * ====================================================================== */
    /**
     * {@inheritDoc Stage.Class.clr}
     *
     * @category Args
     */
    clr;
    /**
     * {@inheritDoc Stage.Class.config}
     *
     * @category Args
     */
    config;
    /**
     * {@inheritDoc Stage.Class.console}
     *
     * @category Utilities
     */
    console;
    /**
     * Instance used to compile from the src directory.
     *
     * @category Utilities
     */
    cpl;
    /**
     * Instance used to deal with files and paths.
     *
     * @category Utilities
     */
    fs;
    /**
     * {@inheritDoc Stage.Class.name}
     *
     * @category Args
     */
    name;
    /**
     * {@inheritDoc Stage.Class.params}
     *
     * @category Args
     */
    params;
    /**
     * {@inheritDoc Stage.Class.pkg}
     *
     * @category Project
     */
    get pkg() {
        if (typeof this._pkg === 'undefined') {
            this._pkg = this.try(getPackageJson, 1, [this.fs]);
        }
        return {
            name: this._pkg.name,
            version: this._pkg.version,
            description: this._pkg.description,
            homepage: this._pkg.homepage,
        };
    }
    /**
     * {@inheritDoc Stage.Class.version}
     *
     * @category Project
     */
    get version() {
        if (typeof this._version === 'undefined') {
            this._version = new SemVer(this.pkg.version ?? '0.0.0', this.console);
        }
        return this._version;
    }
    set version(input) {
        if (!input) {
            return;
        }
        // returns
        if (input instanceof SemVer) {
            this._version = input;
            return;
        }
        this._version = new SemVer(input, this.console);
        if (this._pkg) {
            this._pkg.version = this._version.toString();
        }
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
        return mergeArgs(this.ARGS_DEFAULT, args ?? {}, true);
    }
    /**
     * {@inheritDoc Stage.Class.args}
     *
     * @category Args
     */
    args;
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param name    Name for this stage used for notices.
     * @param clr     Colour used for colour-coding this class.
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Partial overrides for the default stage args.
     */
    constructor(name, clr, config, params, args, _pkg, _version) {
        this._pkg = _pkg;
        this._version = _version;
        this.name = name;
        this.clr = clr;
        this.config = config;
        this.params = params;
        this.args = this.buildArgs(args);
        this.console = new Stage_Console(this.clr, this.config, this.params);
        this.fs = this.args.objs.fs ?? new FileSystem(this.console, this.config.fs);
        this.cpl = this.args.objs.cpl ?? new Stage_Compiler(this.config, this.params, this.console, this.fs, this.config.compiler);
        this.version = _version;
    }
    /* METHODS
     * ====================================================================== */
    /** {@inheritDoc Stage.Class.isDraftVersion} */
    get isDraftVersion() {
        return !(this.params?.packaging || this.params?.releasing) || !!this.params?.dryrun;
    }
    /* CONFIG & ARGS ===================================== */
    /** {@inheritDoc Stage.Class.isSubStageIncluded} */
    isSubStageIncluded(subStage, level) {
        this.params.debug && this.console.progress(`isSubStageIncluded( '${subStage}' )`, level, { italic: true });
        // returns
        if (!(subStage in this) || typeof this[subStage] !== 'function') {
            return false;
        }
        // returns
        if (!this.subStages.includes(subStage)) {
            return false;
        }
        this.params.debug && this.console.vi.verbose({ 'this.params.only': this.params.only }, 1 + level, { italic: true });
        const only = {
            isUndefined: !this.params.only || !this.params.only.length,
        };
        const include = Boolean(only.isUndefined
            || this.params.only == subStage
            || this.params.only.includes(subStage));
        this.console.vi.debug({ include }, 1 + level, { italic: true });
        if (this.params.verbose && !include) {
            this.console.vi.progress({
                include: {
                    isUndefined: only.isUndefined,
                    'this.params.only == subStage': this.params.only == subStage,
                    'this.params.only.includes( subStage )': this.params.only.includes(subStage),
                }
            }, 2 + level, { italic: true });
        }
        this.params.debug && this.console.vi.verbose({ 'this.params.without': this.params.without }, 1 + level, { italic: true });
        const without = {
            isDefined: this.params.without || this.params.without.length,
        };
        const exclude = Boolean(without.isDefined
            && (this.params.without == subStage
                || this.params.without.includes(subStage)));
        this.console.vi.debug({ exclude }, 1 + level, { italic: true });
        if (this.params.verbose && exclude) {
            this.console.vi.progress({
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
        this.console.vi.debug({ 'isSubStageIncluded() return': result }, 1 + level, { italic: true });
        if (this.params.verbose && !result) {
            this.console.vi.progress({
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
                const distDir = this.config.paths.dist.trim().replace(/\/$/g, '');
                // returns
                if (!subDir) {
                    return distDir;
                }
                return distDir + '/' + subDir;
            case 'object':
                result = this.config.paths.dist[subDir ?? '_'];
                break;
        }
        return result;
    }
    /** {@inheritDoc Stage.Class.getSrcDir} */
    getSrcDir(subDir) {
        if (!subDir) {
            const result = this.config.paths.src._;
            return result;
        }
        const result = this.config.paths.src[subDir ?? '_'] ?? [];
        return Array.isArray(result) ? result : [result];
    }
    /* ERRORS ===================================== */
    handleError(error, level, args) {
        errorHandler(error, level, this.console, this.fs, args);
    }
    /**
     * Runs a function, with parameters as applicable, and catches (& handles)
     * anything thrown.
     *
     * Overloaded for better function param typing.
     *
     * @category Errors
     *
     * @experimental
     */
    try(tryer, level, params) {
        try {
            return tryer(...(params ?? []));
        }
        catch (error) {
            this.handleError(error, level);
            throw error;
        }
    }
    /* MESSAGES ===================================== */
    /** {@inheritDoc Stage.Class.startEndNotice} */
    startEndNotice(which, watcherVersion = false) {
        if (!this.params.notice) {
            return;
        }
        const uppercase = {
            name: this.name.toUpperCase(),
            which: which?.toUpperCase() ?? '',
        };
        const messages = (watcherVersion && (this.params.watchedWatcher
            || this.params.watchedFilename
            || this.params.watchedEvent)) ? {
            default: [['👀 ', { flag: false }], [`[watch-change-${which}] file ${this.params.watchedEvent}: ${this.params.watchedFilename}`]],
            start: [['🚨 ', { flag: false }], [`[watch-change-${which}] file ${this.params.watchedEvent}: ${this.params.watchedFilename}`]],
            end: [['✅ ', { flag: false }], [`[watch-change-${which}] file ${this.params.watchedEvent}: ${this.params.watchedFilename}`]],
        } : {
            default: [[`${uppercase.which}ING ${uppercase.name}`]],
            start: [[`${uppercase.name} ${uppercase.which}ING...`]],
            end: [['✓ ', { flag: false }], [`${toTitleCase(this.name)} Complete!`, { italic: true }]],
        };
        this.console.startOrEnd(messages[which ?? 'default'], which);
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
    async run() {
        /* start */
        await this.startEndNotice('start');
        this.console.vi.debug({ subStages: this.subStages }, 1);
        /* loop through the steps in order */
        for (const method of this.subStages) {
            this.params.debug && this.console.verbose(`testing method: ${method}`, 1, { italic: true });
            if ((method in this)
                && typeof this[method] === 'function'
                && this.isSubStageIncluded(method, ((this.params.debug && this.params.verbose) ? 2 : 1))) {
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
    async runStage(stage, level) {
        const onlyKey = `only-${stage}`;
        const withoutKey = `without-${stage}`;
        const subParams = {
            ...this.params,
            'log-base-level': level + this.params['log-base-level'],
            only: this.params[onlyKey],
            without: this.params[withoutKey],
        };
        const t_subConsole = new Stage_Console(this.clr, this.config, subParams);
        const [stageClass, stageArgs = {},] = await this.config.getStage(stage, t_subConsole) ?? [];
        // returns
        if (!stageClass) {
            return;
        }
        this.params.debug && this.console.vi.verbose({ subParams }, level);
        return (new stageClass(this.config, subParams, { ...this.args, ...stageArgs }, this._pkg, this._version)).run();
    }
}
//# sourceMappingURL=AbstractStage.js.map
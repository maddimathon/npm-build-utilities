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
import { errorHandler, } from '../../../@internal/index.js';
import { FileSystem, } from '../../../00-universal/index.js';
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
     * {@inheritDoc Stage.Class.log}
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
     * {@inheritDoc Stage.Class.log}
     *
     * @category Utilities
     */
    log;
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
    constructor(name, clr, config, params, args) {
        this.name = name;
        this.clr = clr;
        this.config = config;
        this.params = params;
        this.args = this.buildArgs(args);
        this.console = new Stage_Console(this.name, this.clr, this.config, this.params);
        this.log = this.console;
        this.fs = this.args.objs.fs ?? new FileSystem(this.console, this.config.fs);
        this.cpl = this.args.objs.cpl ?? new Stage_Compiler(this.config, this.params, this.console, this.fs, this.config.compiler);
    }
    /* METHODS
     * ====================================================================== */
    /* CONFIG & ARGS ===================================== */
    /** {@inheritDoc Stage.Class.isSubStageIncluded} */
    isSubStageIncluded(subStage, level) {
        this.params.debug && this.console.progress(`isSubStageIncluded( '${subStage}' )`, level, { italic: true });
        // returns
        if (!this.subStages.includes(subStage)) {
            return false;
        }
        this.params.debug && this.console.varDump.verbose({ 'this.params.only': this.params.only }, 1 + level, { italic: true });
        const only = {
            isUndefined: !this.params.only || !this.params.only.length,
        };
        const include = Boolean(only.isUndefined
            || this.params.only == subStage
            || this.params.only.includes(subStage));
        this.params.debug && this.console.varDump.progress({ include }, 1 + level, { italic: true });
        if (this.params.verbose && !include) {
            this.console.varDump.progress({
                include: {
                    isUndefined: only.isUndefined,
                    'this.params.only == subStage': this.params.only == subStage,
                    'this.params.only.includes( subStage )': this.params.only.includes(subStage),
                }
            }, 2 + level, { italic: true });
        }
        this.params.debug && this.console.varDump.verbose({ 'this.params.without': this.params.without }, 1 + level, { italic: true });
        const without = {
            isDefined: this.params.without || this.params.without.length,
        };
        const exclude = Boolean(without.isDefined
            && (this.params.without == subStage
                || this.params.without.includes(subStage)));
        this.params.debug && this.console.varDump.progress({ exclude }, 1 + level, { italic: true });
        if (this.params.verbose && exclude) {
            this.console.varDump.progress({
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
        this.params.debug && this.console.varDump.progress({ 'isSubStageIncluded() return': result }, 1 + level, { italic: true });
        if (this.params.verbose && !result) {
            this.console.varDump.progress({
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
        errorHandler(error, level, this.console, args);
    }
    // protected try<
    //     Params extends never[],
    //     Return extends unknown,
    // >(
    //     tryer: ( ...params: Params ) => Return,
    //     level: number,
    //     params?: Params,
    //     callback?: (
    //         | null
    //         | LocalError.Handler
    //         | [ LocalError.Handler, Partial<LocalError.Handler.Args> ]
    //     ),
    // ): Return;
    // protected try<
    //     Params extends unknown[],
    //     Return extends unknown,
    // >(
    //     tryer: ( ...params: Params ) => Return,
    //     level: number,
    //     params: Params,
    //     callback?: (
    //         | null
    //         | LocalError.Handler
    //         | [ LocalError.Handler, Partial<LocalError.Handler.Args> ]
    //     ),
    // ): Return;
    // /**
    //  * Runs a function, with parameters as applicable, and catches (& handles)
    //  * anything thrown.
    //  * 
    //  * Overloaded for better function param typing.
    //  */
    // protected try<
    //     Params extends unknown[] | never[],
    //     Return extends unknown,
    // >(
    //     tryer: ( ...params: Params ) => Return,
    //     level: number,
    //     params?: Params,
    //     callback: (
    //         | null
    //         | LocalError.Handler
    //         | [ LocalError.Handler, Partial<LocalError.Handler.Args> ]
    //     ) = null,
    // ): Return {
    //     try {
    //         return (
    //             params
    //                 ? tryer( ...params )
    //                 // @ts-expect-error
    //                 : tryer()
    //         );
    //     } catch ( error ) {
    //         let callbackArgs: Partial<LocalError.Handler.Args> = {};
    //         if ( !callback ) {
    //             callback = errorHandler;
    //         } else if ( Array.isArray( callback ) ) {
    //             callbackArgs = callback[ 1 ];
    //             callback = callback[ 0 ];
    //         }
    //         callback(
    //             error as LocalError.Input,
    //             level,
    //             this.console,
    //             callbackArgs
    //         );
    //         throw error;
    //     }
    // }
    /* MESSAGES ===================================== */
    /** {@inheritDoc Stage.Class.startEndNotice} */
    startEndNotice(which, watcherVersion = false, stageNameOverride = null) {
        if (this.params.notice === false) {
            return;
        }
        const depth = this.params['log-base-level'];
        let linesIn = 2;
        let linesOut = 1;
        const uppercase = {
            name: (stageNameOverride ?? this.name).toUpperCase(),
            which: (which ?? '').toUpperCase(),
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
        this.console.notice([[
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
    async run() {
        /* start */
        await this.startEndNotice('start');
        this.params.debug && this.console.varDump.progress({ subStages: this.subStages }, 1);
        /* loop through the steps in order */
        for (const method of this.subStages) {
            this.params.debug && this.console.verbose(`testing method: ${method}`, 1, { italic: true });
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
        const onlyKey = `only-${stage}`;
        const withoutKey = `without-${stage}`;
        const subParams = {
            ...this.params,
            'log-base-level': level + this.params['log-base-level'],
            only: this.params[onlyKey],
            without: this.params[withoutKey],
        };
        const [stageClass, stageArgs = {},] = await this.config.getStage(stage, new Stage_Console(stage, this.clr, this.config, subParams), this.params) ?? [];
        // returns
        if (!stageClass) {
            return;
        }
        this.params.debug && this.console.varDump.verbose({ subParams }, level);
        return (new stageClass(this.config, subParams, { ...this.args, ...stageArgs })).run();
    }
}
//# sourceMappingURL=AbstractStage.js.map
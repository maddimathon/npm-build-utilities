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
import { mergeArgs, } from '@maddimathon/utility-typescript/functions';
import { node, VariableInspector, } from '@maddimathon/utility-typescript/classes';
/**
 * To be used by {@link AbstractStage} and those that inherit from it.
 *
 * Includes a variety of utilities for printing messages to the console.
 *
 * @category Utilities
 *
 * @since 0.1.0-draft
 *
 * @internal
 */
export class Stage_Console {
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param name    Name for this stage used for notices.
     * @param clr     {@inheritDoc Stage.Class.clr}
     * @param config  Current project config.
     * @param params  Current CLI params.
     * @param utils   Optional. Partial argument overrides for classes used
     *                within this one.
     */
    constructor(name, clr, config, params, utils) {
        var _a, _b, _c, _d, _e;
        this.name = name;
        this.clr = clr;
        this.config = config;
        this.params = params;
        const ncInputArgs = mergeArgs((_a = this.config.console.nc) !== null && _a !== void 0 ? _a : {}, (_b = utils === null || utils === void 0 ? void 0 : utils.nc) !== null && _b !== void 0 ? _b : {}, true);
        this.nc = new node.NodeConsole({
            ...ncInputArgs,
            msgMaker: {
                ...(_c = ncInputArgs.msgMaker) !== null && _c !== void 0 ? _c : {},
                msg: {
                    clr: this.clr,
                    ...(_e = (_d = ncInputArgs.msgMaker) === null || _d === void 0 ? void 0 : _d.msg) !== null && _e !== void 0 ? _e : {},
                },
            },
        });
        this.varDump = new _Stage_Console_VarInspect(this.name, this.config, this.params, this.msgArgs, {
            nc: this.nc,
        });
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /**
     * Creates an argument object used to print messages to the terminal, adding
     * styling defaults by depth level.
     *
     * @category Messagers
     *
     * @see {@link AbstractStage.clr}  Default colour for the message.
     *
     * @param level     Depth level for this message (above the value of
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     *
     * @return  An object with arguments separated by message (`msg`) and time.
     */
    msgArgs(level = 0, msgArgs = {}, timeArgs = {}) {
        var _a, _b, _c, _d, _e;
        const depth = level + Number(this.params['log-base-level']);
        const msg = {
            bold: depth == 0 || level <= 1,
            clr: this.clr,
            depth,
            linesIn: 0,
            linesOut: 0,
            ...msgArgs,
        };
        const time = {
            ...timeArgs,
        };
        if (level <= 0) {
            msg.linesIn = (_a = msgArgs.linesIn) !== null && _a !== void 0 ? _a : 2;
        }
        if (level > 0) {
            msg.linesIn = (_b = msgArgs.linesIn) !== null && _b !== void 0 ? _b : 1;
        }
        // if ( level > 1 ) {
        // }
        if (level > 2) {
            msg.italic = (_c = msgArgs.italic) !== null && _c !== void 0 ? _c : true;
            msg.linesIn = (_d = msgArgs.linesIn) !== null && _d !== void 0 ? _d : 0;
        }
        if (level > 3) {
            msg.clr = (_e = msgArgs.clr) !== null && _e !== void 0 ? _e : 'grey';
        }
        return { msg, time };
    }
    /**
     * Prints a timestamped log message to the console.
     *
     * @category Messagers
     *
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     *
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    log(msg, level, msgArgs, timeArgs) {
        const args = this.msgArgs(level, msgArgs, timeArgs);
        this.nc.timestampLog(msg, args.msg, args.time);
    }
    /**
     * Prints a timestamped log message to the console. Only if
     * `{@link Stage.Args}.notice` is truthy.
     *
     * @category Messagers
     *
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     *
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    notice(msg, level, msgArgs, timeArgs) {
        if (this.params.notice === false) {
            return;
        }
        this.log(msg, level, msgArgs, timeArgs);
    }
    /**
     * Prints a timestamped log message to the console. Only if
     * `{@link Stage.Args}.notice` is truthy.
     *
     * @category Messagers
     *
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     *
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    progress(msg, level, msgArgs, timeArgs) {
        if (this.params.progress === false) {
            return;
        }
        this.log(msg, level, msgArgs, timeArgs);
    }
    /**
     * Method for printing a log message to the console. Only if
     * `{@link Stage.Args}.verbose` is truthy.
     *
     * Alias for {@link AbstractStage.progressLog}.
     *
     * @category Messagers
     *
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    verbose(msg, level, msgArgs, timeArgs) {
        if (!this.params.verbose) {
            return;
        }
        this.log(msg, level, msgArgs, timeArgs);
    }
}
// /**
//  * Used only for {@link Stage_Console}.
//  * 
//  * @category Utilities
//  * 
//  * @since 0.1.0-draft
//  */
// export namespace Stage_Console {
// }
/**
 * To be used by {@link Stage_Console}.
 *
 * Includes a variety of utilities for printing messages to the console.
 *
 * @category Utilities
 *
 * @since 0.1.0-draft
 *
 * @private
 * @internal
 */
export class _Stage_Console_VarInspect {
    /* Args ===================================== */
    /**
     * Default values for the args property.
     *
     * @category Args
     */
    get ARGS_DEFAULT() {
        return {
            clr: 'black',
            nc: {},
        };
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param name    Name for this stage used for notices.
     * @param config  Current project config.
     * @param params  Current CLI params.
     * @param msgArgs
     * @param utils   Optional. Partial argument overrides for classes used
     *                within this one.
     */
    constructor(name, config, params, msgArgs, utils) {
        this.name = name;
        this.config = config;
        this.params = params;
        this.msgArgs = msgArgs;
        this.nc = utils.nc;
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /**
     * Gets a simple, unformatted inspection string.
     */
    varString(variable) {
        return VariableInspector.stringify(variable).replace(/\n\s*\n/gi, '\n');
    }
    /**
     * Prints a timestamped log message to the console.
     *
     * @category Messagers
     *
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     *
     * @param variable  Variable to inspect.
     * @param level     Depth level for this message (above the value of
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    log(variable, level, msgArgs, timeArgs) {
        const args = this.msgArgs(level, msgArgs, timeArgs);
        this.nc.timestampLog(this.varString(variable), args.msg, args.time);
    }
    /**
     * Prints a timestamped log message to the console. Only if
     * `{@link Stage.Args}.notice` is truthy.
     *
     * @category Messagers
     *
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     *
     * @param variable  Variable to inspect.
     * @param level     Depth level for this message (above the value of
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    notice(variable, level, msgArgs, timeArgs) {
        if (this.params.notice === false) {
            return;
        }
        this.log(variable, level, msgArgs, timeArgs);
    }
    /**
     * Prints a timestamped log message to the console. Only if
     * `{@link Stage.Args}.notice` is truthy.
     *
     * @category Messagers
     *
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     *
     * @param variable  Variable to inspect.
     * @param level     Depth level for this message (above the value of
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    progress(variable, level, msgArgs, timeArgs) {
        if (this.params.progress === false) {
            return;
        }
        this.log(variable, level, msgArgs, timeArgs);
    }
    /**
     * Method for printing a log message to the console. Only if
     * `{@link Stage.Args}.verbose` is truthy.
     *
     * Alias for {@link AbstractStage.progressLog}.
     *
     * @category Messagers
     *
     * @param variable  Variable to inspect.
     * @param level     Depth level for this message (above the value of
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    verbose(variable, level, msgArgs, timeArgs) {
        if (!this.params.verbose) {
            return;
        }
        this.log(variable, level, msgArgs, timeArgs);
    }
}
//# sourceMappingURL=Stage_Console.js.map
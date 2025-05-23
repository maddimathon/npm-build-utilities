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
    name;
    clr;
    config;
    params;
    /* LOCAL PROPERTIES
     * ====================================================================== */
    /** {@inheritDoc Stage.Console.nc} */
    nc;
    /**
     * Instance to use within the class.
     */
    varDump;
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param name    Name for this stage used for notices.
     * @param clr     Colour slug for this colour-coding this class.
     * @param config  Current project config.
     * @param params  Current CLI params.
     * @param utils   Optional. Partial argument overrides for classes used
     *                within this one.
     */
    constructor(name, clr, config, params, utils) {
        this.name = name;
        this.clr = clr;
        this.config = config;
        this.params = params;
        const ncInputArgs = mergeArgs(this.config.console.nc ?? {}, utils?.nc ?? {}, true);
        this.nc = new node.NodeConsole({
            ...ncInputArgs,
            msgMaker: {
                ...ncInputArgs.msgMaker ?? {},
                msg: {
                    clr: this.clr,
                    ...ncInputArgs.msgMaker?.msg ?? {},
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
            msg.linesIn = msgArgs.linesIn ?? 2;
        }
        if (level > 0) {
            msg.linesIn = msgArgs.linesIn ?? 1;
        }
        // if ( level > 1 ) {
        // }
        if (level > 2) {
            msg.italic = msgArgs.italic ?? true;
            msg.linesIn = msgArgs.linesIn ?? 0;
        }
        if (level > 3) {
            msg.clr = msgArgs.clr ?? 'grey';
        }
        return { msg, time };
    }
    error(msg, level, msgArgs = {}, timeArgs = {}) {
        const args = this.msgArgs(level, msgArgs, timeArgs);
        this.nc.timestampLog(msg, args.msg, args.time);
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
    name;
    config;
    params;
    msgArgs;
    /* LOCAL PROPERTIES
     * ====================================================================== */
    /**
     * Instance to use within the class.
     */
    nc;
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
    varString(variable, args) {
        return VariableInspector.stringify(variable, args).replace(/\n\s*\n/gi, '\n');
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
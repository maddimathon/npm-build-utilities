/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-draft
 * @license MIT
 */
// import type {
// } from '@maddimathon/utility-typescript/types';
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
    clr;
    config;
    params;
    /* LOCAL PROPERTIES
     * ====================================================================== */
    /** {@inheritDoc Logger.nc} */
    nc;
    /** {@inheritDoc Logger.vi} */
    vi;
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param clr     Colour slug for this colour-coding this class.
     * @param config  Current project config.
     * @param params  Current CLI params.
     */
    //  * @param name    Name for this stage used for notices.
    //  * @param utils   Optional. Partial argument overrides for classes used 
    //  *                within this one.
    constructor(
    // public readonly name: string,
    clr, config, params) {
        this.clr = clr;
        this.config = config;
        this.params = params;
        this.nc = new node.NodeConsole(mergeArgs(this.config.console.nc ?? {}, {
            msgMaker: {
                msg: {
                    clr: this.clr,
                },
            },
        }, true));
        this.msgArgs = this.msgArgs.bind(this);
        this.vi = new _Stage_Console_VarInspect(
        // this.name,
        this.config, this.params, this.msgArgs, this.nc);
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /**
     * Creates an argument object used to print messages to the terminal, adding
     * styling defaults by depth level.
     *
     * @see {@link Stage_Console.clr}  Default colour for the message.
     *
     * @param level     Depth level for this message (above the value of
     *                  {@link CLI.Params.log-base-level}).
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
    // /**
    //  * Prints a timestamped log message to the console. Only if 
    //  * `{@link Stage.Args}.debug` is truthy.
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.debug} */
    debug(msg, level, msgArgs, timeArgs) {
        if (!this.params.debug) {
            return;
        }
        this.log(msg, level, msgArgs, timeArgs);
    }
    /** {@inheritDoc Logger.error} */
    error(msg, level, msgArgs = {}, timeArgs = {}) {
        this.log(msg, level, msgArgs, timeArgs);
    }
    // /**
    //  * Prints a timestamped log message to the console.
    //  * 
    //  * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.log} */
    log(msg, level, msgArgs, timeArgs) {
        const args = this.msgArgs(level, msgArgs, timeArgs);
        this.nc.timestampLog(msg, args.msg, args.time);
    }
    // /**
    //  * Prints a timestamped log message to the console. Only if 
    //  * `{@link Stage.Args}.notice` is truthy.
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.notice} */
    notice(msg, level, msgArgs, timeArgs) {
        if (!this.params.notice) {
            return;
        }
        this.log(msg, level, msgArgs, timeArgs);
    }
    // /**
    //  * Prints a timestamped log message to the console. Only if 
    //  * `{@link Stage.Args}.notice` is truthy.
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.progress} */
    progress(msg, level, msgArgs, timeArgs) {
        if (!this.params.progress) {
            return;
        }
        this.log(msg, level, msgArgs, timeArgs);
    }
    // /**
    //  * Prints a timestamped log message to the console. Only if 
    //  * `{@link Stage.Args}.notice` is truthy.
    //  * 
    //  * **Doesn't currently actually warn.**
    //  * @todo
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /**
     * {@inheritDoc Logger.debug}
     *
     * @todo
     * **Doesn't currently actually warn.**
     */
    warn(msg, level, msgArgs, timeArgs) {
        this.log(msg, level, msgArgs, timeArgs);
    }
    // /**
    //  * Method for printing a log message to the console. Only if 
    //  * `{@link Stage.Args}.verbose` is truthy.
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.verbose} */
    verbose(msg, level, msgArgs, timeArgs) {
        if (!this.params.verbose) {
            return;
        }
        this.log(msg, level, msgArgs, timeArgs);
    }
}
/**
 * To be used by {@link Stage_Console}.
 *
 * Includes a variety of utilities for printing variable inspections to the console.
 *
 * @category Utilities
 *
 * @since 0.1.0-draft
 *
 * @internal
 * @private
 */
export class _Stage_Console_VarInspect {
    config;
    params;
    msgArgs;
    nc;
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param msgArgs  Function to construct a {@link MessageMaker.MsgArgs} object.
     * @param nc       Instance to use within the class.
     */
    //  * @param name     Name for this stage used for notices.
    constructor(
    // public readonly name: string,
    config, params, msgArgs, nc) {
        this.config = config;
        this.params = params;
        this.msgArgs = msgArgs;
        this.nc = nc;
    }
    /* LOCAL METHODS
     * ====================================================================== */
    // /**
    //  * Prints a timestamped log message to the console.
    //  * 
    //  * @param variable  Variable to inspect.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.VarInspect.log} */
    log(variable, level, msgArgs, timeArgs) {
        const args = this.msgArgs(level, msgArgs, timeArgs);
        this.nc.timestampLog(this.stringify(variable), args.msg, args.time);
    }
    // /**
    //  * Prints a timestamped log message to the console. Only if 
    //  * `{@link Stage.Args}.notice` is truthy.
    //  * 
    //  * @param variable  Variable to inspect.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.VarInspect.notice} */
    notice(variable, level, msgArgs, timeArgs) {
        if (this.params.notice === false) {
            return;
        }
        this.log(variable, level, msgArgs, timeArgs);
    }
    // /**
    //  * Prints a timestamped log message to the console. Only if 
    //  * `{@link Stage.Args}.notice` is truthy.
    //  * 
    //  * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
    //  * 
    //  * @param variable  Variable to inspect.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.VarInspect.progress} */
    progress(variable, level, msgArgs, timeArgs) {
        if (this.params.progress === false) {
            return;
        }
        this.log(variable, level, msgArgs, timeArgs);
    }
    /** {@inheritDoc Logger.VarInspect.stringify} */
    stringify(variable, args) {
        return VariableInspector.stringify(variable, args).replace(/\n\s*\n/gi, '\n');
    }
    // /**
    //  * Method for printing a log message to the console. Only if 
    //  * `{@link Stage.Args}.verbose` is truthy.
    //  * 
    //  * Alias for {@link AbstractStage.progressLog}.
    //  * 
    //  * @param variable  Variable to inspect.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.VarInspect.verbose} */
    verbose(variable, level, msgArgs, timeArgs) {
        if (!this.params.verbose) {
            return;
        }
        this.log(variable, level, msgArgs, timeArgs);
    }
}
//# sourceMappingURL=Stage_Console.js.map
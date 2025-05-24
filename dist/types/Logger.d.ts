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
import type { Objects } from '@maddimathon/utility-typescript/types';
import { MessageMaker, node, VariableInspector } from '@maddimathon/utility-typescript/classes';
/**
 * Shape of a logging utility class to be available within the library.
 *
 * These objects probably output to the console, but could also record errors to
 * log files or output in any other way.
 *
 * @category Types
 *
 * @since 0.1.0-alpha.draft
 */
export interface Logger extends Objects.Logger<Logger.MethodParams, Logger.ErrorParams, Logger.MessageInput, Logger.ErrorInput> {
    /**
     * Instance to use within/out the class.
     */
    readonly nc: node.NodeConsole;
    /**
     * Adds {@link VariableInspector} capabilities to the logger.
     */
    readonly vi: Logger.VarInspect;
    /**
     * Method for printing a log message to the console. Only if
     * {@link CLI.Params.debug} is truthy.
     *
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of
     *                  {@link CLI.Params.log-base-level}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    debug(msg: Parameters<Logger['log']>[0], level: Parameters<Logger['log']>[1], msgArgs?: Parameters<Logger['log']>[2], timeArgs?: Parameters<Logger['log']>[3]): void;
    /**
     * Outputs the given error message to the console.
     *
     * @param msg       Error message(s).
     * @param level     Depth level for this message (above the value of
     *                  {@link CLI.Params.log-base-level}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    error(msg: MessageMaker.BulkMsgs, level: number, msgArgs?: Partial<MessageMaker.BulkMsgArgs>, timeArgs?: Partial<MessageMaker.BulkMsgArgs>): void;
    /**
     * Prints a timestamped log message to the console.
     *
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of
     *                  {@link CLI.Params.log-base-level}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    log(msg: string | string[] | MessageMaker.BulkMsgs, level: number, msgArgs?: Partial<MessageMaker.BulkMsgArgs>, timeArgs?: Partial<MessageMaker.BulkMsgArgs>): void;
    /**
     * Prints a timestamped log message to the console. Only if
     * {@link CLI.Params.notice} is truthy.
     *
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of
     *                  {@link CLI.Params.log-base-level}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    notice(msg: Parameters<Logger['log']>[0], level: Parameters<Logger['log']>[1], msgArgs?: Parameters<Logger['log']>[2], timeArgs?: Parameters<Logger['log']>[3]): void;
    /**
     * Prints a timestamped log message to the console. Only if
     * {@link CLI.Params.progress} is truthy.
     *
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of
     *                  {@link CLI.Params.log-base-level}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    progress(msg: Parameters<Logger['log']>[0], level: Parameters<Logger['log']>[1], msgArgs?: Parameters<Logger['log']>[2], timeArgs?: Parameters<Logger['log']>[3]): void;
    /**
     * Outputs the given warning message to the console.
     *
     * @param msg       Warning message(s).
     * @param level     Depth level for this message (above the value of
     *                  {@link CLI.Params.log-base-level}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    warn(msg: MessageMaker.BulkMsgs, level: number, msgArgs?: Partial<MessageMaker.BulkMsgArgs>, timeArgs?: Partial<MessageMaker.BulkMsgArgs>): void;
    /**
     * Method for printing a log message to the console. Only if
     * {@link CLI.Params.verbose} is truthy.
     *
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of
     *                  {@link CLI.Params.log-base-level}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    verbose(msg: Parameters<Logger['log']>[0], level: Parameters<Logger['log']>[1], msgArgs?: Parameters<Logger['log']>[2], timeArgs?: Parameters<Logger['log']>[3]): void;
}
/**
 * Type utilities for {@link Logger} classes.
 *
 * @category Types
 *
 * @since 0.1.0-alpha.draft
 */
export declare namespace Logger {
    /**
     * Optional configuration for {@link Logger} classes.
     *
     * @since 0.1.0-alpha.draft
     */
    interface Args {
        /**
         * Colour used for colour-coding the stage.
         */
        clr: MessageMaker.Colour;
        /**
         * Arguments passed to the {@link node.NodeConsole} constructor.
         */
        nc: Objects.RecursivePartial<node.NodeConsole.Args>;
    }
    /**
     * Used for extending {@link Objects.Logger}.
     */
    type ErrorInput = MessageMaker.BulkMsgs;
    /**
     * Used for extending {@link Objects.Logger}.
     */
    type ErrorParams = [
        number,
        Partial<MessageMaker.BulkMsgArgs>,
        Partial<MessageMaker.BulkMsgArgs>
    ];
    /**
     * Used for extending {@link Objects.Logger}.
     */
    type MessageInput = string | string[] | MessageMaker.BulkMsgs;
    /**
     * Used for extending {@link Objects.Logger}.
     */
    type MethodParams = [
        number,
        Partial<MessageMaker.BulkMsgArgs>,
        Partial<MessageMaker.BulkMsgArgs>
    ];
    /**
     * Shape of the variable inspection utility class to be available in each
     * {@link Logger}.
     *
     * @see {@link VariableInspector}  Used to inspect variables.
     */
    interface VarInspect {
        /**
         * Prints a timestamped log message to the console. Only if
         * {@link CLI.Params.debug} is truthy.
         *
         * @param variable  Variable to inspect. See {@link VariableInspector}.
         * @param level     Depth level for this message (above the value of
         *                  {@link CLI.Params.log-base-level}).
         * @param msgArgs   Optional. Argument overrides for the message.
         * @param timeArgs  Optional. Argument overrides for the message's timestamp.
         */
        debug(variable: Parameters<VarInspect['log']>[0], level: Parameters<VarInspect['log']>[1], msgArgs?: Parameters<VarInspect['log']>[2], timeArgs?: Parameters<VarInspect['log']>[3]): void;
        /**
         * Prints a timestamped log message to the console.
         *
         * @param variable  Variable to inspect. See {@link VariableInspector}.
         * @param level     Depth level for this message (above the value of
         *                  {@link CLI.Params.log-base-level}).
         * @param msgArgs   Optional. Argument overrides for the message.
         * @param timeArgs  Optional. Argument overrides for the message's timestamp.
         */
        log(variable: ConstructorParameters<typeof VariableInspector>[0], level: number, msgArgs?: Partial<MessageMaker.BulkMsgArgs>, timeArgs?: Partial<MessageMaker.BulkMsgArgs>): void;
        /**
         * Prints a timestamped log message to the console. Only if
         * {@link CLI.Params.notice} is truthy.
         *
         * @param variable  Variable to inspect. See {@link VariableInspector}.
         * @param level     Depth level for this message (above the value of
         *                  {@link CLI.Params.log-base-level}).
         * @param msgArgs   Optional. Argument overrides for the message.
         * @param timeArgs  Optional. Argument overrides for the message's timestamp.
         */
        notice(variable: Parameters<VarInspect['log']>[0], level: Parameters<VarInspect['log']>[1], msgArgs?: Parameters<VarInspect['log']>[2], timeArgs?: Parameters<VarInspect['log']>[3]): void;
        /**
         * Prints a timestamped log message to the console. Only if
         * {@link CLI.Params.notice} is truthy.
         *
         * @param variable  Variable to inspect. See {@link VariableInspector}.
         * @param level     Depth level for this message (above the value of
         *                  {@link CLI.Params.log-base-level}).
         * @param msgArgs   Optional. Argument overrides for the message.
         * @param timeArgs  Optional. Argument overrides for the message's timestamp.
         */
        progress(variable: Parameters<VarInspect['log']>[0], level: Parameters<VarInspect['log']>[1], msgArgs?: Parameters<VarInspect['log']>[2], timeArgs?: Parameters<VarInspect['log']>[3]): void;
        /**
         * Outputs a default-level message of the variable.
         *
         * @param variable  Variable to inspect. See {@link VariableInspector}.
         * @param args      Optional. Override arguments for converting the variable.
         */
        stringify(variable: ConstructorParameters<typeof VariableInspector>[0], args?: ConstructorParameters<typeof VariableInspector>[1]): string;
        /**
         * Method for printing a log message to the console. Only if
         * {@link CLI.Params.verbose} is truthy.
         *
         * @param variable  Variable to inspect. See {@link VariableInspector}.
         * @param level     Depth level for this message (above the value of
         *                  {@link CLI.Params.log-base-level}).
         * @param msgArgs   Optional. Argument overrides for the message.
         * @param timeArgs  Optional. Argument overrides for the message's timestamp.
         */
        verbose(variable: Parameters<VarInspect['log']>[0], level: Parameters<VarInspect['log']>[1], msgArgs?: Parameters<VarInspect['log']>[2], timeArgs?: Parameters<VarInspect['log']>[3]): void;
    }
}
//# sourceMappingURL=Logger.d.ts.map
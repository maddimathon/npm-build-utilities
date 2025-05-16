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
import type { Objects } from '@maddimathon/utility-typescript/types';
import { node, VariableInspector } from '@maddimathon/utility-typescript/classes';
import type { CLI, Config, Stage } from '../../../types/index.js';
import { ProjectConfig } from '../../01-config/index.js';
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
export declare class Stage_Console implements Stage.Console {
    readonly name: string;
    readonly clr: Config['clr'];
    readonly config: ProjectConfig;
    readonly params: CLI.Params;
    /** {@inheritDoc Stage.Console.nc} */
    readonly nc: node.NodeConsole;
    /**
     * Instance to use within the class.
     */
    readonly varDump: _Stage_Console_VarInspect;
    /**
     * @param name    Name for this stage used for notices.
     * @param clr     {@inheritDoc Stage.Class.clr}
     * @param config  Current project config.
     * @param params  Current CLI params.
     * @param utils   Optional. Partial argument overrides for classes used
     *                within this one.
     */
    constructor(name: string, clr: Config['clr'], config: ProjectConfig, params: CLI.Params, utils?: {
        nc?: Objects.RecursivePartial<node.NodeConsole.Args>;
    });
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
    protected msgArgs(level?: number, msgArgs?: Parameters<node.NodeConsole['timestampLog']>[1], timeArgs?: Parameters<node.NodeConsole['timestampLog']>[2]): {
        msg: Parameters<node.NodeConsole['timestampLog']>[1];
        time: Parameters<node.NodeConsole['timestampLog']>[2];
    };
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
    protected log(msg: Parameters<node.NodeConsole['timestampLog']>[0], level: number, msgArgs?: Parameters<node.NodeConsole['timestampLog']>[1], timeArgs?: Parameters<node.NodeConsole['timestampLog']>[2]): void;
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
    notice(msg: Parameters<node.NodeConsole['timestampLog']>[0], level: Parameters<Stage_Console['log']>[1], msgArgs?: Parameters<Stage_Console['log']>[2], timeArgs?: Parameters<Stage_Console['log']>[3]): void;
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
    progress(msg: Parameters<node.NodeConsole['timestampLog']>[0], level: Parameters<Stage_Console['log']>[1], msgArgs?: Parameters<Stage_Console['log']>[2], timeArgs?: Parameters<Stage_Console['log']>[3]): void;
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
    verbose(msg: Parameters<Stage_Console['progress']>[0], level: Parameters<Stage_Console['log']>[1], msgArgs?: Parameters<Stage_Console['log']>[2], timeArgs?: Parameters<Stage_Console['log']>[3]): void;
}
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
export declare class _Stage_Console_VarInspect implements Stage.Console.VarInspect {
    readonly name: string;
    readonly config: ProjectConfig;
    readonly params: CLI.Params;
    readonly msgArgs: Stage_Console['msgArgs'];
    /**
     * Instance to use within the class.
     */
    protected readonly nc: node.NodeConsole;
    /**
     * Default values for the args property.
     *
     * @category Args
     */
    get ARGS_DEFAULT(): Stage.Console.Args;
    /**
     * @param name    Name for this stage used for notices.
     * @param config  Current project config.
     * @param params  Current CLI params.
     * @param msgArgs
     * @param utils   Optional. Partial argument overrides for classes used
     *                within this one.
     */
    constructor(name: string, config: ProjectConfig, params: CLI.Params, msgArgs: Stage_Console['msgArgs'], utils: {
        nc: node.NodeConsole;
    });
    /**
     * Gets a simple, unformatted inspection string.
     */
    varString(variable: ConstructorParameters<typeof VariableInspector>[0], args?: ConstructorParameters<typeof VariableInspector>[1]): string;
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
    protected log(variable: ConstructorParameters<typeof VariableInspector>[0], level: Parameters<Stage_Console['notice']>[1], msgArgs?: Parameters<Stage_Console['notice']>[2], timeArgs?: Parameters<Stage_Console['notice']>[3]): void;
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
    notice(variable: ConstructorParameters<typeof VariableInspector>[0], level: Parameters<_Stage_Console_VarInspect['log']>[1], msgArgs?: Parameters<_Stage_Console_VarInspect['log']>[2], timeArgs?: Parameters<_Stage_Console_VarInspect['log']>[3]): void;
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
    progress(variable: ConstructorParameters<typeof VariableInspector>[0], level: Parameters<_Stage_Console_VarInspect['log']>[1], msgArgs?: Parameters<_Stage_Console_VarInspect['log']>[2], timeArgs?: Parameters<_Stage_Console_VarInspect['log']>[3]): void;
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
    verbose(variable: ConstructorParameters<typeof VariableInspector>[0], level: Parameters<_Stage_Console_VarInspect['log']>[1], msgArgs?: Parameters<_Stage_Console_VarInspect['log']>[2], timeArgs?: Parameters<_Stage_Console_VarInspect['log']>[3]): void;
}
//# sourceMappingURL=Stage_Console.d.ts.map
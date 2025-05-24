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
import { MessageMaker, node, VariableInspector } from '@maddimathon/utility-typescript/classes';
import type { CLI, Logger } from '../../../types/index.js';
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
export declare class Stage_Console implements Logger {
    readonly clr: MessageMaker.Colour;
    readonly config: ProjectConfig;
    readonly params: CLI.Params;
    /** {@inheritDoc Logger.nc} */
    readonly nc: node.NodeConsole;
    /** {@inheritDoc Logger.vi} */
    readonly vi: _Stage_Console_VarInspect;
    /**
     * @param clr     Colour slug for this colour-coding this class.
     * @param config  Current project config.
     * @param params  Current CLI params.
     */
    constructor(clr: MessageMaker.Colour, config: ProjectConfig, params: CLI.Params);
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
    protected msgArgs(level?: number, msgArgs?: Partial<MessageMaker.MsgArgs>, timeArgs?: Partial<MessageMaker.MsgArgs>): {
        msg: Partial<MessageMaker.MsgArgs>;
        time: Partial<MessageMaker.MsgArgs>;
    };
    /** {@inheritDoc Logger.debug} */
    debug(msg: Parameters<node.NodeConsole['timestampLog']>[0], level: Parameters<Stage_Console['log']>[1], msgArgs?: Parameters<Stage_Console['log']>[2], timeArgs?: Parameters<Stage_Console['log']>[3]): void;
    /** {@inheritDoc Logger.error} */
    error(msg: MessageMaker.BulkMsgs, level: number, msgArgs?: Partial<MessageMaker.MsgArgs>, timeArgs?: Partial<MessageMaker.MsgArgs>): void;
    /** {@inheritDoc Logger.log} */
    log(msg: Parameters<node.NodeConsole['timestampLog']>[0], level: number, msgArgs?: Partial<MessageMaker.MsgArgs>, timeArgs?: Partial<MessageMaker.MsgArgs>): void;
    /** {@inheritDoc Logger.notice} */
    notice(msg: Parameters<node.NodeConsole['timestampLog']>[0], level: Parameters<Stage_Console['log']>[1], msgArgs?: Parameters<Stage_Console['log']>[2], timeArgs?: Parameters<Stage_Console['log']>[3]): void;
    /** {@inheritDoc Logger.progress} */
    progress(msg: Parameters<node.NodeConsole['timestampLog']>[0], level: Parameters<Stage_Console['log']>[1], msgArgs?: Parameters<Stage_Console['log']>[2], timeArgs?: Parameters<Stage_Console['log']>[3]): void;
    /**
     * {@inheritDoc Logger.debug}
     *
     * @todo
     * **Doesn't currently actually warn.**
     */
    warn(msg: Parameters<node.NodeConsole['timestampLog']>[0], level: Parameters<Stage_Console['log']>[1], msgArgs?: Parameters<Stage_Console['log']>[2], timeArgs?: Parameters<Stage_Console['log']>[3]): void;
    /** {@inheritDoc Logger.verbose} */
    verbose(msg: Parameters<Stage_Console['progress']>[0], level: Parameters<Stage_Console['log']>[1], msgArgs?: Parameters<Stage_Console['log']>[2], timeArgs?: Parameters<Stage_Console['log']>[3]): void;
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
export declare class _Stage_Console_VarInspect implements Logger.VarInspect {
    readonly config: ProjectConfig;
    readonly params: CLI.Params;
    readonly msgArgs: Stage_Console['msgArgs'];
    protected readonly nc: node.NodeConsole;
    /**
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param msgArgs  Function to construct a {@link MessageMaker.MsgArgs} object.
     * @param nc       Instance to use within the class.
     */
    constructor(config: ProjectConfig, params: CLI.Params, msgArgs: Stage_Console['msgArgs'], nc: node.NodeConsole);
    /** {@inheritDoc Logger.VarInspect.log} */
    log(variable: ConstructorParameters<typeof VariableInspector>[0], level: Parameters<Stage_Console['notice']>[1], msgArgs?: Parameters<Stage_Console['notice']>[2], timeArgs?: Parameters<Stage_Console['notice']>[3]): void;
    /** {@inheritDoc Logger.VarInspect.notice} */
    notice(variable: ConstructorParameters<typeof VariableInspector>[0], level: Parameters<_Stage_Console_VarInspect['log']>[1], msgArgs?: Parameters<_Stage_Console_VarInspect['log']>[2], timeArgs?: Parameters<_Stage_Console_VarInspect['log']>[3]): void;
    /** {@inheritDoc Logger.VarInspect.progress} */
    progress(variable: ConstructorParameters<typeof VariableInspector>[0], level: Parameters<_Stage_Console_VarInspect['log']>[1], msgArgs?: Parameters<_Stage_Console_VarInspect['log']>[2], timeArgs?: Parameters<_Stage_Console_VarInspect['log']>[3]): void;
    /** {@inheritDoc Logger.VarInspect.stringify} */
    stringify(variable: ConstructorParameters<typeof VariableInspector>[0], args?: ConstructorParameters<typeof VariableInspector>[1]): string;
    /** {@inheritDoc Logger.VarInspect.verbose} */
    verbose(variable: ConstructorParameters<typeof VariableInspector>[0], level: Parameters<_Stage_Console_VarInspect['log']>[1], msgArgs?: Parameters<_Stage_Console_VarInspect['log']>[2], timeArgs?: Parameters<_Stage_Console_VarInspect['log']>[3]): void;
}
//# sourceMappingURL=Stage_Console.d.ts.map
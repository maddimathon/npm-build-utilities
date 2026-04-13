/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.draft
 * @license MIT
 */
import { MessageMaker, VariableInspector } from '@maddimathon/utility-typescript';
import { NodeConsole, NodeConsole_Prompt } from '@maddimathon/utility-typescript/node';
import type { CLI, Config } from '../../../types/index.js';
import type { Logger } from '../../../types/Logger.js';
import type { RecursivePartial } from '@maddimathon/utility-typescript/types';
/**
 * To be used by {@link AbstractStage} and those that inherit from it.
 *
 * Includes a variety of utilities for printing messages to the console.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export declare class Stage_Console implements Logger {
    readonly clr: MessageMaker.Colour;
    readonly config: Config.Class;
    readonly params: CLI.Params;
    /** {@inheritDoc Logger.nc} */
    readonly nc: NodeConsole;
    /** {@inheritDoc Logger.vi} */
    readonly vi: _Stage_Console_VarInspect;
    /**
     * @param clr     Colour slug for this colour-coding this class.
     * @param config  Current project config.
     * @param params  Current CLI params.
     */
    constructor(clr: MessageMaker.Colour, config: Config.Class, params: CLI.Params);
    /**
     * Creates an argument object used to print messages to the terminal, adding
     * styling defaults by depth level.
     *
     * @see {@link Stage_Console.clr}  Default colour for the message.
     *
     * @param level  Depth level for this message.
     * @param args   Argument overrides for the message.
     *
     * @return  An object with arguments separated by message (`msg`) and time.
     */
    protected msgArgs(level?: number, args?: RecursivePartial<Logger.MsgArgs>): RecursivePartial<Logger.MsgArgs>;
    /** {@inheritDoc Logger.debug} */
    debug(msg: string | string[] | MessageMaker.BulkMsgs, level: number, args?: RecursivePartial<Logger.MsgArgs>): void;
    /** {@inheritDoc Logger.error} */
    error(msg: string | string[] | MessageMaker.BulkMsgs, level: number, args?: RecursivePartial<Logger.MsgArgs>): void;
    /** {@inheritDoc Logger.log} */
    log(msg: string | string[] | MessageMaker.BulkMsgs, level: number, args?: RecursivePartial<Logger.MsgArgs>): void;
    /** {@inheritDoc Logger.progress} */
    progress(msg: string | string[] | MessageMaker.BulkMsgs, level: number, args?: RecursivePartial<Logger.MsgArgs>): void;
    /**
     * Prints a message to the console signalling the start or end of this build
     * stage.  Uses {@link Stage_Consolelog}.
     *
     * @param msg    Text to display as start/end message.
     * @param which  Whether we are starting or ending.
     * @param args   Message argument overrides.
     */
    startOrEnd(msg: string | string[] | MessageMaker.BulkMsgs, which: "start" | "end" | null, args?: Partial<MessageMaker.BulkMsgArgs>): void;
    /**
     * {@inheritDoc Logger.debug}
     *
     * @UPGRADE
     * **Doesn't currently actually warn.**
     */
    warn(msg: string | string[] | MessageMaker.BulkMsgs, level: number, args?: RecursivePartial<Logger.MsgArgs>): void;
    /** {@inheritDoc Logger.verbose} */
    verbose(msg: string | string[] | MessageMaker.BulkMsgs, level: number, args?: RecursivePartial<Logger.MsgArgs>): void;
    get prompt(): {
        readonly bool: (message: string, level: number, opts?: Omit<Parameters<typeof this.nc.prompt.bool>[0], "message">) => Promise<boolean | undefined>;
        readonly input: (message: string, level: number, opts?: Omit<Parameters<typeof this.nc.prompt.input>[0], "message">) => Promise<string | undefined>;
        readonly select: {
            <T_Return extends string, T_Config extends Omit<NodeConsole_Prompt.SelectConfig<T_Return>, "choices"> & {
                choices: T_Return[];
            }>(message: string, level: number, opts: Omit<T_Config, "message" | "theme">): Promise<T_Return | undefined>;
            <T_Return extends NodeConsole_Prompt.SelectValue, T_Config extends Omit<NodeConsole_Prompt.SelectConfig<T_Return>, "choices"> & {
                choices: {
                    value: T_Return;
                    name?: string;
                    description?: string;
                    short?: string;
                    disabled?: boolean | string;
                }[];
            }>(message: string, level: number, opts: Omit<T_Config, "message" | "theme">): Promise<T_Return | undefined>;
        };
    };
    protected prompt_prepareOpts<T_Config extends NodeConsole_Prompt.Config>(level: number, opts?: Omit<T_Config, 'message'>): Pick<T_Config, 'msgArgs' | 'styleClrs'>;
    protected prompt_bool(message: string, level: number, opts?: Omit<Parameters<typeof this.nc.prompt.bool>[0], 'message'>): Promise<boolean | undefined>;
    protected prompt_input(message: string, level: number, opts?: Omit<Parameters<typeof this.nc.prompt.input>[0], 'message'>): Promise<string | undefined>;
    protected prompt_select<T_Return extends string, T_Config extends Omit<NodeConsole_Prompt.SelectConfig<T_Return>, "choices"> & {
        choices: T_Return[];
    }>(message: string, level: number, opts: Omit<T_Config, 'message' | 'theme'>): Promise<T_Return | undefined>;
    protected prompt_select<T_Return extends NodeConsole_Prompt.SelectValue, T_Config extends Omit<NodeConsole_Prompt.SelectConfig<T_Return>, "choices"> & {
        choices: {
            value: T_Return;
            name?: string;
            description?: string;
            short?: string;
            disabled?: boolean | string;
        }[];
    }>(message: string, level: number, opts: Omit<T_Config, 'message' | 'theme'>): Promise<T_Return | undefined>;
}
/**
 * To be used by {@link Stage_Console}.
 *
 * Includes a variety of utilities for printing variable inspections to the console.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 *
 * @internal
 * @private
 */
export declare class _Stage_Console_VarInspect implements Logger.VarInspect {
    /**
     * Functions to use for outputting messages.
     *
     * @since 0.3.0-beta.draft
     */
    protected readonly console: {
        [K in "debug" | "error" | "log" | "progress" | "warn" | "verbose"]: (msg: string | string[] | MessageMaker.BulkMsgs, level: number, args?: RecursivePartial<Logger.MsgArgs>) => void;
    };
    /**
     * @since 0.3.0-beta.draft — Removed `_msgArgs`, `config`, `nc`, `params` params.
     */
    constructor(
    /**
     * Functions to use for outputting messages.
     *
     * @since 0.3.0-beta.draft
     */
    console: {
        [K in "debug" | "error" | "log" | "progress" | "warn" | "verbose"]: (msg: string | string[] | MessageMaker.BulkMsgs, level: number, args?: RecursivePartial<Logger.MsgArgs>) => void;
    });
    /** {@inheritDoc Stage_Console.msgArgs} */
    private msgArgs;
    /** {@inheritDoc Logger.VarInspect.debug} */
    debug(variable: ConstructorParameters<typeof VariableInspector>[0], level: number, { msg, ...args }?: RecursivePartial<Logger.VarInspect.Args>): void;
    /**
     * @since 0.3.0-beta.draft
     */
    error(variable: ConstructorParameters<typeof VariableInspector>[0], level: number, { msg, ...args }?: RecursivePartial<Logger.VarInspect.Args>): void;
    /** {@inheritDoc Logger.VarInspect.log} */
    log(variable: ConstructorParameters<typeof VariableInspector>[0], level: number, { msg, ...args }?: RecursivePartial<Logger.VarInspect.Args>): void;
    /** {@inheritDoc Logger.VarInspect.progress} */
    progress(variable: ConstructorParameters<typeof VariableInspector>[0], level: number, { msg, ...args }?: RecursivePartial<Logger.VarInspect.Args>): void;
    /** {@inheritDoc Logger.VarInspect.stringify} */
    stringify(variable: ConstructorParameters<typeof VariableInspector>[0], args?: RecursivePartial<Logger.VarInspect.Args>): string;
    /**
     * @since 0.3.0-beta.draft
     */
    warn(variable: ConstructorParameters<typeof VariableInspector>[0], level: number, { msg, ...args }?: RecursivePartial<Logger.VarInspect.Args>): void;
    /** {@inheritDoc Logger.VarInspect.verbose} */
    verbose(variable: ConstructorParameters<typeof VariableInspector>[0], level: number, { msg, ...args }?: RecursivePartial<Logger.VarInspect.Args>): void;
}

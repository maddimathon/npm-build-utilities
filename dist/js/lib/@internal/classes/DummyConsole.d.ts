/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.draft
 * @license MIT
 */
import { MessageMaker } from '@maddimathon/utility-typescript';
import { NodeConsole, NodeConsole_Prompt } from '@maddimathon/utility-typescript/node';
import type { CLI, Config } from '../../../types/index.js';
import type { Logger } from '../../../types/Logger.js';
import type { RecursivePartial } from '@maddimathon/utility-typescript/types';
/**
 * A basic console class used as a back-up before {@link Stage_Console} is
 * defined.
 *
 * @internal
 */
export declare class DummyConsole implements Logger {
    readonly nc: NodeConsole;
    readonly config: Partial<Config | Config.Internal>;
    readonly params: Partial<CLI.Params>;
    readonly vi: Logger.VarInspect;
    constructor(nc?: NodeConsole, config?: Partial<Config | Config.Internal>, params?: Partial<CLI.Params>);
    debug(msg: string | string[] | MessageMaker.BulkMsgs, level: number, args?: RecursivePartial<Logger.MsgArgs>): void;
    error(msg: string | string[] | MessageMaker.BulkMsgs, level: number, args?: RecursivePartial<Logger.MsgArgs>): void;
    log(msg: string | string[] | MessageMaker.BulkMsgs, level: number, args?: RecursivePartial<Logger.MsgArgs>): void;
    progress(msg: string | string[] | MessageMaker.BulkMsgs, level: number, args?: RecursivePartial<Logger.MsgArgs>): void;
    warn(msg: string | string[] | MessageMaker.BulkMsgs, level: number, args?: RecursivePartial<Logger.MsgArgs>): void;
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

/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.13
 * @license MIT
 */
import { node, MessageMaker } from '@maddimathon/utility-typescript/classes';
import type { CLI, Config } from '../../../types/index.js';
import type { Logger } from '../../../types/Logger.js';
/**
 * A basic console class used as a back-up before {@link Stage_Console} is
 * defined.
 *
 * @internal
 */
export declare class DummyConsole implements Logger {
    readonly nc: node.NodeConsole;
    readonly config: Partial<Config | Config.Internal>;
    readonly params: Partial<CLI.Params>;
    readonly vi: Logger.VarInspect;
    constructor(nc?: node.NodeConsole, config?: Partial<Config | Config.Internal>, params?: Partial<CLI.Params>);
    debug(msg: Parameters<DummyConsole['log']>[0], level: Parameters<DummyConsole['log']>[1], msgArgs?: Parameters<DummyConsole['log']>[2], timeArgs?: Parameters<DummyConsole['log']>[3]): void;
    error(msg: string | string[] | MessageMaker.BulkMsgs, level: number, msgArgs?: Partial<MessageMaker.BulkMsgArgs>, timeArgs?: Partial<MessageMaker.BulkMsgArgs>): void;
    log(msg: string | string[] | MessageMaker.BulkMsgs, level: number, msgArgs?: Partial<MessageMaker.BulkMsgArgs>, timeArgs?: Partial<MessageMaker.BulkMsgArgs>): void;
    progress(msg: Parameters<DummyConsole['log']>[0], level: Parameters<DummyConsole['log']>[1], msgArgs?: Parameters<DummyConsole['log']>[2], timeArgs?: Parameters<DummyConsole['log']>[3]): void;
    /**
     * Doesn't currently actually warn.
     *
     * @UPGRADE - make it warn
     */
    warn(msg: Parameters<DummyConsole['log']>[0], level: Parameters<DummyConsole['log']>[1], msgArgs?: Parameters<DummyConsole['log']>[2], timeArgs?: Parameters<DummyConsole['log']>[3]): void;
    verbose(msg: Parameters<DummyConsole['log']>[0], level: Parameters<DummyConsole['log']>[1], msgArgs?: Parameters<DummyConsole['log']>[2], timeArgs?: Parameters<DummyConsole['log']>[3]): void;
    get prompt(): {
        readonly bool: (message: string, level: number, opts?: Omit<Parameters<typeof this.nc.prompt.bool>[0], "message">) => Promise<boolean | undefined>;
        readonly input: (message: string, level: number, opts?: Omit<Parameters<typeof this.nc.prompt.input>[0], "message">) => Promise<string | undefined>;
        readonly select: {
            <T_Return extends string, T_Config extends Omit<node.NodeConsole_Prompt.SelectConfig<T_Return>, "choices"> & {
                choices: T_Return[];
            }>(message: string, level: number, opts: Omit<T_Config, "message" | "theme">): Promise<T_Return | undefined>;
            <T_Return extends node.NodeConsole_Prompt.SelectValue, T_Config extends Omit<node.NodeConsole_Prompt.SelectConfig<T_Return>, "choices"> & {
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
    protected prompt_prepareOpts<T_Config extends node.NodeConsole_Prompt.Config>(level: number, opts?: Omit<T_Config, 'message'>): Pick<T_Config, 'msgArgs' | 'styleClrs'>;
    protected prompt_bool(message: string, level: number, opts?: Omit<Parameters<typeof this.nc.prompt.bool>[0], 'message'>): Promise<boolean | undefined>;
    protected prompt_input(message: string, level: number, opts?: Omit<Parameters<typeof this.nc.prompt.input>[0], 'message'>): Promise<string | undefined>;
    protected prompt_select<T_Return extends string, T_Config extends Omit<node.NodeConsole_Prompt.SelectConfig<T_Return>, "choices"> & {
        choices: T_Return[];
    }>(message: string, level: number, opts: Omit<T_Config, 'message' | 'theme'>): Promise<T_Return | undefined>;
    protected prompt_select<T_Return extends node.NodeConsole_Prompt.SelectValue, T_Config extends Omit<node.NodeConsole_Prompt.SelectConfig<T_Return>, "choices"> & {
        choices: {
            value: T_Return;
            name?: string;
            description?: string;
            short?: string;
            disabled?: boolean | string;
        }[];
    }>(message: string, level: number, opts: Omit<T_Config, 'message' | 'theme'>): Promise<T_Return | undefined>;
}
//# sourceMappingURL=DummyConsole.d.ts.map
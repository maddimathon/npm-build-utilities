/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.1
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
     * @TODO - make it warn
     */
    warn(msg: Parameters<DummyConsole['log']>[0], level: Parameters<DummyConsole['log']>[1], msgArgs?: Parameters<DummyConsole['log']>[2], timeArgs?: Parameters<DummyConsole['log']>[3]): void;
    verbose(msg: Parameters<DummyConsole['log']>[0], level: Parameters<DummyConsole['log']>[1], msgArgs?: Parameters<DummyConsole['log']>[2], timeArgs?: Parameters<DummyConsole['log']>[3]): void;
}
//# sourceMappingURL=DummyConsole.d.ts.map
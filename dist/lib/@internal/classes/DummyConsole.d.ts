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
import { MessageMaker, node } from '@maddimathon/utility-typescript/classes';
import type { CLI, Logger } from '../../../types/index.js';
/**
 * A basic console class used as a back-up before {@link Stage_Console} is
 * defined.
 *
 * @internal
 */
export declare class DummyConsole implements Logger {
    readonly nc: node.NodeConsole;
    protected readonly params: Partial<CLI.Params>;
    readonly vi: Logger.VarInspect;
    constructor(nc?: node.NodeConsole, params?: Partial<CLI.Params>);
    debug(msg: Parameters<DummyConsole['log']>[0], level: Parameters<DummyConsole['log']>[1], msgArgs?: Parameters<DummyConsole['log']>[2], timeArgs?: Parameters<DummyConsole['log']>[3]): void;
    error(msg: string | string[] | MessageMaker.BulkMsgs, level: number, msgArgs?: Parameters<node.NodeConsole['timestampLog']>[1], timeArgs?: Parameters<node.NodeConsole['timestampLog']>[2]): void;
    log(msg: string | string[] | MessageMaker.BulkMsgs, level: number, msgArgs?: Parameters<node.NodeConsole['timestampLog']>[1], timeArgs?: Parameters<node.NodeConsole['timestampLog']>[2]): void;
    notice(msg: Parameters<DummyConsole['log']>[0], level: Parameters<DummyConsole['log']>[1], msgArgs?: Parameters<DummyConsole['log']>[2], timeArgs?: Parameters<DummyConsole['log']>[3]): void;
    progress(msg: Parameters<DummyConsole['log']>[0], level: Parameters<DummyConsole['log']>[1], msgArgs?: Parameters<DummyConsole['log']>[2], timeArgs?: Parameters<DummyConsole['log']>[3]): void;
    /**
     * Doesn't currently actually warn.
     *
     * @todo
     */
    warn(msg: Parameters<DummyConsole['log']>[0], level: Parameters<DummyConsole['log']>[1], msgArgs?: Parameters<DummyConsole['log']>[2], timeArgs?: Parameters<DummyConsole['log']>[3]): void;
    verbose(msg: Parameters<DummyConsole['log']>[0], level: Parameters<DummyConsole['log']>[1], msgArgs?: Parameters<DummyConsole['log']>[2], timeArgs?: Parameters<DummyConsole['log']>[3]): void;
}
//# sourceMappingURL=DummyConsole.d.ts.map
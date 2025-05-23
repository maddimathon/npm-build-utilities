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
import type { Stage } from '../../../types/index.js';
/**
 * A basic console class used as a back-up before {@link Stage_Console} is
 * defined.
 *
 * @internal
 */
export declare class DummyConsole implements Stage.Console {
    readonly nc: node.NodeConsole;
    readonly varDump: Stage.Console.VarInspect;
    constructor(nc?: node.NodeConsole);
    error(msg: string | string[] | MessageMaker.BulkMsgs, level: number, msgArgs?: Parameters<node.NodeConsole['timestampLog']>[1], timeArgs?: Parameters<node.NodeConsole['timestampLog']>[2]): void;
    log(msg: string, level: number, msgArgs?: Parameters<node.NodeConsole['timestampLog']>[1], timeArgs?: Parameters<node.NodeConsole['timestampLog']>[2]): void;
    notice(msg: Parameters<DummyConsole['log']>[0], level: Parameters<DummyConsole['log']>[1], msgArgs?: Parameters<DummyConsole['log']>[2], timeArgs?: Parameters<DummyConsole['log']>[3]): void;
    progress(msg: Parameters<DummyConsole['log']>[0], level: Parameters<DummyConsole['log']>[1], msgArgs?: Parameters<DummyConsole['log']>[2], timeArgs?: Parameters<DummyConsole['log']>[3]): void;
    verbose(msg: Parameters<DummyConsole['log']>[0], level: Parameters<DummyConsole['log']>[1], msgArgs?: Parameters<DummyConsole['log']>[2], timeArgs?: Parameters<DummyConsole['log']>[3]): void;
}
//# sourceMappingURL=DummyConsole.d.ts.map
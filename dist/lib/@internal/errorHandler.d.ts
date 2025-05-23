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
import { MessageMaker } from '@maddimathon/utility-typescript/classes';
import type { LocalError, Stage } from '../../types/index.js';
/**
 * Returns a string representation of the error for logging.
 *
 * @internal
 * @private
 */
export declare function _errorStringify(error: LocalError.Input, args: Partial<LocalError.Handler.Args>, console: Stage.Console, level: number): MessageMaker.BulkMsgs;
/**
 * @internal
 * @private
 */
export declare function errorHandler(error: LocalError.Input, level: number, console: Stage.Console, args?: Partial<LocalError.Handler.Args>): void;
//# sourceMappingURL=errorHandler.d.ts.map
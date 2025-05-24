/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-draft
 * @license MIT
 */
import { MessageMaker } from '@maddimathon/utility-typescript/classes';
import type { LocalError, Logger } from '../../types/index.js';
/**
 * Returns a string representation of the error for logging.
 *
 * @category Errors
 *
 * @internal
 * @private
 */
export declare function _errorStringify(error: LocalError.Input, args: Partial<LocalError.Handler.Args>, console: Logger, level: number): MessageMaker.BulkMsgs;
/**
 * Default error handler for use within the library.
 *
 * @category Errors
 *
 * @internal
 */
export declare function errorHandler(error: LocalError.Input, level: number, console: Logger, args?: Partial<LocalError.Handler.Args>): void;
//# sourceMappingURL=errorHandler.d.ts.map
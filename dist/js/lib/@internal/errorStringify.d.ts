/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-alpha.draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import { MessageMaker } from '@maddimathon/utility-typescript/classes';
import type { FileSystemType } from '../../types/FileSystemType.js';
import type { LocalError } from '../../types/LocalError.js';
import type { Logger } from '../../types/Logger.js';
/**
 * Returns a string(s) representation of the error for logging.
 *
 * @category Errors
 *
 * @internal
 */
export declare function errorStringify(error: LocalError.Input, args: Partial<LocalError.Handler.Args>, console: Logger, fs: FileSystemType, level: number): MessageMaker.BulkMsgs;
//# sourceMappingURL=errorStringify.d.ts.map
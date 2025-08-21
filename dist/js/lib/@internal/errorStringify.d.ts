/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.2.0-alpha.3
 * @license MIT
 */
import { MessageMaker } from '@maddimathon/utility-typescript/classes';
import type { FileSystemType } from '../../types/FileSystemType.js';
import type { Logger } from '../../types/Logger.js';
import { AbstractError } from './classes/index.js';
/**
 * Returns a string(s) representation of an error for logging.
 *
 * @category Errors
 *
 * @param error    Error to convery.
 * @param level    Depth level for output to the console.
 * @param console  Instance used to log messages and debugging info.
 * @param fs       Instance used to work with paths and files.
 * @param args     Overrides for default options.
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export declare function errorStringify(error: AbstractError.Input, level: number, console: Logger, fs: FileSystemType, args: Partial<AbstractError.Handler.Args>): MessageMaker.BulkMsgs;
//# sourceMappingURL=errorStringify.d.ts.map
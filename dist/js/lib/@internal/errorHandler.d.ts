/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.8
 * @license MIT
 */
import type { FileSystemType } from '../../types/FileSystemType.js';
import type { Logger } from '../../types/Logger.js';
import { type AbstractError } from './classes/index.js';
/**
 * Default error handler for use within the library.
 *
 * @category Errors
 *
 * @see {@link errorStringify}  Used to turn the error into an output message.
 *
 * @param error    Error to handle.
 * @param level    Depth level for output to the console.
 * @param console  Instance used to log messages and debugging info.
 * @param fs       Instance used to work with paths and files.
 * @param args     Overrides for default options.
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export declare function errorHandler(error: AbstractError.Input, level: number, console: Logger, fs: FileSystemType, args?: Partial<AbstractError.Handler.Args>): void;
//# sourceMappingURL=errorHandler.d.ts.map
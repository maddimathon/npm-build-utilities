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
import type { FileSystemType } from '../../types/FileSystemType.js';
import type { LocalError } from '../../types/LocalError.js';
import type { Logger } from '../../types/Logger.js';
/**
 * Default error handler for use within the library.
 *
 * @category Errors
 *
 * @param error
 * @param level
 * @param console
 * @param fs
 * @param args         Optional.
 * @param exitProcess  Optional. Whether to exit the process after handling. Default true.
 *
 * @internal
 */
export declare function errorHandler(error: LocalError.Input, level: number, console: Logger, fs: FileSystemType, args?: Partial<LocalError.Handler.Args>, exitProcess?: boolean): void;
//# sourceMappingURL=errorHandler.d.ts.map
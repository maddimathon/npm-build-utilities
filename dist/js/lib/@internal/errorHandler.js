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
import { errorStringify } from './errorStringify.js';
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
export function errorHandler(
    error,
    level,
    console,
    fs,
    args,
    exitProcess = true,
) {
    args = {
        bold: true,
        clr: 'red',
        italic: false,
        linesIn: 2,
        linesOut: 2,
        ...(args ?? {}),
    };
    const bulkMsgs = errorStringify(error, args, console, fs, 0);
    // returns
    if (!exitProcess) {
        console.warn(bulkMsgs, level, args);
        return;
    }
    console.error(bulkMsgs, level, args);
    process.exit(process.exitCode ?? 0);
}
//# sourceMappingURL=errorHandler.js.map

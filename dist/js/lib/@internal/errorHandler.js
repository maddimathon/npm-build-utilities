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
 * @internal
 */
export function errorHandler(error, level, console, fs, args) {
    args = {
        bold: true,
        clr: 'red',
        italic: false,
        linesIn: 2,
        linesOut: 2,
        ...args ?? {},
    };
    const bulkMsgs = errorStringify(error, args, console, fs, 0);
    console.error(bulkMsgs, level, args);
    process.exit(process.exitCode ?? 0);
}
;
//# sourceMappingURL=errorHandler.js.map
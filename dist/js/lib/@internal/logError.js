/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.11
 * @license MIT
 */
import { slugify } from '@maddimathon/utility-typescript/functions';
import { MessageMaker } from '@maddimathon/utility-typescript/classes';
import {} from './classes/index.js';
import { errorStringify } from './errorStringify.js';
import { writeLog } from './writeLog.js';
/**
 * Writes the content of an error to a log file and outputs (to the console) a
 * confirmation message with the path to the log file.
 *
 * @category Errors
 *
 * @param logMsg  Message to prepend to the return for output to the console.
 * @param error   Caught error to stringify (via {@link errorStringify}) and add
 *                to the log.
 * @param level   Depth level for output to the console.
 * @param args    Extra configuration for the function. See
 *                {@link logError.Args}.
 *
 * @return  Message that was output to the console, with a link to the log file
 *          if written successfully.
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export function logError(logMsg, error, level, args) {
    const {
        console,
        date = new Date(),
        errMsg,
        fs,
        outputWarning = true,
    } = args;
    let msgs = [
        [(errMsg ?? logMsg) + '\n'],
        ...errorStringify(error, level, console, fs, {}),
    ];
    const filename = (typeof error === 'object' && error?.name) || 'error';
    const result = writeLog(msgs, slugify(filename), {
        config: console.config,
        date,
        fs,
        subDir: ['errors'],
    });
    let _returnMsg;
    if (result) {
        _returnMsg = [
            [logMsg],
            [
                'log written to: '
                    + fs.pathRelative(result).replace(' ', '%20'),
                { italic: true, maxWidth: null },
            ],
        ];
    } else {
        _returnMsg = [
            [logMsg],
            [''],
            ['failure when writing to logs', { bold: true, italic: true }],
        ];
        if (errMsg) {
            _returnMsg.push(['']);
            _returnMsg.push([errMsg, { maxWidth: null }]);
        }
    }
    outputWarning && console.warn(_returnMsg, level, { joiner: '\n' });
    return _returnMsg;
}
/**
 * Utilities used only for {@link logError} function.
 *
 * @category Errors
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
(function (logError) {})(logError || (logError = {}));
//# sourceMappingURL=logError.js.map

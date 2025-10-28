/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.3
 * @license MIT
 */
import { MessageMaker } from '@maddimathon/utility-typescript/classes';
import type { FileSystemType } from '../../types/FileSystemType.js';
import type { Logger } from '../../types/Logger.js';
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
export declare function logError(logMsg: string, error: unknown, level: number, args: logError.Args): MessageMaker.BulkMsgs;
/**
 * Utilities used only for {@link logError} function.
 *
 * @category Errors
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export declare namespace logError {
    /**
     * Input configuration for {@link logError} function.
     *
     * @since 0.1.0-alpha
     */
    interface Args {
        /**
         * Instance to use for outputting messages, if any. Only used as
         * {@link errorStringify} param and to fetch config.
         */
        console: Logger;
        /**
         * Instance to use for dealing with paths and files. Used for
         * {@link errorStringify}, for {@link writeLog}, and to include the
         * relative path in the output message.
         */
        fs: FileSystemType;
        /**
         * The date object to use for the error log. Otherwise constructs a new
         * date object.
         */
        date?: Date;
        /**
         * Message to prepend to the error output in the error log. Best to
         * include information on why/where this error was caught. If null,
         * `logMsg` param is used instead.
         */
        errMsg?: string;
        /**
         * Whether to supress output to console (via `console.warn`) before
         * return.
         *
         * @default true
         */
        outputWarning?: boolean;
    }
}
//# sourceMappingURL=logError.d.ts.map
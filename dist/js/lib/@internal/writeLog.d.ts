/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.15
 * @license MIT
 */
import { MessageMaker } from '@maddimathon/utility-typescript/classes';
import type { Config } from '../../types/index.js';
import type { FileSystemType } from '../../types/FileSystemType.js';
/**
 * Writes a log file to the {@link Config.Paths.scripts}.logs directory.
 *
 * @category Errors
 *
 * @param msg       Log message to write.
 * @param filename  File name for the log.
 * @param t_args    Overrides for default options.
 *
 * @return  If false, writing the log failed. Otherwise, this is the path to the
 *          written log file.
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export declare function writeLog(msg: string | string[] | MessageMaker.BulkMsgs, filename: string, t_args: writeLog.Args): false | string;
/**
 * Utilities used only for {@link writeLog} function.
 *
 * @category Errors
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export declare namespace writeLog {
    /**
     * Optional overrides for default options.
     *
     * @since 0.1.0-alpha
     */
    interface Args {
        /**
         * Current project config.
         */
        config: Partial<Config | Config.Internal> | Config.Internal;
        /**
         * Used for the timestamp.
         */
        date?: Date;
        /**
         * Instance used to work with paths and files.
         */
        fs: FileSystemType;
        /**
         * Subdirectories used for the path to write the log file.
         */
        subDir?: string[];
    }
}
//# sourceMappingURL=writeLog.d.ts.map
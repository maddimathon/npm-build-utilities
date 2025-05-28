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
import type { Config } from '../../types/index.js';
import type { FileSystemType } from '../../types/FileSystemType.js';
/**
 * Gets a relative or absolute path to the {@link Config.Paths.scripts}
 * directories.
 */
export declare function writeLog(msg: string | string[] | MessageMaker.BulkMsgs, filename: string, t_args: writeLog.Args): false | string;
export declare namespace writeLog {
    const ARGS_DEFAULT: {};
    interface Args {
        config: Partial<Config> | Config.Internal;
        date?: Date;
        fs: FileSystemType;
        subDir?: string[];
    }
}
//# sourceMappingURL=writeLog.d.ts.map
/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.15
 * @license MIT
 */
import {
    mergeArgs,
    slugify,
    timestamp,
} from '@maddimathon/utility-typescript/functions';
import { MessageMaker } from '@maddimathon/utility-typescript/classes';
let _writeLog_msgMaker = new MessageMaker({ painter: null });
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
export function writeLog(msg, filename, t_args) {
    const {
        config,
        date = new Date(),
        subDir = [],
        fs,
    } = mergeArgs({}, t_args, false);
    const bulkMsgs = (Array.isArray(msg) ? msg : [msg]).map((_m) =>
        typeof _m === 'string' ? [_m] : _m,
    );
    const datetime = `[${timestamp(date, { date: true, time: true })}]  `;
    filename =
        datetime
            .replace(/[\-:]/g, '')
            .replace(/[^\d]+/g, '-')
            .replace(/^\-/g, '')
        + slugify(filename.replace(/\.[a-z]+[a-z0-9\-]*$/gi, ''))
        + '.txt';
    const logDirPath =
        typeof config.paths?.scripts === 'string' ?
            (config.paths?.scripts.replace(/\/$/gi, '') ?? '.scripts') + '/logs'
        :   (config.paths?.scripts?.logs ?? '.scripts/logs');
    const filepath = fs.pathResolve(logDirPath, ...subDir, filename);
    return fs.write(
        filepath,
        _writeLog_msgMaker.msgs(
            [[datetime], [_writeLog_msgMaker.msgs(bulkMsgs)]],
            {
                hangingIndent: ' '.repeat(datetime.length),
                joiner: '',
                maxWidth: null,
            },
        ),
        { force: false, rename: true },
    );
}
//# sourceMappingURL=writeLog.js.map

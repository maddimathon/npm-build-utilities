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
import { mergeArgs, slugify, timestamp, } from '@maddimathon/utility-typescript/functions';
import { MessageMaker, } from '@maddimathon/utility-typescript/classes';
let _writeLog_msgMaker = new MessageMaker({ painter: null });
/**
 * Gets a relative or absolute path to the {@link Config.Paths.scripts}
 * directories.
 */
export function writeLog(msg, filename, t_args) {
    const { config, date = new Date(), subDir = [], fs, } = mergeArgs(writeLog.ARGS_DEFAULT, t_args, false);
    const bulkMsgs = (Array.isArray(msg) ? msg : [msg]).map((_m => typeof _m === 'string' ? [_m] : _m));
    const datetime = `[${timestamp(date, { date: true, time: true })}]  `;
    filename =
        datetime.replace(/[\-:]/g, '').replace(/[^\d]+/g, '-').replace(/^\-/g, '')
            + slugify(filename.replace(/\.[a-z]+[a-z0-9\-]*$/gi, ''))
            + '.txt';
    const logDirPath = typeof config.paths?.scripts === 'string'
        ? (config.paths?.scripts.replace(/\/$/gi, '') ?? '.scripts') + '/logs'
        : config.paths?.scripts?.logs ?? '.scripts/logs';
    const filepath = fs.pathResolve(logDirPath, ...subDir, filename);
    return fs.write(filepath, _writeLog_msgMaker.msgs([
        [datetime],
        [_writeLog_msgMaker.msgs(bulkMsgs)],
    ], {
        hangingIndent: ' '.repeat(datetime.length),
        joiner: '',
        maxWidth: null,
    }), { force: false, rename: true });
}
(function (writeLog) {
    writeLog.ARGS_DEFAULT = {};
})(writeLog || (writeLog = {}));
//# sourceMappingURL=writeLog.js.map
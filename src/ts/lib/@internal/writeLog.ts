/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import {
    mergeArgs,
    slugify,
    timestamp,
} from '@maddimathon/utility-typescript/functions';

import {
    MessageMaker,
} from '@maddimathon/utility-typescript/classes';

import type {
    Config,
} from '../../types/index.js';

import type { FileSystemType } from '../../types/FileSystemType.js';

let _writeLog_msgMaker = new MessageMaker( { painter: null } );

/**
 * Gets a relative or absolute path to the {@link Config.Paths.scripts}
 * directories.
 */
export function writeLog(
    msg: string | string[] | MessageMaker.BulkMsgs,
    filename: string,
    t_args: writeLog.Args,
): false | string {

    const {
        config,
        date = new Date(),
        subDir = [],
        fs,
    } = mergeArgs( writeLog.ARGS_DEFAULT, t_args, false );

    const bulkMsgs: MessageMaker.BulkMsgs = (
        Array.isArray( msg ) ? msg : [ msg ]
    ).map( ( _m => typeof _m === 'string' ? [ _m ] : _m ) );

    const datetime = `[${ timestamp( date, { date: true, time: true } ) }]  `;

    filename =
        datetime.replace( /[\-:]/g, '' ).replace( /[^\d]+/g, '-' ).replace( /^\-/g, '' )
        + slugify( filename.replace( /\.[a-z]+[a-z0-9\-]*$/gi, '' ) )
        + '.txt';

    const logDirPath = typeof config.paths?.scripts === 'string'
        ? ( config.paths?.scripts.replace( /\/$/gi, '' ) ?? '.scripts' ) + '/logs'
        : config.paths?.scripts?.logs ?? '.scripts/logs';

    const filepath = fs.pathResolve(
        logDirPath,
        ...subDir,
        filename,
    );

    return fs.write(

        filepath,

        _writeLog_msgMaker.msgs(
            [
                [ datetime ],
                [ _writeLog_msgMaker.msgs( bulkMsgs ) ],
            ],
            {
                hangingIndent: ' '.repeat( datetime.length ),
                joiner: '',
                maxWidth: null,
            },
        ),

        { force: false, rename: true }
    );
}

export namespace writeLog {

    export const ARGS_DEFAULT = {
    } as const satisfies Partial<Args>;

    export interface Args {
        config: Partial<Config> | Config.Internal;
        date?: Date;
        fs: FileSystemType;
        subDir?: string[];
    }
}
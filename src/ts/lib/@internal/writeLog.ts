/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
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
 * @since ___PKG_VERSION___
 * 
 * @internal
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
    } = mergeArgs( {}, t_args, false );

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

/**
 * Utilities used only for {@link writeLog} function.
 * 
 * @category Errors
 * 
 * @since ___PKG_VERSION___
 * 
 * @internal
 */
export namespace writeLog {

    /**
     * Optional overrides for default options.
     * 
     * @since ___PKG_VERSION___
     */
    export interface Args {

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
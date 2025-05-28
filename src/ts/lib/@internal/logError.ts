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
    MessageMaker,
} from '@maddimathon/utility-typescript/classes';

import type { FileSystemType } from '../../types/FileSystemType.js';
import type { LocalError } from '../../types/LocalError.js';
import type { Logger } from '../../types/Logger.js';

import { errorStringify } from './errorStringify.js';
import { writeLog } from './writeLog.js';
import { slugify } from '@maddimathon/utility-typescript/functions/index';

/**
 * Writes the content of an error to a msgs file and outputs (to the console) a
 * confirmation message with the path to the msgs file.
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
 * @since ___PKG_VERSION___
 */
export function logError(
    logMsg: string,
    error: unknown,
    level: number,
    args: logError.Args,
) {

    const {
        console,
        date = new Date(),
        errMsg,
        fs,
        outputWarning = true,
    } = args;

    let msgs: MessageMaker.BulkMsgs = [
        [ ( errMsg ?? logMsg ) + '\n' ],

        ...errorStringify(
            error as LocalError.Input,
            {},
            console,
            fs,
            level,
        ),
    ];

    const filename = typeof error === 'object' && ( error as Partial<Error> )?.name || 'error';

    const result = writeLog(
        msgs,
        slugify( filename ),
        {
            config: console.config,
            date,
            fs,
            subDir: [ 'errors' ],
        },
    );

    let _returnMsg: MessageMaker.BulkMsgs;

    if ( result ) {

        _returnMsg = [
            [ logMsg ],
            [ 'log written to: ' + fs.pathRelative( result ).replace( ' ', '%20' ), { italic: true, maxWidth: null } ],
        ];
    } else {

        _returnMsg = [
            [ logMsg ],
            [ '' ],
            [ 'failure when writing to logs', { bold: true, italic: true } ],
        ];

        if ( errMsg ) {
            _returnMsg.push( [ '' ] );
            _returnMsg.push( [ errMsg, { maxWidth: null } ] );
        }
    }

    outputWarning && console.warn( _returnMsg, level, { joiner: '\n' } );
    return _returnMsg;
}

/**
 * Utility types used only for {@link logError} function.
 * 
 * @since ___PKG_VERSION___
 */
export namespace logError {

    /**
     * Input configuration for {@link logError} function.
     */
    export interface Args {

        /**
         * Instance to use for outputting messages, if any. Only used as
         * {@link errorStringify} param and to fetch config.
         */
        console: Logger,

        /**
         * Instance to use for dealing with paths and files. Used for
         * {@link errorStringify}, for {@link writeLog}, and to include the
         * relative path in the output message.
         */
        fs: FileSystemType,

        /**
         * Optional. The date object to use for the error log.
         * 
         * @default 
         * ```ts
         * new Date()
         * ```
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
    };
}
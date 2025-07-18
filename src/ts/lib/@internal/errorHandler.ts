/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

// import type {
// } from '../../types/index.js';

import type { FileSystemType } from '../../types/FileSystemType.js';
import type { Logger } from '../../types/Logger.js';

import {
    type AbstractError,
} from './classes/index.js';

import { errorStringify } from './errorStringify.js';


/**
 * Default error handler for use within the library.
 * 
 * @category Errors
 * 
 * @see {@link errorStringify}  Used to turn the error into an output message.
 * 
 * @param error    Error to handle.
 * @param level    Depth level for output to the console.
 * @param console  Instance used to log messages and debugging info.
 * @param fs       Instance used to work with paths and files.
 * @param args     Overrides for default options.
 * 
 * @since 0.1.0-alpha
 * 
 * @internal
 */
export function errorHandler(
    error: AbstractError.Input,
    level: number,
    console: Logger,
    fs: FileSystemType,
    args?: Partial<AbstractError.Handler.Args>,
) {
    args = {
        bold: true,
        clr: 'red',
        italic: false,

        linesIn: 2,
        linesOut: 2,

        exitProcess: true,

        ...args ?? {},
    };

    const bulkMsgs = errorStringify( error, 0, console, fs, args );

    // returns
    if ( !args.exitProcess ) {
        console.warn( bulkMsgs, level, args );
        return;
    }

    console.error( bulkMsgs, level, args );
    process.exit( process.exitCode ?? 0 );
};
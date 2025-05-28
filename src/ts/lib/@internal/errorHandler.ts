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

// import type {
// } from '../../types/index.js';

import type { FileSystemType } from '../../types/FileSystemType.js';
import type { LocalError } from '../../types/LocalError.js';
import type { Logger } from '../../types/Logger.js';

import { errorStringify } from './errorStringify.js';


/**
 * Default error handler for use within the library.
 * 
 * @category Errors
 * 
 * @internal
 */
export function errorHandler(
    error: LocalError.Input,
    level: number,
    console: Logger,
    fs: FileSystemType,
    args?: Partial<LocalError.Handler.Args>,
) {
    args = {
        bold: true,
        clr: 'red',
        italic: false,

        linesIn: 2,
        linesOut: 2,

        ...args ?? {},
    };

    const bulkMsgs = errorStringify( error, args, console, fs, 0 );

    console.error( bulkMsgs, level, args );
    process.exit( process.exitCode ?? 0 );
};
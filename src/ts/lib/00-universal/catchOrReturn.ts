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

import type {
    LocalError,
    Logger,
} from '../../types/index.js';

import type { FileSystemType } from '../../types/FileSystemType.js';

import {
    errorHandler,
} from '../@internal/index.js';

/**
 * @param tryer     Function to run inside the try {}.
 * @param level     
 * @param console   Instance used to log debugging information.
 * @param fs        
 * @param params    Parameters passed to the tryer function, if any.
 * @param callback  Used to handle the error.  Note: if the callback does not throw or exit, the caught error is re-thrown.
 */
export function catchOrReturn<
    Params extends never[],
    Return extends unknown,
>(
    tryer: ( ...params: Params ) => Return,
    level: number,
    console: Logger,
    fs: FileSystemType,
    params?: Params,
    callback?: (
        | null
        | LocalError.Handler
        | [ LocalError.Handler, Partial<LocalError.Handler.Args> ]
    ),
): Return;

export function catchOrReturn<
    Params extends unknown[],
    Return extends unknown,
>(
    tryer: ( ...params: Params ) => Return,
    level: number,
    console: Logger,
    fs: FileSystemType,
    params: Params,
    callback?: (
        | null
        | LocalError.Handler
        | [ LocalError.Handler, Partial<LocalError.Handler.Args> ]
    ),
): Return;

/**
 * Runs a function, with parameters as applicable, and catches (& handles)
 * anything thrown.
 * 
 * Overloaded for better function param typing.
 * 
 * @category Errors
 * 
 * @experimental
 */
export function catchOrReturn<
    Params extends unknown[] | never[],
    Return extends unknown,
>(
    tryer: ( ...params: Params ) => Return,
    level: number,
    console: Logger,
    fs: FileSystemType,
    params: Params,
    callback: (
        | null
        | LocalError.Handler
        | [ LocalError.Handler, Partial<LocalError.Handler.Args> ]
    ) = null,
): Return {

    try {

        return tryer( ...( params ?? [] as Params ) );

    } catch ( error ) {

        let callbackArgs: Partial<LocalError.Handler.Args> = {};

        if ( !callback ) {
            callback = errorHandler;
        } else if ( Array.isArray( callback ) ) {
            callbackArgs = callback[ 1 ];
            callback = callback[ 0 ];
        }

        callback(
            error as LocalError.Input,
            level,
            console,
            fs,
            callbackArgs,
        );

        throw error;
    }
}
/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

// import type {
// } from '../../types/index.js';
;
import type { FileSystemType } from '../../types/FileSystemType.js';
import type { Logger } from '../../types/Logger.js';

import {
    type AbstractError,

    errorHandler,
} from '../@internal/index.js';


/**
 * If the `tryer` function has no params, then they are optional.
 * 
 * @typeParam T_Params  Parameter type for the `tryer` function.
 * @typeParam T_Return  Return type for the `tryer` function.
 * 
 * @param tryer     Function to run inside the try {}.
 * @param level     Depth level for output to the console.
 * @param console   Instance used to log messages and debugging info.
 * @param fs        Instance used to work with paths and files.
 * @param params    Parameters passed to the tryer function, if any.
 * @param callback  Used to handle the error. Note: if the callback does not 
 *                  throw or exit, the caught error is re-thrown.
 * 
 * @return  The `tryer` function’s return.
 */
export function catchOrReturn<
    T_Params extends never[],
    T_Return extends unknown,
>(
    tryer: () => T_Return,
    level: number,
    console: Logger,
    fs: FileSystemType,
    params?: NoInfer<T_Params>,
    callback?: (
        | AbstractError.Handler
        | [ AbstractError.Handler, Partial<AbstractError.Handler.Args> ]
    ),
): T_Return;

/**
 * If the `tryer` function *has* params, then they are required.
 */
export function catchOrReturn<
    T_Params extends unknown[],
    T_Return extends unknown,
>(
    tryer: ( ...params: T_Params ) => T_Return,
    level: number,
    console: Logger,
    fs: FileSystemType,
    params: NoInfer<T_Params>,
    callback?: (
        | AbstractError.Handler
        | [ AbstractError.Handler, Partial<AbstractError.Handler.Args> ]
    ),
): T_Return;

/**
 * Runs a function, with parameters as applicable, and catches (& handles)
 * anything thrown.
 * 
 * Overloaded for better param typing.
 * 
 * @category Errors
 * 
 * @throws  Any errors thrown in the `tryer` function.
 * 
 * @since ___PKG_VERSION___
 */
export function catchOrReturn<
    T_Params extends unknown[] | never[],
    T_Return extends unknown,
>(
    tryer: ( ...params: T_Params ) => T_Return,
    level: number,
    console: Logger,
    fs: FileSystemType,
    params?: NoInfer<T_Params>,
    callback?: (
        | AbstractError.Handler
        | [ AbstractError.Handler, Partial<AbstractError.Handler.Args> ]
    ),
): T_Return {

    try {

        return tryer( ...( params ?? [] as T_Params ) );

    } catch ( error ) {

        let callbackArgs: Partial<AbstractError.Handler.Args> = {};

        if ( !callback ) {
            callback = errorHandler;
        } else if ( Array.isArray( callback ) ) {
            callbackArgs = callback[ 1 ];
            callback = callback[ 0 ];
        }

        callback(
            error as AbstractError.Input,
            level,
            console,
            fs,
            callbackArgs,
        );

        throw error;
    }
}
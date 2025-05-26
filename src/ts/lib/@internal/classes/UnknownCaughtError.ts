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

import type { LocalError } from '../../../types/LocalError.js';

import { AbstractError } from './abstract/AbstractError.js';


/**
 * An extension of the utilities error for catching errors, mainly ones that are
 * not (Error) objects already.
 * 
 * @category Errors
 * 
 * @since ___PKG_VERSION___
 */
export class UnknownCaughtError extends AbstractError<UnknownCaughtError.Args> {



    /* LOCAL PROPERTIES
     * ====================================================================== */


    /* Args ===================================== */

    public override readonly name: string = 'Unknown Caught Error';

    public get ARGS_DEFAULT() {

        return {
            ...AbstractError.prototype.ARGS_DEFAULT,
        } as const satisfies UnknownCaughtError.Args;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    public constructor (
        message: string,
        args?: ConstructorParameters<typeof AbstractError>[ 2 ] & {
            context?: ConstructorParameters<typeof AbstractError>[ 1 ];
        },
    ) {
        super(
            message,
            args?.context ?? null,
            args as ConstructorParameters<typeof AbstractError>[ 2 ]
        );
    }



    /* LOCAL METHODS
     * ====================================================================== */
}

/**
 * Used only for {@link UnknownCaughtError}.
 * 
 * @category Class-Helpers
 * 
 * @since ___PKG_VERSION___
 */
export namespace UnknownCaughtError {

    /**
     * Optional configuration for {@link UnknownCaughtError} class.
     * 
     * @since ___PKG_VERSION___
     */
    export interface Args extends LocalError.Args {
        context: AbstractError.Context;
    };
}
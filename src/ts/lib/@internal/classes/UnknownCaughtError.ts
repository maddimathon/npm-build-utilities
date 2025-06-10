/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import { AbstractError } from './abstract/AbstractError.js';


/**
 * An extension of the utilities error for caught errors, mainly ones that are
 * not (Error) objects already.
 * 
 * @category Errors
 * 
 * @since 0.1.0-alpha
 */
export class UnknownCaughtError extends AbstractError {

    public override readonly name: string = 'Unknown Caught Error';

    public constructor (
        message: string,
        cause?: AbstractError.Input,
    ) {
        super( message, null, cause );
    }
}
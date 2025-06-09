/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import { AbstractError } from './abstract/AbstractError.js';


/**
 * An extension of the utilities error for use while running a {@link Project}.
 * 
 * @category Errors
 * 
 * @since ___PKG_VERSION___
 */
export class StageError extends AbstractError {

    public override readonly name: string = 'Project Error';
}
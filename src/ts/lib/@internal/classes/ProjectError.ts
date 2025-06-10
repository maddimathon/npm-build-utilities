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
 * An extension of the utilities error for use while running a {@link Project}.
 * 
 * @category Errors
 * 
 * @since 0.1.0-alpha
 */
export class ProjectError extends AbstractError {

    public override readonly name: string = 'Project Error';
}
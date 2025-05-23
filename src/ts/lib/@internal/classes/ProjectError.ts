/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type { LocalError } from '../../../types/LocalError.js';

import { AbstractError } from './abstract/AbstractError.js';


/**
 * An extension of the utilities error for while running a {@link Project}.
 */
export class ProjectError extends AbstractError<ProjectError.Args> {



    /* LOCAL PROPERTIES
     * ====================================================================== */


    /* Args ===================================== */

    public override readonly name: string = 'Project Error';

    public get ARGS_DEFAULT() {

        return {
            ...AbstractError.prototype.ARGS_DEFAULT,
        } as const satisfies ProjectError.Args;
    }



    /* LOCAL METHODS
     * ====================================================================== */
}

/**
 * Used only for {@link ProjectError}.
 * 
 * @since ___PKG_VERSION___
 */
export namespace ProjectError {

    /**
     * Optional configuration for {@link ProjectError} class.
     * 
     * @since ___PKG_VERSION___
     */
    export interface Args extends LocalError.Args {
    };
}
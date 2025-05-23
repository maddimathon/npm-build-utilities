/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/npm-build-utilities@0.1.0-draft
 * @license MIT
 */
import type { LocalError } from '../../../types/LocalError.js';
import { AbstractError } from './abstract/AbstractError.js';
/**
 * An extension of the utilities error for while running a {@link Project}.
 */
export declare class ProjectError extends AbstractError<ProjectError.Args> {
    readonly name: string;
    get ARGS_DEFAULT(): any;
}
/**
 * Used only for {@link ProjectError}.
 *
 * @since 0.1.0-draft
 */
export declare namespace ProjectError {
    /**
     * Optional configuration for {@link ProjectError} class.
     *
     * @since 0.1.0-draft
     */
    interface Args extends LocalError.Args {
    }
}
//# sourceMappingURL=ProjectError.d.ts.map
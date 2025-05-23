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
 * An extension of the utilities error for catching errors, mainly ones that are
 * not (Error) objects already.
 */
export declare class UnknownCaughtError extends AbstractError<UnknownCaughtError.Args> {
    readonly name: string;
    get ARGS_DEFAULT(): any;
    constructor(message: string, args?: ConstructorParameters<typeof AbstractError>[2] & {
        context?: ConstructorParameters<typeof AbstractError>[1];
    });
}
/**
 * Used only for {@link UnknownCaughtError}.
 *
 * @since 0.1.0-draft
 */
export declare namespace UnknownCaughtError {
    /**
     * Optional configuration for {@link UnknownCaughtError} class.
     *
     * @since 0.1.0-draft
     */
    interface Args extends LocalError.Args {
        context: AbstractError.Context;
    }
}
//# sourceMappingURL=UnknownCaughtError.d.ts.map
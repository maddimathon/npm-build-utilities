/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.1.draft
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
export declare class UnknownCaughtError extends AbstractError {
    readonly name: string;
    constructor(message: string, cause?: AbstractError.Input);
}
//# sourceMappingURL=UnknownCaughtError.d.ts.map
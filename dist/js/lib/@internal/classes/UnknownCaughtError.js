/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.11
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
    name = 'Unknown Caught Error';
    constructor(message, cause) {
        super(message, null, cause);
    }
}
//# sourceMappingURL=UnknownCaughtError.js.map

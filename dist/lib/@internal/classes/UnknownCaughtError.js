/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-alpha.draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import { AbstractError } from './abstract/AbstractError.js';
/**
 * An extension of the utilities error for catching errors, mainly ones that are
 * not (Error) objects already.
 *
 * @category Errors
 *
 * @since 0.1.0-alpha.draft
 */
export class UnknownCaughtError extends AbstractError {
    /* LOCAL PROPERTIES
     * ====================================================================== */
    /* Args ===================================== */
    name = 'Unknown Caught Error';
    get ARGS_DEFAULT() {
        return {
            ...AbstractError.prototype.ARGS_DEFAULT,
        };
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    constructor(message, args) {
        super(message, args?.context ?? null, args);
    }
}
/**
 * Used only for {@link UnknownCaughtError}.
 *
 * @category Class-Helpers
 *
 * @since 0.1.0-alpha.draft
 */
(function (UnknownCaughtError) {
    ;
})(UnknownCaughtError || (UnknownCaughtError = {}));
//# sourceMappingURL=UnknownCaughtError.js.map
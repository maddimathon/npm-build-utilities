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
 * An extension of the utilities error for while running a {@link Project}.
 *
 * @category Errors
 *
 * @since 0.1.0-alpha.draft
 */
export class ProjectError extends AbstractError {
    /* LOCAL PROPERTIES
     * ====================================================================== */
    /* Args ===================================== */
    name = 'Project Error';
    get ARGS_DEFAULT() {
        return {
            ...AbstractError.prototype.ARGS_DEFAULT,
        };
    }
}
/**
 * Used only for {@link ProjectError}.
 *
 * @category Class-Helpers
 *
 * @since 0.1.0-alpha.draft
 */
(function (ProjectError) {
    ;
})(ProjectError || (ProjectError = {}));
//# sourceMappingURL=ProjectError.js.map
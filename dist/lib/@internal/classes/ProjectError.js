/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-draft
 * @license MIT
 */
import { AbstractError } from './abstract/AbstractError.js';
/**
 * An extension of the utilities error for while running a {@link Project}.
 *
 * @category Errors
 *
 * @since 0.1.0-draft
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
 * @category Errors
 *
 * @since 0.1.0-draft
 */
(function (ProjectError) {
    ;
})(ProjectError || (ProjectError = {}));
//# sourceMappingURL=ProjectError.js.map
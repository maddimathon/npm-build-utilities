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
import { errorHandler } from '../@internal/index.js';
/**
 * Runs a function, with parameters as applicable, and catches (& handles)
 * anything thrown.
 *
 * Overloaded for better function param typing.
 *
 * @experimental
 */
export function catchOrReturn(tryer, level, console, params, callback = null) {
    try {
        return (params
            ? tryer(...params)
            // @ts-expect-error
            : tryer());
    }
    catch (error) {
        let callbackArgs = {};
        if (!callback) {
            callback = errorHandler;
        }
        else if (Array.isArray(callback)) {
            callbackArgs = callback[1];
            callback = callback[0];
        }
        callback(error, level, console, callbackArgs);
        throw error;
    }
}
//# sourceMappingURL=catchOrReturn.js.map
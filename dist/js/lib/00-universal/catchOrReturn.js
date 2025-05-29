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
// import type {
// } from '../../types/index.js';
import { errorHandler } from '../@internal/index.js';
/**
 * Runs a function, with parameters as applicable, and catches (& handles)
 * anything thrown.
 *
 * Overloaded for better function param typing.
 *
 * @category Errors
 *
 * @experimental
 */
export function catchOrReturn(
    tryer,
    level,
    console,
    fs,
    params,
    callback = null,
) {
    try {
        return tryer(...(params ?? []));
    } catch (error) {
        let callbackArgs = {};
        if (!callback) {
            callback = errorHandler;
        } else if (Array.isArray(callback)) {
            callbackArgs = callback[1];
            callback = callback[0];
        }
        callback(error, level, console, fs, callbackArgs);
        throw error;
    }
}
//# sourceMappingURL=catchOrReturn.js.map

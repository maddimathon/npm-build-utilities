/**
 * @since 0.1.0-alpha.1
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.1
 * @license MIT
 */
/**
 * Checks whether an object is empty (by checking for keys and constructor).
 *
 * Non-object types are evaluated in other ways depending on type.
 *
 * @since 0.1.0-alpha.1
 *
 * @internal
 *
 * @UPGRADE - replace with version from utility-typescript when it updates
 */
export function isObjectEmpty(obj) {
    // returns if non-object
    switch (typeof obj) {
        case 'object':
            // returns - checks length if array for
            if (Array.isArray(obj)) {
                return !obj.length;
            }
            break;
        // always false
        case 'boolean':
        case 'bigint':
        case 'function':
        case 'number':
        case 'symbol':
            return false;
        // always true
        case 'undefined':
            return true;
        // have to check
        case 'string':
            return !obj.length;
        // fallback checks for falsey-ness
        default:
            return !obj;
    }
    // returns true
    if (obj === null) {
        return true;
    }
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
//# sourceMappingURL=isObjectEmpty.js.map

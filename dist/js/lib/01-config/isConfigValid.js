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
/**
 * Tests whether the provided object includes all properties required from a
 * valid {@link Config} object.
 *
 * @category Config
 *
 * @internal
 */
export function isConfigValid(test) {
    /**
     * Required keys with the type(s) to verify, if any.
     */
    const requiredKeys = {
        title: 'string',
    };
    // returns on mismatch
    for (const _key in requiredKeys) {
        const key = _key;
        // returns
        if (typeof test[key] === 'undefined') {
            return false;
        }
        // continues - this passes because it is defined and has no defined type
        if (!requiredKeys[key]) {
            continue;
        }
        const allowedTypes = Array.isArray(requiredKeys[key])
            ? requiredKeys[key]
            : [requiredKeys[key]];
        // continues - this passes because it is defined and has no defined type
        if (!allowedTypes.length) {
            continue;
        }
    }
    return test;
}
//# sourceMappingURL=isConfigValid.js.map
/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.2.0-alpha.3+1
 * @license MIT
 */
/**
 * Tests whether the provided object includes all properties required from a
 * valid {@link Config} object.
 *
 * @category Config
 *
 * @param test  The config object to check for completeness.
 *
 * @return  False if any required properties are missing or the wrong type.
 *          Otherwise, this returns a {@link Config} object for nice typing.
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export function isConfigValid(test) {
    /**
     * Required keys with the type(s) to verify, if any.
     */
    const requiredKeys = {
        title: 'string',
        launchYear: 'string',
    };
    // returns on mismatch
    for (const _key in requiredKeys) {
        const key = _key;
        // returns
        if (typeof test[key] === 'undefined') {
            return false;
        }
        // continues - this passes because it is defined and has no defined type
        if (requiredKeys[key] === null) {
            continue;
        }
        const allowedTypes =
            Array.isArray(requiredKeys[key]) ?
                requiredKeys[key]
            :   [requiredKeys[key]];
        // continues - this passes because it is defined and has no defined type
        if (!allowedTypes.length) {
            continue;
        }
        // returns - type mismatch
        if (!allowedTypes.includes(typeof test[key])) {
            return false;
        }
    }
    return test;
}
//# sourceMappingURL=isConfigValid.js.map

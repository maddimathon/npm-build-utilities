/**
 * @since 0.3.0-alpha.9
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.10
 * @license MIT
 */
import { mergeArgs } from '@maddimathon/utility-typescript/functions';
/**
 * Returns a default jest config object with optional overrides.
 *
 * @since 0.3.0-alpha.9
 */
export function jestConfig(overrides) {
    return mergeArgs(jestConfig.DEFAULT, overrides, true);
}
/**
 * utilities for the {@link jestConfig} function.
 *
 * @since 0.3.0-alpha.9
 */
(function (jestConfig) {
    /**
     * Default jest configuration values.
     *
     * @since 0.3.0-alpha.9
     */
    jestConfig.DEFAULT = {
        // An array of regexp pattern strings used to skip coverage collection
        coveragePathIgnorePatterns: [
            '(^|\/).scripts\/',
            '(^|\/).snapshots\/',
            '(^|\/)@releases\/',
            '(^|\/)docs\/',
            '(^|\/)node_modules\/',
            '(^|\/)src\/',
            '(^|\/)\._.+',
        ],
        // Indicates which provider should be used to instrument code for coverage
        coverageProvider: 'v8',
        // Activates notifications for test results
        notify: false,
        // An enum that specifies notification mode. Requires { notify: true }
        notifyMode: 'failure-change',
        // The glob patterns Jest uses to detect test files
        testMatch: ['**/?(*.)+(test).js?(x)'],
        // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
        testPathIgnorePatterns: [
            '(^|\\/).snapshots\\/',
            '(^|\\/)@releases\\/',
            '(^|\\/)demos\\/',
            '(^|\\/)docs\\/',
            '(^|\\/)node_modules\\/',
            '(^|\\/)\\._.+',
        ],
        // A map from regular expressions to paths to transformers
        transform: {},
    };
})(jestConfig || (jestConfig = {}));
//# sourceMappingURL=jestConfig.js.map

/**
 * @since 0.3.0-alpha.9
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.1
 * @license MIT
 */
import { escRegExp, mergeArgs } from '@maddimathon/utility-typescript';
/**
 * Returns a default jest config object with optional overrides.
 *
 * @since 0.3.0-alpha.9
 */
export function jestConfig(projectConfig, overrides) {
    return mergeArgs(jestConfig.DEFAULT(projectConfig), overrides, true);
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
    function DEFAULT(projectConfig) {
        return {
            // An array of regexp pattern strings used to skip coverage collection
            coveragePathIgnorePatterns: [
                '(^|\/).scripts\/',
                `(^|\/)${escRegExp(projectConfig?.paths?.snapshot ?? '.snapshots')}\/`,
                `(^|\/)${escRegExp(projectConfig?.paths?.release ?? '@releases')}\/`,
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
            testMatch: ['**/*.test.js?(x)'],
            // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
            testPathIgnorePatterns: [
                `(^|\\/)${escRegExp(projectConfig?.paths?.snapshot ?? '.snapshots')}\\/`,
                `(^|\\/)${escRegExp(projectConfig?.paths?.release ?? '@releases')}\\/`,
                '(^|\\/)docs\\/',
                '(^|\\/)node_modules\\/',
                '(^|\\/)\\._.+',
            ],
            // A map from regular expressions to paths to transformers
            transform: {},
        };
    }
    jestConfig.DEFAULT = DEFAULT;
})(jestConfig || (jestConfig = {}));

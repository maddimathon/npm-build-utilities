//@ts-check

/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/**
 * @import * as jest from 'jest';
 */

/**
 * @type {jest.Config}
 */
const config = {

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
    notifyMode: "failure-change",

    // The glob patterns Jest uses to detect test files
    testMatch: [
        '**/?(*.)+(test).js?(x)',
    ],

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

export default config;

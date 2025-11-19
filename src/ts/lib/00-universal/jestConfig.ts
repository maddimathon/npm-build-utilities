/**
 * @since 0.3.0-alpha.9
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */


import { mergeArgs } from '@maddimathon/utility-typescript/functions';
import type jest from 'jest';

/**
 * Returns a default jest config object with optional overrides.
 * 
 * @since 0.3.0-alpha.9
 */
export function jestConfig<T_Overrides extends undefined | jest.Config>( overrides?: T_Overrides ) {

    return mergeArgs(
        jestConfig.DEFAULT,
        overrides as T_Overrides & typeof jestConfig.DEFAULT,
        true,
    );
}

/**
 * utilities for the {@link jestConfig} function.
 * 
 * @since 0.3.0-alpha.9
 */
export namespace jestConfig {

    /**
     * Default jest configuration values.
     * 
     * @since 0.3.0-alpha.9
     */
    export const DEFAULT = {

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
    } as const satisfies jest.Config;
}
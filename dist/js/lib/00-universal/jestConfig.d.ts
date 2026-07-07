/**
 * @since 0.3.0-alpha.9
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.1
 * @license MIT
 */
import type jest from 'jest';
import type { Config } from '../../types/Config.js';
/**
 * Returns a default jest config object with optional overrides.
 *
 * @since 0.3.0-alpha.9
 */
export declare function jestConfig<T_Config extends Partial<Config>, T_Overrides extends undefined | jest.Config>(projectConfig?: T_Config, overrides?: T_Overrides): {
    readonly coveragePathIgnorePatterns: ["(^|/).scripts/", `(^|/)${string}/`, `(^|/)${string}/`, "(^|/)docs/", "(^|/)node_modules/", "(^|/)src/", "(^|/)._.+"];
    readonly coverageProvider: "v8";
    readonly notify: false;
    readonly notifyMode: "failure-change";
    readonly testMatch: ["**/*.test.js?(x)"];
    readonly testPathIgnorePatterns: [`(^|\\/)${string}\\/`, `(^|\\/)${string}\\/`, "(^|\\/)docs\\/", "(^|\\/)node_modules\\/", "(^|\\/)\\._.+"];
    readonly transform: {};
} | ({
    readonly coveragePathIgnorePatterns: ["(^|/).scripts/", `(^|/)${string}/`, `(^|/)${string}/`, "(^|/)docs/", "(^|/)node_modules/", "(^|/)src/", "(^|/)._.+"];
    readonly coverageProvider: "v8";
    readonly notify: false;
    readonly notifyMode: "failure-change";
    readonly testMatch: ["**/*.test.js?(x)"];
    readonly testPathIgnorePatterns: [`(^|\\/)${string}\\/`, `(^|\\/)${string}\\/`, "(^|\\/)docs\\/", "(^|\\/)node_modules\\/", "(^|\\/)\\._.+"];
    readonly transform: {};
} & T_Overrides & typeof jestConfig.DEFAULT);
/**
 * utilities for the {@link jestConfig} function.
 *
 * @since 0.3.0-alpha.9
 */
export declare namespace jestConfig {
    /**
     * Default jest configuration values.
     *
     * @since 0.3.0-alpha.9
     */
    function DEFAULT<T_Config extends Partial<Config>>(projectConfig?: T_Config): {
        readonly coveragePathIgnorePatterns: ["(^|/).scripts/", `(^|/)${string}/`, `(^|/)${string}/`, "(^|/)docs/", "(^|/)node_modules/", "(^|/)src/", "(^|/)._.+"];
        readonly coverageProvider: "v8";
        readonly notify: false;
        readonly notifyMode: "failure-change";
        readonly testMatch: ["**/*.test.js?(x)"];
        readonly testPathIgnorePatterns: [`(^|\\/)${string}\\/`, `(^|\\/)${string}\\/`, "(^|\\/)docs\\/", "(^|\\/)node_modules\\/", "(^|\\/)\\._.+"];
        readonly transform: {};
    };
}

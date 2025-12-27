/**
 * @since 0.3.0-alpha.9
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.13
 * @license MIT
 */
import type jest from 'jest';
/**
 * Returns a default jest config object with optional overrides.
 *
 * @since 0.3.0-alpha.9
 */
export declare function jestConfig<T_Overrides extends undefined | jest.Config>(overrides?: T_Overrides): {
    readonly coveragePathIgnorePatterns: ["(^|/).scripts/", "(^|/).snapshots/", "(^|/)@releases/", "(^|/)docs/", "(^|/)node_modules/", "(^|/)src/", "(^|/)._.+"];
    readonly coverageProvider: "v8";
    readonly notify: false;
    readonly notifyMode: "failure-change";
    readonly testMatch: ["**/?(*.)+(test).js?(x)"];
    readonly testPathIgnorePatterns: ["(^|\\/).snapshots\\/", "(^|\\/)@releases\\/", "(^|\\/)demos\\/", "(^|\\/)docs\\/", "(^|\\/)node_modules\\/", "(^|\\/)\\._.+"];
    readonly transform: {};
} & T_Overrides;
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
    const DEFAULT: {
        readonly coveragePathIgnorePatterns: ["(^|/).scripts/", "(^|/).snapshots/", "(^|/)@releases/", "(^|/)docs/", "(^|/)node_modules/", "(^|/)src/", "(^|/)._.+"];
        readonly coverageProvider: "v8";
        readonly notify: false;
        readonly notifyMode: "failure-change";
        readonly testMatch: ["**/?(*.)+(test).js?(x)"];
        readonly testPathIgnorePatterns: ["(^|\\/).snapshots\\/", "(^|\\/)@releases\\/", "(^|\\/)demos\\/", "(^|\\/)docs\\/", "(^|\\/)node_modules\\/", "(^|\\/)\\._.+"];
        readonly transform: {};
    };
}
//# sourceMappingURL=jestConfig.d.ts.map
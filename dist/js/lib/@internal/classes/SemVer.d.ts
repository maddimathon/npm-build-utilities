/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.2
 * @license MIT
 */
import type { Logger } from '../../../types/Logger.js';
import { AbstractError } from './abstract/index.js';
/**
 * For parsing and validating semantic version strings.
 *
 * Here temporarily; this will likely move to
 * {@link https://maddimathon.github.io/utility-typescript/ | utility-typescript}
 * eventually.
 *
 * @category Config
 *
 * @see {@link https://semver.org/spec/v2.0.0.html | Semantic Version 2.0.0 spec}
 * @see {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json | Node’s package.json documentation}
 * @see {@link https://www.npmjs.com/package/semver | Node’s semver package}
 *
 * @since 0.1.0-alpha
 *
 * @experimental
 * @internal
 */
export declare class SemVer {
    #private;
    protected readonly input: string;
    protected readonly console: Logger;
    /**
     * Version number representing the current major release.
     *
     * Incremented “when you make incompatible API changes”.
     */
    readonly major: number;
    /**
     * Version number representing the current minor release.
     *
     * Incremented “when you add functionality in a backward compatible manner”.
     */
    readonly minor: number;
    /**
     * Version number representing the current patch release.
     *
     * Incremented “when you make backward compatible bug fixes”.
     */
    readonly patch: number;
    /**
     * The pre-release version string(s), if any. If an array, the strings are
     * joined with `'.'`.
     *
     * > Identifiers MUST comprise only ASCII alphanumerics and hyphens
     * > [0-9A-Za-z-]. Identifiers MUST NOT be empty.
     *
     * > A pre-release version indicates that the version is unstable and might
     * > not satisfy the intended compatibility requirements as denoted by its
     * > associated normal version.
     */
    readonly prerelease?: string | string[];
    /**
     * Build metadata, if any.
     *
     * > Identifiers MUST comprise only ASCII alphanumerics and hyphens
     * > [0-9A-Za-z-]. Identifiers MUST NOT be empty. Build metadata MUST be
     * > ignored when determining version precedence. Thus two versions that
     * > differ only in the build metadata, have the same precedence.
     */
    readonly meta?: string;
    /**
     * The regular expression used to match a valid semantic version.
     *
     * @since 0.2.0-alpha — Now static, not local.
     */
    static get regex(): RegExp;
    /**
     * @throws {@link SemVer.Error} — If input string is not valid and cannot be
     *                                corrected.
     *
     * @param input    Version string to parse.
     * @param console  Instance used to log messages and debugging info.
     */
    constructor(input: string, console: Logger);
    /**
     * Returns a valid version string representation of this instance.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString | Object.prototype.toString()}
     *
     * @param draft  Whether to include a draft marker in the version string.
     *               Default false.
     */
    toString(draft?: boolean): string;
}
/**
 * Used only for the {@link SemVer} class.
 *
 * @category Config
 *
 * @since 0.1.0-alpha
 */
export declare namespace SemVer {
    /**
     * An extension of the utilities error used by the {@link SemVer} class.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha
     */
    class Error extends AbstractError {
        readonly code: Error.Code;
        readonly name: string;
        constructor(message: string, code: Error.Code, context: null | AbstractError.Context, cause?: AbstractError.Input);
    }
    /**
     * Used only for {@link SemVer.Error}.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha
     */
    namespace Error {
        /**
         * All allowed error code strings.
         *
         * @since 0.1.0-alpha
         */
        type Code = typeof INVALID_INPUT | typeof INVALID_META | typeof INVALID_PRERELEASE | typeof INVALID_VERSION;
        /**
         * Error code for input version strings that cannot be coerced into a
         * valid version.
         *
         * @since 0.1.0-alpha
         */
        const INVALID_INPUT = "4";
        /**
         * Error code for invalid build meta strings.
         *
         * @since 0.1.0-alpha
         */
        const INVALID_META = "3";
        /**
         * Error code for invalid prerelease strings.
         *
         * @since 0.1.0-alpha
         */
        const INVALID_PRERELEASE = "2";
        /**
         * Error code for invalid, missing, or non-matching major, minor, or
         * patch versions.
         *
         * @since 0.1.0-alpha
         */
        const INVALID_VERSION = "1";
    }
}
//# sourceMappingURL=SemVer.d.ts.map
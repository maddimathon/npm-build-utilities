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
import type { LocalError } from '../../../types/LocalError.js';
import type { Logger } from '../../../types/Logger.js';
import { AbstractError } from './abstract/AbstractError.js';
/**
 * For parsing and validating semantic version strings.
 *
 * @internal
 */
export declare class SemVer {
    #private;
    protected readonly input: string;
    protected readonly console: Logger;
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly prerelease?: string | [string, string];
    readonly meta?: string;
    /**
     * The regular expression used to match a valid semantic version.
     */
    protected get regex(): RegExp;
    /**
     * @throws {@link SemVer.Error}  If input string is valid and cannot be corrected.
     */
    constructor(input: string, console: Logger);
    toString(draft?: boolean): string;
}
export declare namespace SemVer {
    /**
     * An extension of the utilities error used by the {@link SemVer} class.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha.draft
     */
    class Error extends AbstractError<Error.Args> {
        readonly code: Error.Code;
        readonly name: string;
        get ARGS_DEFAULT(): any;
        constructor(message: string, code: Error.Code, context: null | AbstractError.Context, args?: Partial<Error.Args> & {
            cause?: LocalError.Input;
        });
    }
    /**
     * Used only for {@link SemVer.Error}.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha.draft
     */
    namespace Error {
        /**
         * All allowed error code strings.
         */
        type Code = typeof INVALID_INPUT | typeof INVALID_META | typeof INVALID_PRERELEASE | typeof INVALID_VERSION;
        /**
         * Error code for input version strings that cannot be coerced into a
         * valid version.
         */
        const INVALID_INPUT = "4";
        /**
         * Error code for invalid build meta strings.
         */
        const INVALID_META = "3";
        /**
         * Error code for invalid prerelease strings.
         */
        const INVALID_PRERELEASE = "2";
        /**
         * Error code for invalid, missing, or non-matching major, minor, or
         * patch versions.
         */
        const INVALID_VERSION = "1";
        /**
         * Optional configuration for {@link Error} class.
         *
         * @since 0.1.0-alpha.draft
         */
        interface Args extends LocalError.Args {
        }
    }
}
//# sourceMappingURL=SemVer.d.ts.map
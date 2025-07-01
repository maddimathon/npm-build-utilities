/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.4-alpha.1.draft
 * @license MIT
 */
import node_SemVer from 'semver';
import { toTitleCase } from '@maddimathon/utility-typescript/functions';
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
export class SemVer {
    input;
    console;
    /**
     * Version number representing the current major release.
     *
     * Incremented “when you make incompatible API changes”.
     */
    major;
    /**
     * Version number representing the current minor release.
     *
     * Incremented “when you add functionality in a backward compatible manner”.
     */
    minor;
    /**
     * Version number representing the current patch release.
     *
     * Incremented “when you make backward compatible bug fixes”.
     */
    patch;
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
    prerelease;
    /**
     * Build metadata, if any.
     *
     * > Identifiers MUST comprise only ASCII alphanumerics and hyphens
     * > [0-9A-Za-z-]. Identifiers MUST NOT be empty. Build metadata MUST be
     * > ignored when determining version precedence. Thus two versions that
     * > differ only in the build metadata, have the same precedence.
     */
    meta;
    /** @hidden */
    static #regex;
    /**
     * The regular expression used to match a valid semantic version.
     *
     * @since 0.1.4-alpha.1.draft — Now static, not local.
     */
    static get regex() {
        if (typeof this.#regex === 'undefined') {
            this.#regex = new RegExp(
                [
                    '^',
                    '(\\d+)\\.(\\d+)\\.(\\d+)', // major.minor.patch
                    '(?:-((?:\\d+|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:\\d+|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?', // prerelease
                    '(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?', // release notes
                    '$',
                ].join(''),
                'i',
            );
        }
        return this.#regex;
    }
    /**
     * @throws {@link SemVer.Error} — If input string is not valid and cannot be
     *                                corrected.
     *
     * @param input    Version string to parse.
     * @param console  Instance used to log messages and debugging info.
     */
    constructor(input, console) {
        this.input = input;
        this.console = console;
        console.vi.debug({ 'new SemVer() input': input }, 1);
        const matches =
            input?.match(SemVer.regex)
            ?? node_SemVer.clean(input)?.match(SemVer.regex)
            ?? node_SemVer.valid(node_SemVer.coerce(input))?.match(SemVer.regex)
            ?? null; // we're confident in this tuple because of the regex match
        // throws
        if (matches === null) {
            throw new SemVer.Error(
                'Version string is invalid: ' + input,
                SemVer.Error.INVALID_INPUT,
                {
                    class: 'SemVer',
                    method: 'constructor',
                },
            );
        }
        this.major = Number(matches[1]);
        this.minor = Number(matches[2]);
        this.patch = Number(matches[3]);
        // throws if not a number
        for (const prop of ['major', 'minor', 'patch']) {
            if (Number.isNaN(this[prop])) {
                throw new SemVer.Error(
                    `${toTitleCase(prop)} version is not a number: `
                        + this[prop],
                    SemVer.Error.INVALID_VERSION,
                    {
                        class: 'SemVer',
                        method: 'constructor',
                    },
                );
            }
        }
        this.prerelease = matches[4]?.includes('.')
            ? matches[4].split('.').filter((val) => val.length)
            : matches[4];
        // if it's empty, it should be undefined
        if (!this.prerelease?.length) {
            this.prerelease = undefined;
        }
        this.meta = matches[5];
        // if it's empty, it should be undefined
        if (!this.meta?.length) {
            this.meta = undefined;
        }
        this.console.debug(
            [
                ['new SemVer()', { bold: true }],
                [this.console.vi.stringify({ input })],
                [this.console.vi.stringify({ matches })],
                [
                    this.console.vi.stringify({
                        this: {
                            major: this.major,
                            minor: this.minor,
                            patch: this.patch,
                            prerelease: this.prerelease,
                            meta: this.meta,
                        },
                    }),
                ],
                [
                    this.console.vi.stringify({
                        'this.toString()': this.toString(),
                    }),
                ],
                [
                    this.console.vi.stringify({
                        'this.toString( false )': this.toString(false),
                    }),
                ],
            ],
            0,
            { bold: false, italic: false },
            { bold: true },
        );
    }
    /**
     * Returns a valid version string representation of this instance.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString | Object.prototype.toString()}
     *
     * @param draft  Whether to include a draft marker in the version string.
     *               Default false.
     */
    toString(draft = false) {
        let version = [
            this.major.toFixed(0),
            this.minor.toFixed(0),
            this.patch.toFixed(0),
        ].join('.');
        let prerelease = Array.isArray(this.prerelease)
            ? [...this.prerelease]
            : this.prerelease;
        let meta = this.meta;
        if (draft) {
            if (!prerelease) {
                prerelease = 'draft';
            } else if (!Array.isArray(prerelease)) {
                prerelease = [prerelease, 'draft'];
            } else if (!prerelease.includes('draft')) {
                prerelease.push('draft');
            }
        }
        if (prerelease) {
            version =
                version
                + '-'
                + (Array.isArray(prerelease)
                    ? prerelease.join('.')
                    : prerelease);
        }
        if (meta) {
            version = version + '+' + meta;
        }
        return version;
    }
}
/**
 * Used only for the {@link SemVer} class.
 *
 * @category Config
 *
 * @since 0.1.0-alpha
 */
(function (SemVer) {
    /**
     * An extension of the utilities error used by the {@link SemVer} class.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha
     */
    class Error extends AbstractError {
        code;
        name = 'SemVer Error';
        constructor(message, code, context, cause) {
            super(message, context, cause);
            this.code = code;
        }
    }
    SemVer.Error = Error;
    /**
     * Used only for {@link SemVer.Error}.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha
     */
    (function (Error) {
        /**
         * Error code for input version strings that cannot be coerced into a
         * valid version.
         *
         * @since 0.1.0-alpha
         */
        Error.INVALID_INPUT = '4';
        /**
         * Error code for invalid build meta strings.
         *
         * @since 0.1.0-alpha
         */
        Error.INVALID_META = '3';
        /**
         * Error code for invalid prerelease strings.
         *
         * @since 0.1.0-alpha
         */
        Error.INVALID_PRERELEASE = '2';
        /**
         * Error code for invalid, missing, or non-matching major, minor, or
         * patch versions.
         *
         * @since 0.1.0-alpha
         */
        Error.INVALID_VERSION = '1';
    })((Error = SemVer.Error || (SemVer.Error = {})));
})(SemVer || (SemVer = {}));
//# sourceMappingURL=SemVer.js.map

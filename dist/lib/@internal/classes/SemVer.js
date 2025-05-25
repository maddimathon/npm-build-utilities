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
import node_SemVer from 'semver';
import { AbstractError } from './abstract/AbstractError.js';
import { toTitleCase } from '@maddimathon/utility-typescript/functions/index';
/**
 * For parsing and validating semantic version strings.
 *
 * @category Config
 *
 * @since 0.1.0-alpha.draft
 *
 * @internal
 */
export class SemVer {
    input;
    console;
    major;
    minor;
    patch;
    prerelease;
    meta;
    /** @hidden */
    #regex;
    /**
     * The regular expression used to match a valid semantic version.
     */
    get regex() {
        if (typeof this.#regex === 'undefined') {
            this.#regex = new RegExp([
                '^',
                '(\\d+)\\.(\\d+)\\.(\\d+)', // major.minor.patch
                '(?:-((?:\\d+|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:\\d+|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?', // prerelease
                '(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?', // release notes
                '$',
            ].join(''), 'i');
        }
        return this.#regex;
    }
    /**
     * @throws {@link SemVer.Error}  If input string is valid and cannot be corrected.
     */
    constructor(input, console) {
        this.input = input;
        this.console = console;
        const matches = (input.match(this.regex)
            ?? node_SemVer.clean(input)?.match(this.regex)
            ?? node_SemVer.valid(node_SemVer.coerce(input))?.match(this.regex)
            ?? null); // we're confident in this tuple because of the regex match
        // throws
        if (matches === null) {
            throw new SemVer.Error('Version string is invalid: ' + input, SemVer.Error.INVALID_INPUT, {
                class: 'SemVer',
                method: 'constructor',
            });
        }
        this.major = Number(matches[1]);
        this.minor = Number(matches[2]);
        this.patch = Number(matches[3]);
        // throws if not a number
        for (const prop of ['major', 'minor', 'patch']) {
            if (Number.isNaN(this[prop])) {
                throw new SemVer.Error(`${toTitleCase(prop)} version is not a number: ` + this[prop], SemVer.Error.INVALID_VERSION, {
                    class: 'SemVer',
                    method: 'constructor',
                });
            }
        }
        this.prerelease = matches[4]?.includes('.')
            ? matches[4].split('.').filter(val => val.length)
            : matches[4];
        if (!this.prerelease?.length) {
            this.prerelease = undefined;
        }
        this.meta = matches[5];
        if (!this.meta?.length) {
            this.meta = undefined;
        }
        this.console.debug([
            ['new SemVer()', { bold: true }],
            [this.console.vi.stringify({ matches })],
            [this.console.vi.stringify({
                    'this': {
                        major: this.major,
                        minor: this.minor,
                        patch: this.patch,
                        prerelease: this.prerelease,
                        meta: this.meta,
                    }
                })],
            [this.console.vi.stringify({ 'this.toString()': this.toString() })],
            [this.console.vi.stringify({ 'this.toString( true )': this.toString(true) })],
        ], 0, { bold: false, italic: false }, { bold: true });
    }
    toString(draft = false) {
        let version = [
            this.major.toFixed(0),
            this.minor.toFixed(0),
            this.patch.toFixed(0),
        ].join('.');
        let prerelease = this.prerelease;
        let meta = this.meta;
        if (draft) {
            if (!prerelease) {
                prerelease = 'draft';
            }
            else if (!Array.isArray(prerelease)) {
                prerelease = [prerelease, 'draft'];
            }
            else if (!meta) {
                meta = 'draft';
            }
            else {
                meta = meta + '--draft';
            }
        }
        if (prerelease) {
            version = version + '-' + (Array.isArray(prerelease)
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
 * @since 0.1.0-alpha.draft
 */
(function (SemVer) {
    /**
     * An extension of the utilities error used by the {@link SemVer} class.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha.draft
     */
    class Error extends AbstractError {
        /* LOCAL PROPERTIES
         * ================================================================== */
        code;
        /* Args ===================================== */
        name = 'SemVer Error';
        get ARGS_DEFAULT() {
            return {
                ...AbstractError.prototype.ARGS_DEFAULT,
            };
        }
        /* CONSTRUCTOR
         * ================================================================== */
        constructor(message, code, context, args) {
            super(message, context, args);
            this.code = code;
        }
    }
    SemVer.Error = Error;
    /**
     * Used only for {@link SemVer.Error}.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha.draft
     */
    (function (Error) {
        /**
         * Error code for input version strings that cannot be coerced into a
         * valid version.
         */
        Error.INVALID_INPUT = '4';
        /**
         * Error code for invalid build meta strings.
         */
        Error.INVALID_META = '3';
        /**
         * Error code for invalid prerelease strings.
         */
        Error.INVALID_PRERELEASE = '2';
        /**
         * Error code for invalid, missing, or non-matching major, minor, or
         * patch versions.
         */
        Error.INVALID_VERSION = '1';
        ;
    })(Error = SemVer.Error || (SemVer.Error = {}));
})(SemVer || (SemVer = {}));
//# sourceMappingURL=SemVer.js.map
/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import node_SemVer from 'semver';

import {
    toTitleCase,
} from '@maddimathon/utility-typescript/functions';

import type { Logger } from '../../../types/Logger.js';

import {
    AbstractError,
} from './abstract/index.js';

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
 * @since ___PKG_VERSION___
 * 
 * @experimental
 * @internal
 */
export class SemVer {

    /**
     * Version number representing the current major release.
     * 
     * Incremented “when you make incompatible API changes”.
     */
    public readonly major: number;

    /**
     * Version number representing the current minor release.
     * 
     * Incremented “when you add functionality in a backward compatible manner”.
     */
    public readonly minor: number;

    /**
     * Version number representing the current patch release.
     * 
     * Incremented “when you make backward compatible bug fixes”.
     */
    public readonly patch: number;

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
    public readonly prerelease?: string | string[];

    /**
     * Build metadata, if any.
     *
     * > Identifiers MUST comprise only ASCII alphanumerics and hyphens
     * > [0-9A-Za-z-]. Identifiers MUST NOT be empty. Build metadata MUST be
     * > ignored when determining version precedence. Thus two versions that
     * > differ only in the build metadata, have the same precedence.
     */
    public readonly meta?: string;

    /** @hidden */
    #regex: RegExp | undefined;

    /**
     * The regular expression used to match a valid semantic version.
     */
    protected get regex(): RegExp {

        if ( typeof this.#regex === 'undefined' ) {

            this.#regex = new RegExp( [
                '^',
                '(\\d+)\\.(\\d+)\\.(\\d+)', // major.minor.patch
                '(?:-((?:\\d+|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:\\d+|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?', // prerelease
                '(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?', // release notes
                '$',
            ].join( '' ), 'i' );
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
    constructor (
        protected readonly input: string,
        protected readonly console: Logger,
    ) {

        const matches = (
            input.match( this.regex )
            ?? node_SemVer.clean( input )?.match( this.regex )
            ?? node_SemVer.valid( node_SemVer.coerce( input ) )?.match( this.regex )
        ) as null | [
            string,
            string,
            string,
            string,
            string | undefined,
            string | undefined,
        ]; // we're confident in this tuple because of the regex match

        // throws
        if ( matches === null ) {

            throw new SemVer.Error(
                'Version string is invalid: ' + input,
                SemVer.Error.INVALID_INPUT,
                {
                    class: 'SemVer',
                    method: 'constructor',
                },
            );
        }

        this.major = Number( matches[ 1 ] );
        this.minor = Number( matches[ 2 ] );
        this.patch = Number( matches[ 3 ] );

        // throws if not a number
        for ( const prop of ( [ 'major', 'minor', 'patch' ] as const ) ) {

            if ( Number.isNaN( this[ prop ] ) ) {

                throw new SemVer.Error(
                    `${ toTitleCase( prop ) } version is not a number: ` + this[ prop ],
                    SemVer.Error.INVALID_VERSION,
                    {
                        class: 'SemVer',
                        method: 'constructor',
                    },
                );
            }
        }

        this.prerelease = matches[ 4 ]?.includes( '.' )
            ? matches[ 4 ].split( '.' ).filter( val => val.length ) as [ string, string ]
            : matches[ 4 ];

        // if it's empty, it should be undefined
        if ( !this.prerelease?.length ) {
            this.prerelease = undefined;
        }

        this.meta = matches[ 5 ];

        // if it's empty, it should be undefined
        if ( !this.meta?.length ) {
            this.meta = undefined;
        }

        this.console.debug( [
            [ 'new SemVer()', { bold: true } ],
            [ this.console.vi.stringify( { matches } ) ],
            [ this.console.vi.stringify( {
                'this': {
                    major: this.major,
                    minor: this.minor,
                    patch: this.patch,
                    prerelease: this.prerelease,
                    meta: this.meta,
                }
            } ) ],
            [ this.console.vi.stringify( { 'this.toString()': this.toString() } ) ],
            [ this.console.vi.stringify( { 'this.toString( false )': this.toString( false ) } ) ],
        ], 0, { bold: false, italic: false }, { bold: true } );
    }

    /**
     * Returns a valid version string representation of this instance.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString | Object.prototype.toString()}
     * 
     * @param draft  Whether to include a draft marker in the version string. 
     *               Default false.
     */
    public toString( draft: boolean = false ): string {

        let version = [
            this.major.toFixed( 0 ),
            this.minor.toFixed( 0 ),
            this.patch.toFixed( 0 ),
        ].join( '.' );

        let prerelease = this.prerelease;

        let meta = this.meta;

        if ( draft ) {

            if ( !prerelease ) {
                prerelease = 'draft';
            } else if ( !Array.isArray( prerelease ) ) {
                prerelease = [ prerelease, 'draft' ];
            } else {
                prerelease.push( 'draft' );
            }
        }

        if ( prerelease ) {

            version = version + '-' + (
                Array.isArray( prerelease )
                    ? prerelease.join( '.' )
                    : prerelease
            );
        }

        if ( meta ) {
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
 * @since ___PKG_VERSION___
 */
export namespace SemVer {

    /**
     * An extension of the utilities error used by the {@link SemVer} class.
     * 
     * @category Errors
     * 
     * @since ___PKG_VERSION___
     */
    export class Error extends AbstractError {

        public readonly code: Error.Code;

        public override readonly name: string = 'SemVer Error';

        public constructor (
            message: string,
            code: Error.Code,
            context: null | AbstractError.Context,
            cause?: AbstractError.Input,
        ) {
            super( message, context, cause );
            this.code = code;
        }
    }

    /**
     * Used only for {@link SemVer.Error}.
     * 
     * @category Errors
     * 
     * @since ___PKG_VERSION___
     */
    export namespace Error {

        /**
         * All allowed error code strings.
         * 
         * @since ___PKG_VERSION___
         */
        export type Code =
            | typeof INVALID_INPUT
            | typeof INVALID_META
            | typeof INVALID_PRERELEASE
            | typeof INVALID_VERSION;

        /**
         * Error code for input version strings that cannot be coerced into a
         * valid version.
         * 
         * @since ___PKG_VERSION___
         */
        export const INVALID_INPUT = '4';

        /**
         * Error code for invalid build meta strings.
         * 
         * @since ___PKG_VERSION___
         */
        export const INVALID_META = '3';

        /**
         * Error code for invalid prerelease strings.
         * 
         * @since ___PKG_VERSION___
         */
        export const INVALID_PRERELEASE = '2';

        /**
         * Error code for invalid, missing, or non-matching major, minor, or
         * patch versions.
         * 
         * @since ___PKG_VERSION___
         */
        export const INVALID_VERSION = '1';
    }
}
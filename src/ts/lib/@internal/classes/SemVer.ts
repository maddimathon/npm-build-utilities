/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import node_SemVer from 'semver';

import type { LocalError } from '../../../types/LocalError.js';
import type { Logger } from '../../../types/Logger.js';

import { AbstractError } from './abstract/AbstractError.js';
import { toTitleCase } from '@maddimathon/utility-typescript/functions/index';

/**
 * For parsing and validating semantic version strings.
 * 
 * @category Config
 * 
 * @since ___PKG_VERSION___
 * 
 * @internal
 */
export class SemVer {

    public readonly major: number;
    public readonly minor: number;
    public readonly patch: number;

    public readonly prerelease?: string | [ string, string ];
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
     * @throws {@link SemVer.Error}  If input string is valid and cannot be corrected.
     */
    constructor (
        protected readonly input: string,
        protected readonly console: Logger,
    ) {

        const matches = (
            input.match( this.regex )
            ?? node_SemVer.clean( input )?.match( this.regex )
            ?? node_SemVer.valid( node_SemVer.coerce( input ) )?.match( this.regex )
            ?? null
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

        if ( !this.prerelease?.length ) {
            this.prerelease = undefined;
        }

        this.meta = matches[ 5 ];

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
            [ this.console.vi.stringify( { 'this.toString( true )': this.toString( true ) } ) ],
        ], 0, { bold: false, italic: false }, { bold: true } );
    }

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
            } else if ( !meta ) {
                meta = 'draft';
            } else {
                meta = meta + '--draft';
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
    export class Error extends AbstractError<Error.Args> {



        /* LOCAL PROPERTIES
         * ================================================================== */

        public readonly code: Error.Code;


        /* Args ===================================== */

        public override readonly name: string = 'SemVer Error';

        public get ARGS_DEFAULT() {

            return {
                ...AbstractError.prototype.ARGS_DEFAULT,
            } as const satisfies Error.Args;
        }



        /* CONSTRUCTOR
         * ================================================================== */

        public constructor (
            message: string,
            code: Error.Code,
            context: null | AbstractError.Context,
            args?: Partial<Error.Args> & { cause?: LocalError.Input; },
        ) {
            super( message, context, args );
            this.code = code;
        }



        /* LOCAL METHODS
         * ================================================================== */
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
         */
        export type Code =
            | typeof INVALID_INPUT
            | typeof INVALID_META
            | typeof INVALID_PRERELEASE
            | typeof INVALID_VERSION;

        /**
         * Error code for input version strings that cannot be coerced into a
         * valid version.
         */
        export const INVALID_INPUT = '4';

        /**
         * Error code for invalid build meta strings.
         */
        export const INVALID_META = '3';

        /**
         * Error code for invalid prerelease strings.
         */
        export const INVALID_PRERELEASE = '2';

        /**
         * Error code for invalid, missing, or non-matching major, minor, or
         * patch versions.
         */
        export const INVALID_VERSION = '1';

        /**
         * Optional configuration for {@link Error} class.
         * 
         * @since ___PKG_VERSION___
         */
        export interface Args extends LocalError.Args {
        };
    }
}
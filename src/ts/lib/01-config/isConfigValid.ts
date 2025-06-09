/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type {
    Objects,
} from '@maddimathon/utility-typescript/types';

import type {
    Config,
} from '../../types/index.js';


/**
 * Tests whether the provided object includes all properties required from a
 * valid {@link Config} object.
 *
 * @category Config
 *
 * @param test  The config object to check for completeness.
 *
 * @return  False if any required properties are missing or the wrong type.
 *          Otherwise, this returns a {@link Config} object for nice typing.
 * 
 * @since ___PKG_VERSION___
 *
 * @internal
 */
export function isConfigValid( test: Config | Partial<Config> ): false | Config {

    type ValueType = null | "number" | "string";

    /**
     * Required keys with the type(s) to verify, if any.
     */
    const requiredKeys: {
        [ K in Objects.KeysRequired<Config> ]: ValueType | ValueType[];
    } = {
        title: 'string',
        launchYear: 'string',
    };

    // returns on mismatch
    for ( const _key in requiredKeys ) {
        const key = _key as keyof typeof requiredKeys;

        // returns
        if ( typeof test[ key ] === 'undefined' ) {
            return false;
        }

        // continues - this passes because it is defined and has no defined type
        if ( requiredKeys[ key ] === null ) {
            continue;
        }

        const allowedTypes = Array.isArray( requiredKeys[ key ] )
            ? requiredKeys[ key ]
            : [ requiredKeys[ key ] ];

        // continues - this passes because it is defined and has no defined type
        if ( !allowedTypes.length ) {
            continue;
        }

        // returns - type mismatch
        if ( !allowedTypes.includes( typeof test[ key ] as ValueType ) ) {
            return false;
        }
    }

    return test as Config;
}
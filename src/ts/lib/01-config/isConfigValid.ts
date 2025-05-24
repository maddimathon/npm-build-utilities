/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type { Objects } from '@maddimathon/utility-typescript/types';

import type { Config } from '../../types/index.js';


/**
 * Tests whether the provided object includes all properties required from a
 * valid {@link Config} object.
 * 
 * @category Config
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
    };

    // returns on mismatch
    for ( const _key in requiredKeys ) {
        const key = _key as keyof typeof requiredKeys;

        // returns
        if ( typeof test[ key ] === 'undefined' ) {
            return false;
        }

        // continues - this passes because it is defined and has no defined type
        if ( !requiredKeys[ key ] ) {
            continue;
        }

        const allowedTypes = Array.isArray( requiredKeys[ key ] )
            ? requiredKeys[ key ]
            : [ requiredKeys[ key ] ];

        // continues - this passes because it is defined and has no defined type
        if ( !allowedTypes.length ) {
            continue;
        }
    }

    return test as Config;
}
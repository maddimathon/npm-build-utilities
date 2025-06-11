/**
 * @since 0.1.0-alpha.1
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type { Test } from '@maddimathon/utility-typescript/types';
import { expect, test } from '@jest/globals';

import { isObjectEmpty } from './isObjectEmpty.js';

test( 'isObjectEmpty()', () => {

    type tests = [
        Test.Expect<Test.Exactly<ReturnType<typeof isObjectEmpty>, boolean>>,
    ];

    // booleans
    expect( isObjectEmpty( false ) ).toEqual( false );
    expect( isObjectEmpty( true ) ).toEqual( false );

    // bigints
    expect( isObjectEmpty( BigInt( 546548943516 ) ) ).toEqual( false );

    // functions
    expect( isObjectEmpty( 'function' ) ).toEqual( false );

    // numbers
    expect( isObjectEmpty( 0 ) ).toEqual( false );
    expect( isObjectEmpty( 10 ) ).toEqual( false );
    expect( isObjectEmpty( 1358 ) ).toEqual( false );

    // strings
    expect( isObjectEmpty( '' ) ).toEqual( true );
    expect( isObjectEmpty( 'string' ) ).toEqual( false );

    // undefined
    expect( isObjectEmpty( undefined ) ).toEqual( true );

    // arrays
    expect( isObjectEmpty( [] ) ).toEqual( true );
    expect( isObjectEmpty( [ 'array' ] ) ).toEqual( false );

    // objects
    expect( isObjectEmpty( {} ) ).toEqual( true );
    expect( isObjectEmpty( { one: 'one' } ) ).toEqual( false );
    expect( isObjectEmpty( new RegExp( 'ex' ) ) ).toEqual( false );

    // as tests[0] only so that type is used
    true as tests[ 0 ];
} );
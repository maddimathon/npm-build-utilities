/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import { expect, test } from '@jest/globals';

import { exampleFunction } from './exampleFunction.js';


test( 'exampleFunction()', () => {
    expect( exampleFunction() ).toBe( 'hello' );
} );

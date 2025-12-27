/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import { describe, expect, test } from '@jest/globals';

import { ExampleClass } from './ExampleClass.js';


describe( 'ExampleClass', () => {

    const exClass = new ExampleClass();

    test( 'ExampleClass.test()', () => {
        expect( exClass.test() ).toBe( 'hello' );
    } );
} );

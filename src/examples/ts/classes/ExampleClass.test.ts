/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @since 0.1.1+tmpl
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
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

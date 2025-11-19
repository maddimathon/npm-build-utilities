/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type { Test } from '@maddimathon/utility-typescript/types';

import { test } from '@jest/globals';

import {
    type AbstractError,
} from './classes/index.js';

import { errorHandler } from './errorHandler.js';


// checks if the actual function can be assigned to its type
export const testFunction: AbstractError.Handler = errorHandler;

// double-checks that the types match
export type TypeTest = [
    Test.Expect<Test.Satisfies<typeof errorHandler, AbstractError.Handler>>,
    Test.Expect<Test.Exactly<typeof errorHandler, AbstractError.Handler>>,
];

// UPGRADE tests
test.todo( 'errorHandler JS tests' );
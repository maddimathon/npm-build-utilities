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

import type { Test } from '@maddimathon/utility-typescript/types';

import { test } from '@jest/globals';

import type {
    LocalError,
} from '../../types/index.js';

import { errorHandler } from './errorHandler.js';


// checks if the actual function can be assigned to its type
const testFunction: LocalError.Handler = errorHandler;

// double-checks that the types match
type TypeTest = [
    Test.Expect<Test.Satisfies<typeof errorHandler, LocalError.Handler>>,
    Test.Expect<Test.Exactly<typeof errorHandler, LocalError.Handler>>,
];

// only here so that these are used and don’t throw errors
true as TypeTest[ 0 ];
testFunction;

// TODO tests
test.todo( 'errorHandler JS tests' );
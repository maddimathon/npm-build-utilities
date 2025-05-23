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

import type { Test } from '@maddimathon/utility-typescript/types';

import type { FileSystemType } from '../../../types/index.js';

import { FileSystem } from './FileSystem.js';

// gets the expected type
type _ClassType = ( new ( ...a: any[] ) => FileSystemType );

// checks if the actual class can be assigned to its class type
const testClass: _ClassType = FileSystem;

// double-checks that the types match
type TypeTest = [
    Test.Expect<Test.Satisfies<typeof FileSystem, _ClassType>>,
    // Test.Expect<Test.Exactly<typeof FileSystem, _ClassType>>,
];

// only here so that these are used and don’t throw errors
true as TypeTest[ 0 ];
testClass;

// TODO tests
test.todo( 'FileSystem JS tests' );
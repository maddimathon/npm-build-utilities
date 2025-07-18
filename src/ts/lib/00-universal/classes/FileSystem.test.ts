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

// import type {
// } from '../../../types/index.js';

import type { FileSystemType } from '../../../types/FileSystemType.js';
import type { Logger } from '../../../types/Logger.js';

import { FileSystem } from './FileSystem.js';

// gets the expected type
type _ClassType = ( new (
    console: Logger,
    args?: Partial<FileSystemType.Args>,
) => FileSystemType );

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

// UPGRADE tests
test.todo( 'FileSystem JS tests' );
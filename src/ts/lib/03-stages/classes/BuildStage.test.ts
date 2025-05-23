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

import type { Stage } from '../../../types/index.js';

import { BuildStage } from './BuildStage.js';

// gets the expected type
type BuildClassType = Stage.ClassType.Build;

// checks if the actual class can be assigned to its class type
const testStage: BuildClassType = BuildStage;

// double-checks that the types match
type TypeTest = [
    Test.Expect<Test.Satisfies<typeof BuildStage, BuildClassType>>,
    Test.ExpectNot<Test.Exactly<typeof BuildStage, BuildClassType>>,
];

// only here so that these are used and don’t throw errors
true as TypeTest[ 0 ];
testStage;

// TODO tests
test.todo( 'BuildStage JS tests' );
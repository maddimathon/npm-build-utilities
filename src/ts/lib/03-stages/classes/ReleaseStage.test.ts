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

import { ReleaseStage } from './ReleaseStage.js';

// gets the expected type
type ReleaseClassType = Stage.ClassType.Release;

// checks if the actual class can be assigned to its class type
const testStage: ReleaseClassType = ReleaseStage;

// double-checks that the types match
type TypeTest = [
    Test.Expect<Test.Satisfies<typeof ReleaseStage, ReleaseClassType>>,
    Test.ExpectNot<Test.Exactly<typeof ReleaseStage, ReleaseClassType>>,
];

// only here so that these are used and don’t throw errors
true as TypeTest[ 0 ];
testStage;

// TODO tests
test.todo( 'ReleaseStage JS tests' );
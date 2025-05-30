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

import type { Stage } from '../../../types/index.js';

import { PackageStage } from './PackageStage.js';


// checks if the actual class can be assigned to its class type
const testStage: Stage.ClassType.Package = PackageStage;

// double-checks that the types match
type TypeTest = [
    Test.Expect<Test.Satisfies<typeof PackageStage, Stage.ClassType.Package>>,
    Test.ExpectNot<Test.Exactly<typeof PackageStage, Stage.ClassType.Package>>,
];

// only here so that these are used and don’t throw errors
true as TypeTest[ 0 ];
testStage;

// TODO tests
test.todo( 'PackageStage JS tests' );
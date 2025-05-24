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

import { CompileStage } from './CompileStage.js';

// gets the expected type
type CompileClassType = Stage.ClassType.Compile;

// checks if the actual class can be assigned to its class type
const testStage: CompileClassType = CompileStage;

// double-checks that the types match
type TypeTest = [
    Test.Expect<Test.Satisfies<typeof CompileStage, CompileClassType>>,
    Test.ExpectNot<Test.Exactly<typeof CompileStage, CompileClassType>>,
];

// only here so that these are used and don’t throw errors
true as TypeTest[ 0 ];
testStage;

// TODO tests
test.todo( 'CompileStage JS tests' );
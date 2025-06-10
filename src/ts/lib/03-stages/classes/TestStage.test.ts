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

import type {
    Stage,
} from '../../../types/index.js';

import { TestStage } from './TestStage.js';


// checks if the actual class can be assigned to its class type
const testStage: Stage.Class.Test = TestStage;

// double-checks that the types match
type TypeTest = [
    Test.Expect<Test.Satisfies<typeof TestStage, Stage.Class.Test>>,
    Test.ExpectNot<Test.Exactly<typeof TestStage, Stage.Class.Test>>,
];

// only here so that these are used and don’t throw errors
true as TypeTest[ 0 ];
testStage;

// TODO tests
test.todo( 'TestStage JS tests' );
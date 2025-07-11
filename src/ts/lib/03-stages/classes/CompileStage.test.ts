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

import { CompileStage } from './CompileStage.js';


// checks if the actual class can be assigned to its class type
const testStage: Stage.Class.Compile = CompileStage;

// double-checks that the types match
type TypeTest = [
    Test.Expect<Test.Satisfies<typeof CompileStage, Stage.Class.Compile>>,
    Test.ExpectNot<Test.Exactly<typeof CompileStage, Stage.Class.Compile>>,
];

// only here so that these are used and don’t throw errors
true as TypeTest[ 0 ];
testStage;

// UPGRADE tests
test.todo( 'CompileStage JS tests' );
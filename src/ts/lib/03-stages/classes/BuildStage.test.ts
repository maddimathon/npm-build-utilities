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

import { BuildStage } from './BuildStage.js';


// checks if the actual class can be assigned to its class type
const testStage: Stage.Class.Build = BuildStage;

// double-checks that the types match
type TypeTest = [
    Test.Expect<Test.Satisfies<typeof BuildStage, Stage.Class.Build>>,
    Test.ExpectNot<Test.Exactly<typeof BuildStage, Stage.Class.Build>>,
];

// only here so that these are used and don’t throw errors
true as TypeTest[ 0 ];
testStage;

// UPGRADE tests
test.todo( 'BuildStage JS tests' );
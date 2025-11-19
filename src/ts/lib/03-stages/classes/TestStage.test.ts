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

import { test } from '@jest/globals';

import type {
    Stage,
} from '../../../types/index.js';

import { TestStage } from './TestStage.js';


// checks if the actual class can be assigned to its class type
export const testStage: Stage.Class.Test = TestStage;

// double-checks that the types match
export type TypeTest = [
    Test.Expect<Test.Satisfies<typeof TestStage, Stage.Class.Test>>,
    Test.ExpectNot<Test.Exactly<typeof TestStage, Stage.Class.Test>>,
];

// UPGRADE tests
test.todo( 'TestStage JS tests' );
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

import { CompileStage } from './CompileStage.js';


// checks if the actual class can be assigned to its class type
export const testStage: Stage.Class.Compile = CompileStage;

// double-checks that the types match
export type TypeTest = [
    Test.Expect<Test.Satisfies<typeof CompileStage, Stage.Class.Compile>>,
    Test.ExpectNot<Test.Exactly<typeof CompileStage, Stage.Class.Compile>>,
];

// UPGRADE tests
test.todo( 'CompileStage JS tests' );
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

import { BuildStage } from './BuildStage.js';


// checks if the actual class can be assigned to its class type
export const testStage: Stage.Class.Build = BuildStage;

// double-checks that the types match
export type TypeTest = [
    Test.Expect<Test.Satisfies<typeof BuildStage, Stage.Class.Build>>,
    Test.ExpectNot<Test.Exactly<typeof BuildStage, Stage.Class.Build>>,
];

// UPGRADE tests
test.todo( 'BuildStage JS tests' );
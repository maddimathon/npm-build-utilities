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

import { ReleaseStage } from './ReleaseStage.js';


// checks if the actual class can be assigned to its class type
export const testStage: Stage.Class.Release = ReleaseStage;

// double-checks that the types match
export type TypeTest = [
    Test.Expect<Test.Satisfies<typeof ReleaseStage, Stage.Class.Release>>,
    Test.ExpectNot<Test.Exactly<typeof ReleaseStage, Stage.Class.Release>>,
];

// UPGRADE tests
test.todo( 'ReleaseStage JS tests' );
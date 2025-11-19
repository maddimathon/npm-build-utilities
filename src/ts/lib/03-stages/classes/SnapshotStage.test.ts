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

import { SnapshotStage } from './SnapshotStage.js';


// checks if the actual class can be assigned to its class type
export const testStage: Stage.Class.Snapshot = SnapshotStage;

// double-checks that the types match
export type TypeTest = [
    Test.Expect<Test.Satisfies<typeof SnapshotStage, Stage.Class.Snapshot>>,
    Test.ExpectNot<Test.Exactly<typeof SnapshotStage, Stage.Class.Snapshot>>,
];

// UPGRADE tests
test.todo( 'SnapshotStage JS tests' );
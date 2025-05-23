/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type { Test } from '@maddimathon/utility-typescript/types';

import type { Stage } from '../../../types/index.js';

import { SnapshotStage } from './SnapshotStage.js';

// gets the expected type
type SnapshotClassType = Stage.ClassType.Snapshot;

// checks if the actual class can be assigned to its class type
const testStage: SnapshotClassType = SnapshotStage;

// double-checks that the types match
type TypeTest = [
    Test.Expect<Test.Satisfies<typeof SnapshotStage, SnapshotClassType>>,
    Test.ExpectNot<Test.Exactly<typeof SnapshotStage, SnapshotClassType>>,
];

// only here so that these are used and don’t throw errors
true as TypeTest[ 0 ];
testStage;

// TODO tests
test.todo( 'SnapshotStage JS tests' );
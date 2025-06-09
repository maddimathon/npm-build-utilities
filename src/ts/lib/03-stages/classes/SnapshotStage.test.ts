/**
 * @since ___PKG_VERSION___
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

import { SnapshotStage } from './SnapshotStage.js';


// checks if the actual class can be assigned to its class type
const testStage: Stage.Class.Snapshot = SnapshotStage;

// double-checks that the types match
type TypeTest = [
    Test.Expect<Test.Satisfies<typeof SnapshotStage, Stage.Class.Snapshot>>,
    Test.ExpectNot<Test.Exactly<typeof SnapshotStage, Stage.Class.Snapshot>>,
];

// only here so that these are used and don’t throw errors
true as TypeTest[ 0 ];
testStage;

// TODO tests
test.todo( 'SnapshotStage JS tests' );
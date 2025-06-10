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

import { ReleaseStage } from './ReleaseStage.js';


// checks if the actual class can be assigned to its class type
const testStage: Stage.Class.Release = ReleaseStage;

// double-checks that the types match
type TypeTest = [
    Test.Expect<Test.Satisfies<typeof ReleaseStage, Stage.Class.Release>>,
    Test.ExpectNot<Test.Exactly<typeof ReleaseStage, Stage.Class.Release>>,
];

// only here so that these are used and don’t throw errors
true as TypeTest[ 0 ];
testStage;

// TODO tests
test.todo( 'ReleaseStage JS tests' );
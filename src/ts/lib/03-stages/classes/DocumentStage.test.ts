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

import { DocumentStage } from './DocumentStage.js';


// checks if the actual class can be assigned to its class type
const testStage: Stage.Class.Document = DocumentStage;

// double-checks that the types match
type TypeTest = [
    Test.Expect<Test.Satisfies<typeof DocumentStage, Stage.Class.Document>>,
    Test.ExpectNot<Test.Exactly<typeof DocumentStage, Stage.Class.Document>>,
];

// only here so that these are used and don’t throw errors
true as TypeTest[ 0 ];
testStage;

// UPGRADE tests
test.todo( 'DocumentStage JS tests' );
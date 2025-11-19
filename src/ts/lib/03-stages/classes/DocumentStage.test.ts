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

import { DocumentStage } from './DocumentStage.js';


// checks if the actual class can be assigned to its class type
export const testStage: Stage.Class.Document = DocumentStage;

// double-checks that the types match
export type TypeTest = [
    Test.Expect<Test.Satisfies<typeof DocumentStage, Stage.Class.Document>>,
    Test.ExpectNot<Test.Exactly<typeof DocumentStage, Stage.Class.Document>>,
];

// UPGRADE tests
test.todo( 'DocumentStage JS tests' );
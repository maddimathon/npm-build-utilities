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

import { PackageStage } from './PackageStage.js';


// checks if the actual class can be assigned to its class type
export const testStage: Stage.Class.Package = PackageStage;

// double-checks that the types match
export type TypeTest = [
    Test.Expect<Test.Satisfies<typeof PackageStage, Stage.Class.Package>>,
    Test.ExpectNot<Test.Exactly<typeof PackageStage, Stage.Class.Package>>,
];

// UPGRADE tests
test.todo( 'PackageStage JS tests' );
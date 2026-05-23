/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type {
    ConsoleUtility,
    RecursivePartial,
    Test,
} from '@maddimathon/utility-typescript/types';

import type { Logger } from './Logger.js';

type ConsoleUtility_Type = ConsoleUtility<[ number, undefined | RecursivePartial<Logger.MsgArgs> ]>;

type ConsoleUtility_Type_VarDump = Omit<
    ConsoleUtility<[ number, undefined | RecursivePartial<Logger.VarInspect.Args> ]>,
    'error' | 'warn'
>;

export type Test_Logger = [
    Test.Expect<Test.Satisfies<Logger, ConsoleUtility_Type>>,
    Test.Expect<Test.Satisfies<Logger.VarInspect, ConsoleUtility_Type_VarDump>>,
];

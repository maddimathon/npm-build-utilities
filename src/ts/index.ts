/**
 * Exports from the root/default export path.
 * 
 * @module (root)
 * 
 * @since ___PKG_VERSION___
 * 
 * @example
 * ```ts
 * import type { ... } from '@maddimathon/npm-build-utilities';
 * import { ... } from '@maddimathon/npm-build-utilities';
 * ```
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @author Maddi Mathon (www.maddimathon.com)
 * @homepage ___CURRENT_URL___
 * 
 * @license MIT
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

export type * from './types/index.js';

/** @hidden - documented as an entry point module */
export * as bin from './bin/lib/index.js';

/** @hidden - documented as an entry point module */
export * as internal from './lib/@internal.js';

export * from './lib/index.js';

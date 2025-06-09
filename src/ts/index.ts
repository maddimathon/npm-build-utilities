/**
 * Exports from the root/default export path.
 * 
 * @module (root)
 * @mergeModuleWith <project>
 * 
 * @since ___PKG_VERSION___
 * 
 * @example
 * ```ts
 * import type { ... } from '@maddimathon/build-utilities';
 * import { ... } from '@maddimathon/build-utilities';
 * ```
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

export type * from './types/index.js';

/** @hidden - documented as an entry point module */
export * as bin from './bin/lib/index.js';

/** @hidden - documented as an entry point module */
export * as internal from './lib/@internal.js';

export * from './lib/index.js';

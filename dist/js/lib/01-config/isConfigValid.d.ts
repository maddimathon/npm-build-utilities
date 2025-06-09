/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import type { Config } from '../../types/index.js';
/**
 * Tests whether the provided object includes all properties required from a
 * valid {@link Config} object.
 *
 * @category Config
 *
 * @param test  The config object to check for completeness.
 *
 * @return  False if any required properties are missing or the wrong type.
 *          Otherwise, this returns a {@link Config} object for nice typing.
 *
 * @since 0.1.0-alpha.draft
 *
 * @internal
 */
export declare function isConfigValid(test: Config | Partial<Config>): false | Config;
//# sourceMappingURL=isConfigValid.d.ts.map
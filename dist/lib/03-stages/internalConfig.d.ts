/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-draft
 * @license MIT
 */
import { Config, Logger } from '../../types/index.js';
/**
 * Takes a partial {@link Config} object and converts it to a
 * {@link Config.Internal} object.
 *
 * @category Config
 *
 * @internal
 */
export declare function internalConfig(_config: (Config | Config & Partial<Config.Internal>), console?: Logger): Config.Internal;
//# sourceMappingURL=internalConfig.d.ts.map
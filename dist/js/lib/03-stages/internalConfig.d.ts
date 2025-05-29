/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-alpha.draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import { Config } from '../../types/index.js';
import type { Logger } from '../../types/Logger.js';
/**
 * Takes a partial {@link Config} object and converts it to a
 * {@link Config.Internal} object.
 *
 * @category Config
 *
 * @internal
 */
export declare function internalConfig(inputConfig: Config | Config.Internal | Partial<Config.Internal> | Config & Partial<Config.Internal>, console?: Logger): Config.Internal;
//# sourceMappingURL=internalConfig.d.ts.map
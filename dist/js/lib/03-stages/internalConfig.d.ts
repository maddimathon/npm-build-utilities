/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.4-alpha
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
 * @param inputConfig  Partial config to complete.
 * @param console      Instance used to log messages and debugging info.
 *
 * @return  Complete object ready for {@link ProjectConfig}.
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export declare function internalConfig(inputConfig: Config | Config.Internal | Config & Partial<Config.Internal>, console?: Logger): Config.Internal;
//# sourceMappingURL=internalConfig.d.ts.map
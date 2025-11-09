/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.7
 * @license MIT
 */
import type { CLI } from '../../types/index.js';
import type { Logger } from '../../types/Logger.js';
import { ProjectConfig } from '../../lib/index.js';
/**
 * Gets the configuration object for the current node package.
 *
 * Prompts the user in the terminal as needed to complete the configuration.
 *
 * @param params   Input CLI params to convert.
 * @param console  Instance used to log messages and debugging info.
 * @param level    Depth level for this message.
 *
 * @returns  Complete config instance.
 *
 * @since 0.1.0-alpha
 * @since 0.1.4-alpha — Experimental support for typescript config files.
 *
 * @internal
 */
export declare function getConfig(params: CLI.Params, console?: Logger | null, level?: number): Promise<ProjectConfig>;
//# sourceMappingURL=getConfig.d.ts.map
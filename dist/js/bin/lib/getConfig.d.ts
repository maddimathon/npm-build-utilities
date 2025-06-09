/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
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
 * @since 0.1.0-alpha.draft
 *
 * @param params   Input CLI params to convert.
 * @param console  Instance used to log messages and debugging info.
 * @param level    Depth level for this message (above the value of {@link CLI.Params.log-base-level}).
 */
export declare function getConfig(params: CLI.Params, console?: Logger | null, level?: number): Promise<ProjectConfig>;
//# sourceMappingURL=getConfig.d.ts.map
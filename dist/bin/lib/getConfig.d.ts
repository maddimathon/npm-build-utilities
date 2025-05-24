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
import type { CLI, Logger } from '../../types/index.js';
import { ProjectConfig } from '../../lib/index.js';
/**
 * Gets the configuration object for the current node package.
 *
 * Prompts the user in the terminal as needed to complete the configuration.
 *
 * @category Config
 *
 * @since 0.1.0-draft
 *
 * @param params   Input CLI params to convert.
 * @param console  Optional. And instance of the console class to use for outputting messages.
 * @param level    Optional. Depth level for this message (above the value of {@link CLI.Params.log-base-level}).
 */
export declare function getConfig(params: CLI.Params, console?: Logger | null, level?: number): Promise<ProjectConfig>;
//# sourceMappingURL=getConfig.d.ts.map
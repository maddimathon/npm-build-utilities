/**
 * @since 0.3.0-beta.3
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.3
 * @license MIT
 */
import type * as CLI from '../../types/CLI.js';
import type { ProjectConfig } from '../../lib/index.js';
/**
 * Use this to dynamically run a build script while normalizing param and config parsing to fit in this system.
 *
 * @since 0.3.0-beta.3
 */
export declare function runBuildScript<T_Return extends any>(callback: (_: {
    config: ProjectConfig;
    params: CLI.Params;
    scriptName: CLI.Command | undefined;
}) => T_Return | Promise<T_Return>): Promise<T_Return>;

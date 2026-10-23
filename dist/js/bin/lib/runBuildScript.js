/**
 * @since 0.3.0-beta.3
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.4
 * @license MIT
 */
import minimist from 'minimist';
import { parseParamsCLI, Project } from '../../lib/index.js';
import { getConfig } from './getConfig.js';
/**
 * Use this to dynamically run a build script while normalizing param and config parsing to fit in this system.
 *
 * @since 0.3.0-beta.3
 */
export async function runBuildScript(callback) {
    process.on('uncaughtException', Project.uncaughtErrorListener);
    const params = parseParamsCLI(minimist(process.argv.slice(2)));
    const scriptName = params._?.[0];
    return callback({
        config: await getConfig(params),
        params,
        scriptName,
    });
}

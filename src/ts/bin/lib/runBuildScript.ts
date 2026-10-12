/**
 * @since 0.3.0-beta.3
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import minimist from 'minimist';

import type * as CLI from '../../types/CLI.js';

import type { ProjectConfig } from '../../lib/index.js';

import { parseParamsCLI, Project } from '../../lib/index.js';

import { getConfig } from './getConfig.js';

/**
 * Use this to dynamically run a build script while normalizing param and config parsing to fit in this system.
 * 
 * @since 0.3.0-beta.3
 */
export async function runBuildScript<T_Return extends any>(
    callback: ( _: {
        config: ProjectConfig;
        params: CLI.Params;
        scriptName: CLI.Command | undefined;
    } ) => T_Return | Promise<T_Return>
): Promise<T_Return> {
    process.on( 'uncaughtException', Project.uncaughtErrorListener );

    const params = parseParamsCLI(
        minimist( process.argv.slice( 2 ) ) as Partial<CLI.Params>,
    );

    const scriptName = ( params._?.[ 0 ] ) as CLI.Command | undefined;

    return callback( {
        config: await getConfig( params ),
        params,
        scriptName,
    } );
}
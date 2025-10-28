#!/usr/bin/env node
/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import minimist from 'minimist';

import type * as CLI from '../types/CLI.js';

import { parseParamsCLI } from '../lib/01-config/parseParamsCLI.js';

import { Project } from '../lib/04-project/classes/Project.js';

import { getConfig } from './lib/getConfig.js';

process.on( 'uncaughtException', Project.uncaughtErrorListener );

const params = parseParamsCLI(
    minimist( process.argv.slice( 2 ) ) as Partial<CLI.Params>,
);

const scriptName = ( params._?.[ 0 ] ) as CLI.Command | undefined;

switch ( scriptName ) {

    case 'debug':
    case 'snapshot':
    case 'compile':
    case 'test':
    case 'document':
    case 'build':
    case 'package':
    case 'release':
        const project = new Project( await getConfig( params ), params );
        await project.run( scriptName );
        break;

    case 'help':
    default:
        const help = ( await import( './help.js' ) ).default;
        await help( params );
        break;
}

process.exit();
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

import type {
    CLI,
} from '../types/index.js';

import help from './help.js';

import {
    parseParamsCLI,
    Project,
} from '../lib/index.js';

import { getConfig } from './lib/index.js';


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
        await help( params );
        break;
}
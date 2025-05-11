#!/usr/bin/env node
/**
 * NPM Build Utilities (CLI)
 * 
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @author Maddi Mathon (www.maddimathon.com)
 * @homepage ___CURRENT_URL___
 * 
 * @license MIT
 * 
 * @since 1.1.0+tmpl
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import minimist from 'minimist';

import { NodeFunctions } from '@maddimathon/utility-typescript/classes/node';

// import { Project } from '../index.js';


type BinArgs = {
    _: string[];
};

const args: BinArgs = minimist( process.argv.slice( 2 ) );

const F = new NodeFunctions();


// const project = new Project();

const scriptName = args._[ 0 ] ?? '';

switch ( scriptName ) {

    default:
        F.nc.log( 'The cli for this package is not yet implemented.', { clr: 'purple' } );
        break;
}
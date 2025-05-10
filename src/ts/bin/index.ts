#!/usr/bin/env node
/**
 * NPM Library Template (Node CLI)
 * 
 * @package @maddimathon/template-npm-library@___CURRENT_VERSION___
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
 * @maddimathon/template-npm-library@___CURRENT_VERSION___
 * @license MIT
 */

import minimist from 'minimist';

import sayHello from './sayHello.js';


type BinArgs = {
    _: string[];
};

const args: BinArgs = minimist( process.argv.slice( 2 ) );


const scriptName = args._[ 0 ] ?? '';

switch ( scriptName ) {

    default:
        sayHello( args );
        break;
}
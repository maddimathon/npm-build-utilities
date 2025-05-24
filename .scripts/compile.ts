#!/usr/bin/env -S npx tsx
'use strict';
/**
 * @package @maddimathon/build-utilities@___CURRENT_VERSION___
 * @author Maddi Mathon (www.maddimathon.com)
 * @homepage ___CURRENT_URL___
 * 
 * @license MIT
 * 
 * @since ___PKG_VERSION___
 */

import minimist from 'minimist';

import { Compile } from './classes/Compile.js';


const args = minimist( process.argv.slice( 2 ) ) as Compile.Args;

const cmpl = new Compile( args );

await cmpl.run();
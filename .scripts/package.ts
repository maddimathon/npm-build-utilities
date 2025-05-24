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

import { Package } from './classes/Package.js';


const args = minimist( process.argv.slice( 2 ) ) as Package.Args;

const pkg = new Package( args );

await pkg.run();
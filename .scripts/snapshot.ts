#!/usr/bin/env -S npx tsx
'use strict';
/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @author Maddi Mathon (www.maddimathon.com)
 * @homepage ___CURRENT_URL___
 * 
 * @license MIT
 * 
 * @since ___PKG_VERSION___
 */

import minimist from 'minimist';

import { Snapshot } from './classes/Snapshot.js';


const args = minimist( process.argv.slice( 2 ) ) as Snapshot.Args;

const snap = new Snapshot( args );

await snap.run();
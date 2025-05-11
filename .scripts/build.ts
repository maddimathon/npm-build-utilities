#!/usr/bin/env tsx
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

import { Build } from './classes/Build.js';

const args = minimist( process.argv.slice( 2 ) ) as Build.Args;

const bld = new Build( args );

await bld.run();
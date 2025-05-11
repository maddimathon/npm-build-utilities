#!/usr/bin/env tsx
'use strict';
/**
 * @package @maddimathon/npm-build-utilities
 * @author Maddi Mathon (www.maddimathon.com)
 * 
 * @license MIT
 */

import minimist from 'minimist';

import { Release } from './classes/Release.js';

const args = minimist( process.argv.slice( 2 ) ) as Release.Args;

const rel = new Release( args );

await rel.run();
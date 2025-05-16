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

import { Document } from './classes/Document.js';


const args = minimist( process.argv.slice( 2 ) ) as Document.Args;

const doc = new Document( args );

await doc.run();
#!/usr/bin/env -S npx tsx
'use strict';
/**
 * Exports some utilities to use in scripts.
 * 
 * @package @maddimathon/npm-build-utilities
 * @since ___PKG_VERSION___
 */

import minimist from 'minimist';

export type * from './@types/utilities.d.ts';
export * from './classes/Functions.js';

import { Functions } from './classes/Functions.js';


const args = minimist( process.argv.slice( 2 ) ) as unknown as Functions.Opts;

export const F = new Functions( args );
#!/usr/bin/env tsx
'use strict';
/**
 * Exports some utilities to use in scripts.
 * 
 * @package @maddimathon/template-npm-library
 * @since ___PKG_VERSION___
 */

import minimist from 'minimist';

export type * from './@types/utilities.d.ts';
export * from './classes/Functions.js';

import { Functions } from './classes/Functions.js';


const args: Functions.Opts
    //@ts-expect-error
    = minimist( process.argv.slice( 2 ) ) as Functions.Opts;

export const F = new Functions( args );
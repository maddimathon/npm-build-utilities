#!/usr/bin/env node
/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type {
    CLI,
} from '../types/index.js';

import {
    parseParamsCLI,
    Project,
} from '../lib/index.js';

import {
    Stage_Console,
} from '../lib/@internal.js';

export default async function (
    _params?: Partial<CLI.Params>,
    level: number = 0,
    console?: Stage_Console,
) {
    const params: CLI.Params = parseParamsCLI( _params ?? {} );

    if ( !console ) {
        console = await Project.getConsole( { params } );
    }

    // UPGRADE finish me
    console.log( 'Hello!  I am the help function.  I am not yet useful, sorry.', level, { linesOut: 2 } );
    console.vi.debug( { params }, level, { bold: false, linesOut: 2 } );
};
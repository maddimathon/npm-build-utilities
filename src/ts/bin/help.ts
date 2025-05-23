#!/usr/bin/env node
/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type {
    CLI,
} from '../types/index.js';

import {
    parseParamsCLI,
    Project,
    Stage_Console,
} from '../lib/index.js';

export default async function (
    _params?: Partial<CLI.Params>,
    level: number = 0,
    console?: Stage_Console,
) {
    const params: CLI.Params = parseParamsCLI( _params ?? {} );

    if ( !console ) {
        console = await Project.getConsole( { params } );
    }

    // TODO finish me
    console.notice( 'Hello!  I am the help function.  I am not yet useful, sorry.', level, { linesOut: 2 } );
    params.debug && console.varDump.progress( { params }, level, { bold: false, linesOut: 2 } );
};
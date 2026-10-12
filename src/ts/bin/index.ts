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

import { Project } from '../lib/04-project/classes/Project.js';

import { runBuildScript } from './lib/index.js';

await runBuildScript(
    async ( { config, params, scriptName } ) => {

        switch ( scriptName ) {

            case 'debug':
            case 'snapshot':
            case 'compile':
            case 'test':
            case 'document':
            case 'build':
            case 'package':
            case 'release':
                const project = new Project( config, params );
                return project.run( scriptName );
        }

        const help = ( await import( './help.js' ) ).default;
        return help( params );
    }
);

process.exit();
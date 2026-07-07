#!/usr/bin/env node
'use strict';
/*
 * @package @maddimathon/build-utilities
 * @author Maddi Mathon (https://www.maddimathon.com/web)
 *
 * @license MIT
 */

import type { Stage } from '../../src/ts/index.js';

import { TestStage } from '../../src/ts/index.js';

/**
 * Extension of the built-in one.
 */
export class Test extends TestStage {

    public override readonly subStages: Stage.SubStage.Test[] = [
        'js',
        'demos' as Stage.SubStage.Test,
    ];

    /**
     * Prompts the user to test build the demo dirs.
     */
    protected async demos() {
        // returns
        if ( !this.params.packaging && !this.params.dryrun ) {
            return;
        }

        const _testCmd = 'npm i && npm run --silent dryrun';

        this.console.log( [
            [ 'testing built package in demo directories...' ],
            [ 'to test, run `' + _testCmd + '` in each directory', {
                bold: false,
                clr: 'grey',
                italic: true,
            } ],
        ], 1, {
            linesOut: 1,
            joiner: '\n',
        } );

        const demos = this.fs.glob( 'demos/*' );

        for ( const path of demos ) {
            // continues
            if ( !this.fs.isDirectory( path ) ) {
                continue;
            }

            const demoName = this.fs.pathRelative( path ).replace( /^demos\//i, '' );

            // exits on false
            if ( !( await this.console.prompt.bool(
                'Does the ' + demoName + ' demo (`cd demos/' + demoName + ' && ' + _testCmd + '`) compile as expected and without error?',
                2,
                {
                    default: false,

                    msgArgs: {
                        bold: false,
                        linesIn: 0,
                        linesOut: 0,
                    },

                    timeout: 300000,
                },
            ) ) ) {
                this.console.log( [
                    [ `ⅹ ` ],
                    [ `${ demoName } demo failed - exiting...`, { italic: true } ],
                ], 3, {
                    bold: false,
                    italic: false,
                    joiner: '',
                    linesIn: 0,
                    linesOut: 1,
                } );
                process.exit( 0 );
            }
        }
    }
}

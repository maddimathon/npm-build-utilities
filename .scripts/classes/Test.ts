#!/usr/bin/env tsx
'use strict';
/**
 * @package @maddimathon/npm-build-utilities
 * @author Maddi Mathon (www.maddimathon.com)
 * 
 * @license MIT
 */
// import * as utils from '@maddimathon/utility-typescript';

import { AbstractStage } from './abstracts/AbstractStage.js';


const testSubStages = [
    'js',
    'scss',
] as const;


export class Test extends AbstractStage<Test.Stages, Test.Args> {



    /* LOCAL PROPERTIES
     * ====================================================================== */

    public readonly subStages = testSubStages;

    public get ARGS_DEFAULT() {

        return {
            ...AbstractStage.ARGS_ABSTRACT,
        } as Test.Args;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    constructor ( args: Test.Args ) {
        super( args, 'red' );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    protected async runStage( stage: Test.Stages ) {
        await this[ stage ]();
    }

    public async startEndNotice( which: "start" | "end" ): Promise<void> {

        this.startEndNoticeLog(
            which,
            `TEST ${ which.toUpperCase() }ING`,
            `TEST FINISHED`,
            `${ which.toUpperCase() }ING TEST`,
        );
    }



    /* STAGE METHODS
     * ====================================================================== */

    protected async js() {
        this.progressLog( 'running jest...', 1 );

        this.fns.nc.cmd( 'node --experimental-vm-modules --no-warnings node_modules/jest/bin/jest.js' );

        if ( this.args.packaging && !this.args.dryrun ) {

            this.verboseLog( 'removing test files from dist...', 2 );
            this.fns.fs.deleteFiles( this.glob( [
                'dist/**/*.test.d.ts',
                'dist/**/*.test.d.ts.map',
                'dist/**/*.test.js',
                'dist/**/*.test.js.map',
            ] ) );
        }
    }

    protected async scss() {
        this.progressLog( '(NOT IMPLEMENTED) testing scss...', 1 );
    }
}


export namespace Test {

    export type Args = AbstractStage.Args<Test.Stages> & {
    };

    export type Stages = typeof testSubStages[ number ];
}
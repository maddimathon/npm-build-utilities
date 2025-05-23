#!/usr/bin/env -S npx tsx
'use strict';
/**
 * @package @maddimathon/npm-build-utilities
 * @author Maddi Mathon (www.maddimathon.com)
 * 
 * @license MIT
 */

import { AbstractStage } from './abstracts/AbstractStage.js';


const compileSubStages = [
    'js',
    'css',
    'files',
] as const;


export class Compile extends AbstractStage<Compile.Stages, Compile.Args> {



    /* LOCAL PROPERTIES
     * ====================================================================== */

    public readonly subStages = compileSubStages;

    public get ARGS_DEFAULT() {

        return {
            ...AbstractStage.ARGS_ABSTRACT,
        } as Compile.Args;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    constructor ( args: Compile.Args ) {
        super( 'compile', args, 'green' );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    protected async runSubStage( stage: Compile.Stages ) {
        await this[ stage ]();
    }

    public async startEndNotice( which: "start" | "end" ): Promise<void> {

        const emoji = which == 'end' ? '✅' : '🚨';

        if ( !this.args.building && (
            this.args.watchedWatcher
            || this.args.watchedFilename
            || this.args.watchedEvent
        ) ) {
            this.progressLog( `${ emoji } [watch-change-${ which }] file ${ this.args.watchedEvent }: ${ this.args.watchedFilename }`, 0 );
        } else {

            this.startEndNoticeLog(
                which,
                `COMPILE ${ which.toUpperCase() }ING`,
                `COMPILE FINISHED`,
                `${ which.toUpperCase() }ING COMPILE`,
            );
        }
    }



    /* STAGE METHODS
     * ====================================================================== */

    protected async css() {
        this.progressLog( '(NOT IMPLEMENTED) compiling scss...', 1 );
    }

    protected async files() {
        this.progressLog( 'copying misc. files...', 1 );

        const srcPaths: string[] = [
        ];

        const rootPaths: string[] = [
        ];

        rootPaths.length && this.copyFiles( rootPaths, 'dist' );
        srcPaths.length && this.copyFiles( srcPaths, 'dist', 'src' );
    }

    protected async js() {
        this.progressLog( 'compiling typescript files...', 1 );

        const typescriptFiles = [
            'src/ts/tsconfig.json',
        ];

        for ( const path of typescriptFiles ) {
            await this.compileTypescript( path, 2 );
        }

        // if ( !this.args.watchedEvent ) {

        //     this.verboseLog( 'deleting type-only javascript files...', 2 );
        //     this.fns.fs.deleteFiles( this.glob( [
        //         'dist/types/**/*.js',
        //         'dist/types/**/*.js.map',
        //         'dist/types/**/*.test.d.ts',
        //         'dist/types/**/*.test.d.ts.map',
        //     ] ) );
        // }
    }
}

export namespace Compile {

    export type Args = AbstractStage.Args<Compile.Stages> & {
    };

    export type Stages = typeof compileSubStages[ number ];
}
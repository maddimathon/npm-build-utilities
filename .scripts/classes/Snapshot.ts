#!/usr/bin/env -S npx tsx
'use strict';
/**
 * @package @maddimathon/build-utilities
 * @author Maddi Mathon (www.maddimathon.com)
 * 
 * @license MIT
 */
// import * as utils from '@maddimathon/utility-typescript';

import { AbstractStage } from './abstracts/AbstractStage.js';


const snapshotSubStages = [
    'snapshot',
] as const;


export class Snapshot extends AbstractStage<Snapshot.Stages, Snapshot.Args> {



    /* LOCAL PROPERTIES
     * ====================================================================== */

    public readonly subStages = snapshotSubStages;

    public get ARGS_DEFAULT() {

        return {
            ...AbstractStage.ARGS_ABSTRACT,
        } as Snapshot.Args;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    constructor ( args: Snapshot.Args ) {
        super( 'snapshot', args, 'pink' );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    protected async runSubStage( stage: Snapshot.Stages ) {
        await this[ stage ]();
    }

    public async startEndNotice( which: "start" | "end" ): Promise<void> {

        this.startEndNoticeLog(
            which,
            `SNAPSHOT ${ which.toUpperCase() }ING`,
            `SNAPSHOT FINISHED`,
            `${ which.toUpperCase() }ING SNAPSHOT`,
        );
    }



    /* STAGE METHODS
     * ====================================================================== */

    protected async snapshot() {
        this.console.verbose( 'getting included paths...', 1 );

        const snapdir = this.pkg.config.paths.snapshots.replace( /\/+$/gi, '' );

        const exportPath: string = this.fns.fs.uniquePath( `${ snapdir }/${ this.pkg.name.replace( /^@([^\/]+)\//, '$1_' ) }_${ this.pkgVersion }_${ this.datetimestamp( null, 'yyyyMMdd-HHmm' ) }` );
        const exportName: string = exportPath.replace( /^\/?([^\/]+\/)*/gi, '' );


        const includePaths: string[] = this.glob(
            [ '**/*', ],
            {
                filesOnly: true,
                ignore: [
                    '.git/**/*',
                    `${ snapdir }/**/*`,
                    '@releases/**/*',
                    'node_modules/**/*',

                    '**/._*',
                    '**/._**/*',
                    '**/.DS_Store',
                    '**/.smbdelete**',
                ],
            },
            true
        );
        this.args.debug && this.console.vi.log( { includePaths }, ( this.args.verbose ? 2 : 1 ) );

        this.console.verbose( 'copying files...', 1 );
        this.copyFiles( includePaths, exportPath );


        this.console.verbose( 'zipping snapshot...', 1 );
        this.try(
            this.console.nc.cmd,
            2,
            [ `cd ${ snapdir }/ && zip -r ${ exportName }.zip ${ exportName }` ]
        );


        this.console.verbose( 'tidying up...', 1 );
        this.fns.fs.deleteFiles( [ exportPath ] );


        this.console.progress( `snapshot zipped: ${ this.fns.fs.pathRelative( exportPath ) }.zip`, 1, { maxWidth: null } );
    }
}


export namespace Snapshot {

    export type Args = AbstractStage.Args<Snapshot.Stages> & {
    };

    export type Stages = typeof snapshotSubStages[ number ];
}
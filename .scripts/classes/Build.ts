#!/usr/bin/env tsx
'use strict';
/**
 * @package @maddimathon/npm-build-utilities
 * @author Maddi Mathon (www.maddimathon.com)
 * 
 * @license MIT
 */

import * as utils from '@maddimathon/utility-typescript';

import { AbstractStage } from './abstracts/AbstractStage.js';

import { Compile } from './Compile.js';
import { Document } from './Document.js';
import { Test } from './Test.js';

import {
    currentReplacements,
    pkgReplacements,
} from '../vars/replacements.js';
import { softWrapText } from '@maddimathon/utility-typescript/functions';


const buildSubStages = [
    'compile',
    'minimize',
    'replace',
    'prettify',
    'test',
    'document',
] as const;


export class Build extends AbstractStage<Build.Stages, Build.Args> {



    /* LOCAL PROPERTIES
     * ====================================================================== */

    public readonly subStages = buildSubStages;

    public get ARGS_DEFAULT() {

        return {
            ...AbstractStage.ARGS_ABSTRACT,
            building: true,
        } as Build.Args;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    constructor ( args: Build.Args ) {
        super( args, 'blue' );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    protected async runStage( stage: Build.Stages ) {
        await this[ stage ]();
    }

    public async startEndNotice( which: "start" | "end" ): Promise<void> {

        this.startEndNoticeLog(
            which,
            `BUILD ${ which.toUpperCase() }ING`,
            `BUILD FINISHED`,
            `${ which.toUpperCase() }ING BUILD`,
        );
    }



    /* STAGE METHODS
     * ====================================================================== */

    protected async compile() {

        const cmpl = new Compile( {
            ...this.args as Compile.Args,

            'log-base-level': 1 + ( this.args[ 'log-base-level' ] ?? 0 ),

            only: this.args[ 'only-compile' ],
            without: this.args[ 'without-compile' ],
        } );

        await cmpl.run();
    }

    protected async document() {

        const doc = new Document( {
            ...this.args as Document.Args,

            'log-base-level': 1 + ( this.args[ 'log-base-level' ] ?? 0 ),

            only: this.args[ 'only-document' ],
            without: this.args[ 'without-document' ],
        } );

        await doc.run();
    }

    protected async minimize() {
        this.progressLog( 'minifying files...', 1 );

        this.verboseLog( '(NOT IMPLEMENTED) minifying javascript...', 2 );

        this.verboseLog( '(NOT IMPLEMENTED) minifying css...', 2 );
    }

    protected async prettify() {
        this.progressLog( '(NOT IMPLEMENTED) prettifying files...', 1 );
    }

    protected async replace() {
        this.progressLog( 'replacing placeholders...', 1 );


        this.verboseLog( 'replacing in dist...', 2 );
        for ( const o of currentReplacements( this ).concat( pkgReplacements( this ) ) ) {
            this.replaceInFiles(
                [
                    './dist/**/*',
                ],
                o.find,
                o.replace,
                this.args.verbose ? 3 : 2,
            );
        }


        this.verboseLog( 'replacing in README...', 2 );

        const headerRegex = /(<!--README_HEADER-->).*?(<!--\/README_HEADER-->)/gs;

        const descRegex = /(<!--README_DESC-->).*?(<!--\/README_DESC-->)/gs;

        const ctaRegex = /(<!--README_DOCS_CTA-->).*?(<!--\/README_DOCS_CTA-->)/gs;

        this.fns.fs.writeFile( 'README.md', (
            this.fns.fs.readFile( 'README.md' )
                .replace( headerRegex, '$1\n' + utils.functions.escRegExpReplace( `# ${ this.pkg.config.title } @ ${ this.pkgVersion }` ) + '\n$2' )
                .replace( descRegex, '$1\n' + utils.functions.escRegExpReplace( softWrapText( this.pkg.description, 80 ) ) + '\n$2' )
                .replace( ctaRegex, '$1\n' + utils.functions.escRegExpReplace( `<a href="${ this.pkg.homepage }" class="button">Read Documentation</a>` ) + '\n$2' )
        ), { force: true } );

        if ( this.args.releasing ) {

            const installRegex = /(<!--README_INSTALL-->).*?(<!--\/README_INSTALL-->)/gs;

            this.fns.fs.writeFile( 'README.md', (
                this.fns.fs.readFile( 'README.md' )
                    .replace( installRegex, '$1\n' + utils.functions.escRegExpReplace( [
                        '```bash',
                        'npm i -D @maddimathon/npm-build-utilities@' + this.pkg.version,
                        'npm i -D github:maddimathon/npm-build-utilities#' + this.pkg.version,
                        '```',
                    ].join( '\n' ) ) + '\n$2' )
            ), { force: true } );
        }
    }

    protected async test() {

        const t = new Test( {
            ...this.args as Test.Args,

            'log-base-level': 1 + ( this.args[ 'log-base-level' ] ?? 0 ),

            only: this.args[ 'only-test' ],
            without: this.args[ 'without-test' ],
        } );

        await t.run();
    }
}


export namespace Build {

    export type Args = AbstractStage.Args<Build.Stages> & {

        'only-compile'?: Compile.Stages | Compile.Stages[];
        'only-document'?: Document.Stages | Document.Stages[];
        'only-test'?: Test.Stages | Test.Stages[];

        'without-compile'?: Compile.Stages | Compile.Stages[];
        'without-document'?: Document.Stages | Document.Stages[];
        'without-test'?: Test.Stages | Test.Stages[];
    };

    export type Stages = typeof buildSubStages[ number ];
}
#!/usr/bin/env node
'use strict';
/**
 * @package @maddimathon/build-utilities
 * @author Maddi Mathon (www.maddimathon.com)
*
* @license MIT
*/

import {
    escRegExpReplace,
    softWrapText,
} from '@maddimathon/utility-typescript/functions';

import type {
    AbstractStage,

    Stage,
} from "../../src/ts/index.js";

import {
    BuildStage,
} from '../../src/ts/index.js';

// import type {
// } from "../../src/ts/lib/@internal.js";

// import {
// } from '../../src/ts/lib/@internal.js';

/**
 * Extension of the built-in one.
 */
export class Build extends BuildStage implements AbstractStage<
    Build.SubStage,
    Build.Args
> {

    public override readonly subStages = [
        'compile',
        'replace',
        'readme',
        'prettify',
        'minimize',
        'test',
        'document',
    ] as Stage.SubStage.Build[];



    public override get ARGS_DEFAULT() {

        return {
            ...super.ARGS_DEFAULT,
        } as const satisfies Build.Args;
    }



    protected async readme() {
        this.console.progress( 'replacing readme placeholders...', 1 );

        const headerRegex = /(<!--README_HEADER-->).*?(<!--\/README_HEADER-->)/gs;

        let readmeContent = this.fs.readFile( 'README.md' )
            .replace( headerRegex, '$1\n' + escRegExpReplace( `# ${ this.config.title } @ ${ this.version.toString( this.isDraftVersion ) }` ) + '\n$2' );


        // READ DOCS
        readmeContent = readmeContent.replace(
            /(<!--README_DOCS_CTA-->).*?(<!--\/README_DOCS_CTA-->)/gs,
            '$1\n' + (
                this.pkg.homepage
                    ? escRegExpReplace( `<a href="${ this.pkg.homepage }" class="button">Read Documentation</a>` )
                    : ''
            ) + '\n$2'
        );


        // DESCRIPTION
        readmeContent = readmeContent.replace(
            /(<!--README_DESC-->).*?(<!--\/README_DESC-->)/gs,
            '$1\n' + (
                this.pkg.description
                    ? escRegExpReplace( softWrapText( this.pkg.description, 80 ) )
                    : ''
            ) + '\n$2'
        );


        /** Markdown links to read the changelog. */
        const changelogLinks = [];

        if ( this.pkg.repository ) {

            const _gitURL = typeof this.pkg.repository === 'string'
                ? this.pkg.repository
                : this.pkg.repository.url;

            changelogLinks.push( `[the source](${ _gitURL.replace( /(\/+|\.git)$/gi, '' ) }/blob/main/CHANGELOG.md)` );
        }

        if ( this.pkg.homepage ) {
            changelogLinks.push( `[the docs site](${ this.pkg.homepage }/Changelog.html)` );
        }


        // CHANGELOG LINKS
        readmeContent = readmeContent.replace(
            /(<!--README_DOCS_CHANGELOG-->).*?(<!--\/README_DOCS_CHANGELOG-->)/gs,
            '$1\n' + (
                changelogLinks.length
                    ? escRegExpReplace( `Read it from ${ changelogLinks.join( ' \nor \n' ) }.` )
                    : ''
            ) + '\n$2'
        );


        if ( this.params.releasing ) {

            readmeContent = readmeContent.replace(
                /(<!--README_INSTALL-->).*?(<!--\/README_INSTALL-->)/gs,
                '$1\n' + escRegExpReplace( [
                    '```sh',
                    'npm i -D @maddimathon/build-utilities@' + this.pkg.version,
                    'npm i -D github:maddimathon/build-utilities#' + this.pkg.version,
                    '```',
                ].join( '\n' ) ) + '\n$2'
            );
        }


        this.fs.write( 'README.md', readmeContent, { force: true } );
    }
}

export namespace Build {

    export interface Args extends Stage.Args.Build {
    }

    export type SubStage = Stage.SubStage.Build | "readme";
}
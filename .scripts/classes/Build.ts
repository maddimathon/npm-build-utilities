#!/usr/bin/env node
'use strict';
/*
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
    Build.Args,
    Build.SubStage
> {

    public override readonly subStages = [
        'compile',
        'tscheck',
        'replace',
        'readme',
        'prettify',
        'minimize',
        'test',
        'document',
        'demos',
    ] as Stage.SubStage.Build[];


    protected async demos() {
        this.console.progress( 'updating demo files...', 1 );


        this.console.verbose( 'deleting compiled files...', 2 );

        const deleteGlobs = [

            'demos/complete/.snapshots',
            'demos/complete/@releases',
            'demos/complete/dist',

            'demos/no-config/.scripts',
            'demos/no-config/.snapshots',
            'demos/no-config/@releases',
            'demos/no-config/dist',
            'demos/no-config/src',
            'demos/no-config/.releasenotes.md',
            'demos/no-config/build-utils.config.js',
            'demos/no-config/CHANGELOG.md',
            'demos/no-config/tsconfig.json',
        ];

        if ( this.params.releasing ) {
            deleteGlobs.push( 'demos/complete/node_modules' );
            deleteGlobs.push( 'demos/no-config/node_modules' );
            deleteGlobs.push( 'demos/complete/package-lock.json' );
            deleteGlobs.push( 'demos/no-config/package-lock.json' );
        }

        this.fs.delete( deleteGlobs, this.params.verbose ? 3 : 2 );


        this.console.verbose( 'copying files to demos/complete...', 2 );
        this.fs.copy(
            [
                'src/**/.*',
                'src/**/*',
            ],
            this.params.verbose ? 3 : 2,
            'demos/complete',
            'src/demos',
            { force: true }
        );
        this.fs.write(
            'demos/complete/src/ts/tsconfig.json',
            JSON.stringify( {
                extends: '@maddimathon/build-utilities/tsconfig',
                include: [
                    '../../src/ts/**/*',
                    './src/ts/**/*',
                ],
                compilerOptions: {
                    baseUrl: '../../',
                    noEmit: false,
                    outDir: '../../dist/js',
                }
            }, null, 4 ),
            { force: true }
        );


        this.console.verbose( 'copying files to demos/no-config...', 2 );
        this.fs.copy(
            [
                'src/**/.*',
                'src/**/*',
            ],
            this.params.verbose ? 3 : 2,
            'demos/no-config',
            'src/demos',
        );


        this.console.verbose( 'updating version numbers...', 2 );
        for ( const _path of [
            'demos/complete/package.json',
            'demos/no-config/package.json',
        ] ) {
            const _currentPkgJson = this.fs.readFile( _path );

            let _replaced = _currentPkgJson;

            _replaced = _replaced.replace(
                /"version":\s*"[^"]*"/gi,
                escRegExpReplace( `"version": "${ this.version.toString( false ) }"` )
            );

            if ( this.params.releasing ) {

                if ( this.version.prerelease ) {

                    // update to the version being release for testing
                    _replaced = _replaced.replace(
                        /"@maddimathon\/build-utilities":\s*"[^"]*"/gi,
                        escRegExpReplace( `"@maddimathon/build-utilities": "${ this.version.toString( false ) }"` )
                    );
                } else {

                    // update to be a file path for development
                    _replaced = _replaced.replace(
                        /"@maddimathon\/build-utilities":\s*"[^"]*"/gi,
                        escRegExpReplace( `"@maddimathon/build-utilities": "file:../.."` )
                    );
                }
            }

            this.fs.write(
                _path,
                _replaced,
                { force: true },
            );
        }
    }

    protected async tscheck() {
        this.console.progress( 'checking non-emitted typescript...', 1 );

        const tsPaths = [
            'src/docs/tsconfig.json',
        ];

        await Promise.all( tsPaths.map(
            tsc => {
                this.console.verbose( 'checking project: ' + tsc, 2 );
                return this.compiler.typescript( tsc, ( this.params.verbose ? 3 : 2 ) );
            }
        ) );
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

            const _gitURL = this.pkg.repository;

            changelogLinks.push( `[the source](${ _gitURL.replace( /(\/+|\.git)$/gi, '' ) }/blob/main/CHANGELOG.md)` );
        }

        if ( this.pkg.homepage ) {
            changelogLinks.push( `[the docs site](${ this.pkg.homepage }/About/Changelog.html)` );
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
                    '```bash',
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

    export type SubStage = Stage.SubStage.Build | "demos" | "readme" | "tscheck";
}
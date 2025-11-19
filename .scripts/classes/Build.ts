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

import type { Stage } from '../../src/ts/index.js';

import { BuildStage } from '../../src/ts/index.js';

// import type {
// } from "../../src/ts/lib/@internal.js";

// import {
// } from '../../src/ts/lib/@internal.js';

/**
 * Extension of the built-in one.
 */
export class Build extends BuildStage {

    public override readonly subStages: Stage.SubStage.Build[] = [
        'compile',
        'tscheck' as Stage.SubStage.Build,
        'replace',
        'readme' as Stage.SubStage.Build,
        'prettify',
        'minimize',
        'demos' as Stage.SubStage.Build,
        'test',
        'document',
        'tidy' as Stage.SubStage.Build,
    ];

    protected demo_deleteGlobs() {

        const deleteGlobs = [
            'demos/*/.snapshots/',
            'demos/*/@releases/',
            'demos/*/dist/',
            'demos/*/node_modules/',
            'demos/*/src/',
            'demos/*/.releasenotes.md',
            'demos/*/package-lock.json',

            '**/demos/no-config/.scripts/',
            '**/demos/no-config/build-utils.config.js',
            '**/demos/no-config/CHANGELOG.md',
            '**/demos/no-config/jest.config.js',
            '**/demos/no-config/tsconfig.json',
        ];

        return deleteGlobs;
    }

    protected async demos() {
        this.console.progress( 'updating demo files...', 1 );


        this.console.verbose( 'deleting existing compiled demo files...', 2 );

        const deleteGlobs = this.demo_deleteGlobs();

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
                },
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
    }

    protected async tidy() {
        this.console.progress( 'tidying built files...', 1 );


        this.console.verbose( 'deleting existing compiled demo files...', 2 );

        this.fs.delete( this.demo_deleteGlobs(), this.params.verbose ? 3 : 2 );


        this.console.verbose( 'updating demo version numbers...', 2 );

        for ( const _path of this.fs.glob( 'demos/*/package.json' ) ) {
            const _currentPkgJson = this.fs.readFile( _path );

            let _replaced = _currentPkgJson;

            _replaced = _replaced.replace(
                /"version":\s*"[^"]*"/gi,
                escRegExpReplace( `"version": "${ this.version.toString( false ) }"` )
            );

            if ( this.params.releasing && !this.params.dryrun ) {

                // update to the version being release for testing
                _replaced = _replaced.replace(
                    /"@maddimathon\/build-utilities":\s*"[^"]*"/gi,
                    escRegExpReplace( `"@maddimathon/build-utilities": "${ this.version.toString( false ) }"` ),
                );
            } else {

                // update to be a file path for development
                _replaced = _replaced.replace(
                    /"@maddimathon\/build-utilities":\s*"[^"]*"/gi,
                    escRegExpReplace( `"@maddimathon/build-utilities": "file:../.."` ),
                );
            }

            this.fs.write( _path, _replaced, { force: true } );
        }
    }

    protected async tscheck() {
        this.console.progress( 'checking non-emitted typescript...', 1 );

        const tsPaths = [
            'src/docs/tsconfig.json',
        ];

        return Promise.all( tsPaths.map(
            ( tsc ) => {
                this.console.verbose( 'checking project: ' + tsc, 2 );
                return this.compiler.typescript( tsc, this.params.verbose ? 3 : 2 );
            }
        ) );
    }

    protected async readme() {
        this.console.progress( 'replacing readme placeholders...', 1 );

        const headerRegex = /(<!--README_HEADER-->).*?(<!--\/README_HEADER-->)/gs;

        let readmeContent = this.fs.readFile( 'README.md' )
            .replace(
                headerRegex,
                '$1\n' + escRegExpReplace( `# ${ this.config.title } @ ${ this.version.toString( this.isDraftVersion ) }` ) + '\n$2',
            );

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

#!/usr/bin/env tsx
'use strict';
/**
 * @package @maddimathon/npm-build-utilities
 * @author Maddi Mathon (www.maddimathon.com)
 * 
 * @license MIT
 */
// import * as utils from '@maddimathon/utility-typescript';

import * as typeDoc from "typedoc";

import { AbstractStage } from './abstracts/AbstractStage.js';

import {
    currentReplacements,
    pkgReplacements,
} from '../vars/replacements.js';


const documentSubStages = [
    'ts',
    'replace',
] as const;


export class Document extends AbstractStage<Document.Stages, Document.Args> {



    /* LOCAL PROPERTIES
     * ====================================================================== */

    public readonly subStages = documentSubStages;

    public get ARGS_DEFAULT() {

        return {
            ...AbstractStage.ARGS_ABSTRACT,
        } as Document.Args;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    constructor ( args: Document.Args ) {
        super( args, 'turquoise' );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    protected async runStage( stage: Document.Stages ) {
        await this[ stage ]();
    }

    public async startEndNotice( which: "start" | "end" ): Promise<void> {

        this.startEndNoticeLog(
            which,
            `DOCUMENTATION ${ which.toUpperCase() }ING`,
            `DOCUMENTATION FINISHED`,
            `${ which.toUpperCase() }ING DOCUMENTATION`,
        );
    }



    /* STAGE METHODS
     * ====================================================================== */

    protected async replace() {
        this.progressLog( 'replacing placeholders...', 1 );

        for ( const o of currentReplacements( this ).concat( pkgReplacements( this ) ) ) {
            this.replaceInFiles(
                [
                    './docs/**/*',
                ],
                o.find,
                o.replace,
                2,
            );
        }
    }

    protected async ts() {
        this.progressLog( 'documenting typescript...', 1 );

        /** URL to documentation, without trailing slash. */
        const homepage = this.pkg.homepage.replace( /\/+$/gi, '' );

        /** URL to repository, without trailing slash or `.git`. */
        const repository = this.pkg.repository.url.replace( /(\/+|\.git)$/gi, '' );

        // TODO - generate entryPoints from pkg.main and pkg.exports
        const config: Partial<typeDoc.TypeDocOptions> = {

            tsconfig: 'src/ts/tsconfig.json',

            basePath: 'src/ts',

            blockTags: [
                ...typeDoc.OptionDefaults.blockTags,

                '@homepage',
                '@package',
                '@source',
            ],

            // categorizeByGroup: true,

            categoryOrder: [
                '*',
                // 'Functions',
                // 'Classes',
                // 'Namespaces',
                // 'Modules',
                // 'Entry Points',
                'Misc.',
            ],

            // compilerOptions,

            customFooterHtml: `<p>Copyright <a href="https://www.maddimathon.com" target="_blank">Maddi Mathon</a>, 2025. <a href="${ homepage }/MIT_License.html">MIT license</a>.</p><p>Site generated using <a href="https://typedoc.org/" target="_blank">TypeDoc</a>.</p>`,
            customFooterHtmlDisableWrapper: true,

            defaultCategory: 'Misc.',

            disableGit: false,
            disableSources: false,

            entryPoints: [
                'src/ts/index.ts',
            ],

            excludeInternal: false,
            excludeNotDocumented: false,
            excludePrivate: false,
            excludeProtected: false,
            excludeReferences: false,

            githubPages: true,

            // groupOrder: [
            //     '*',
            //     'Functions',
            //     'Classes',
            //     'Namespaces',
            //     'Modules',
            // ],
            // groupReferencesByType: true,

            headings: {
                readme: false,
            },
            hideGenerator: true,
            hostedBaseUrl: homepage,

            includeHierarchySummary: true,
            includeVersion: false,

            markdownLinkExternal: true,

            name: [
                this.pkg.config.title,
                this.pkgVersion,
            ].filter( v => v ).join( ' @ ' ),

            // navigation: {
            //     includeCategories: true,
            //     includeGroups: false,
            //     includeFolders: true,
            //     compactFolders: false,
            //     excludeReferences: true,
            // },

            navigationLinks: {
                'About': `${ homepage }/ReadMe.html`,
                'GitHub': repository,
                'by Maddi Mathon': 'https://www.maddimathon.com',
            },

            out: 'docs',
            plugin: [
                'typedoc-plugin-inline-sources',
            ],

            projectDocuments: [
                'README.md',
                'src/docs/*.md',
                // 'CHANGELOG.md',
                // 'LICENSE.md',
            ],

            readme: 'none',
            router: 'structure',

            searchInComments: true,
            searchInDocuments: true,

            // sidebarLinks: {
            //     // 'Class Hierarchy': `${ homepage }/hierarchy.html`,
            // },

            sourceLinkTemplate: `${ repository }/blob/main/${ ( this.args.packaging && !this.args.dryrun ) ? this.pkg.version + '/' : '' }{path}#L{line}`,

            sort: [
                'documents-first',
                'static-first',
                'kind',
                'visibility',
                'alphabetical',
            ],
            sortEntryPoints: false,

            useFirstParagraphOfCommentAsSummary: true,

            visibilityFilters: {
                '@alpha': false,
                '@beta': true,
                external: true,
                inherited: true,
                private: false,
                protected: true,
            },
        };

        if ( config.out ) {
            this.verboseLog( 'deleting existing files...', 2 );

            const outDir = config.out.replace( /\/+$/gi, '' );

            this.fns.fs.deleteFiles( this.glob( [
                outDir + '/*',
                outDir + '/.*',
            ] ) );
        }

        if ( config.json ) {
            if ( !config.out ) {
                this.verboseLog( 'deleting existing files...', 2 );
            }
            this.fns.fs.deleteFiles( [ config.json ] );
        }

        this.verboseLog( 'running typedoc...', 2 );
        this.args.debug && this.fns.nc.varDump( { 'TypeDoc config': config }, {
            clr: this.clr,
            depth: ( this.args.verbose ? 3 : 2 ) + ( this.args[ 'log-base-level' ] ?? 0 ),
        } );
        const app: typeDoc.Application = await typeDoc.Application.bootstrapWithPlugins( config );

        // May be undefined if errors are encountered.
        const project: typeDoc.Models.ProjectReflection | undefined = await app.convert();

        // returns
        if ( !project ) {
            this.verboseLog( 'typedoc failed', 3 );
            return;
        }

        await app.generateOutputs( project );
    }
}


export namespace Document {

    export type Args = AbstractStage.Args<Document.Stages> & {
    };

    export type Stages = typeof documentSubStages[ number ];
}
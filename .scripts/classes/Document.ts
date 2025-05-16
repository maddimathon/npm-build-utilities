#!/usr/bin/env -S npx tsx
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

    protected async runSubStage( stage: Document.Stages ) {
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

            // alwaysCreateEntryPointModule: true,

            basePath: 'src/ts',

            blockTags: [
                ...typeDoc.OptionDefaults.blockTags,

                '@homepage',
                '@package',
                '@source',
            ],

            categorizeByGroup: true,

            categoryOrder: [
                '*',
                // 'Functions',
                // 'Classes',
                // 'Namespaces',
                // 'Modules',
                // 'Entry Points',
                'Other',
                'Misc.',
            ],

            customFooterHtml: `<p>Copyright <a href="https://www.maddimathon.com" target="_blank">Maddi Mathon</a>, 2025. <a href="${ homepage }/MIT_License.html">MIT license</a>.</p><p>Site generated using <a href="https://typedoc.org/" target="_blank">TypeDoc</a>.</p>`,
            customFooterHtmlDisableWrapper: true,

            // defaultCategory: 'Misc.',

            disableGit: false,
            disableSources: false,

            entryPoints: [
                'src/ts/index.ts',
            ],

            // entryPointStrategy: 'expand',

            excludeInternal: false,
            excludeNotDocumented: false,
            excludePrivate: false,
            excludeProtected: false,
            excludeReferences: false,

            externalSymbolLinkMappings: {

                '@maddimathon/utility-typescript': {
                    'mergeArgs': 'https://maddimathon.github.io/utility-typescript/functions/mergeArgs.html',

                    'node': 'https://maddimathon.github.io/utility-typescript/classes/node.html',
                    'NodeConsole': 'https://maddimathon.github.io/utility-typescript/classes/node/NodeConsole.html',
                    'node.NodeConsole': 'https://maddimathon.github.io/utility-typescript/classes/node/NodeConsole.html',
                    'NodeFiles': 'https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles-1.html',
                    'node.NodeFiles': 'https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles-1.html',
                    'NodeFiles.Args': 'https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/Args.html',
                    'node.NodeFiles.Args': 'https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/Args.html',

                    'MessageMaker': 'https://maddimathon.github.io/utility-typescript/classes/MessageMaker.html',
                    'MessageMaker.Colour': 'https://maddimathon.github.io/utility-typescript/classes/MessageMaker/Colour.html',
                    'VariableInspector': 'https://maddimathon.github.io/utility-typescript/classes/VariableInspector.html',

                    'Node': 'https://maddimathon.github.io/utility-typescript/Types/Node.html',
                    'PackageJson': 'https://maddimathon.github.io/utility-typescript/Types/Node/PackageJson.html',
                    'Node.PackageJson': 'https://maddimathon.github.io/utility-typescript/Types/Node/PackageJson.html',

                    'Objects': 'https://maddimathon.github.io/utility-typescript/Types/Objects.html',
                    'Classify': 'https://maddimathon.github.io/utility-typescript/Types/Objects/Classify.html',
                    'Objects.Classify': 'https://maddimathon.github.io/utility-typescript/Types/Objects/Classify.html',
                    'RecursivePartial': 'https://maddimathon.github.io/utility-typescript/Types/Objects/RecursivePartial.html',
                    'Objects.RecursivePartial': 'https://maddimathon.github.io/utility-typescript/Types/Objects/RecursivePartial.html',
                    'RecursiveRequired': 'https://maddimathon.github.io/utility-typescript/Types/Objects/RecursiveRequired.html',
                    'Objects.RecursiveRequired': 'https://maddimathon.github.io/utility-typescript/Types/Objects/RecursiveRequired.html',
                },
            },

            githubPages: true,

            groupOrder: [
                '*',
                'Documents',
                'Constructors',
                'Properties',
                'Accessors',
                'Functions',
                'Methods',
                'Classes',
                'Interfaces',
                'Type Aliases',
                'Namespaces',
                'Modules',
            ],
            groupReferencesByType: true,

            // headings: {
            //     readme: false,
            // },
            hideGenerator: true,
            hostedBaseUrl: homepage,

            // includeHierarchySummary: true,
            includeVersion: false,

            kindSortOrder: [
                'Module',
                'Constructor',
                'Property',
                'Variable',
                'Function',
                'Accessor',
                'Method',
                'Enum',
                'EnumMember',
                'Class',
                'Interface',
                'TypeAlias',
                'TypeLiteral',
                'Namespace',

                'Reference',
                'Project',

                'Parameter',
                'TypeParameter',
                'CallSignature',
                'ConstructorSignature',
                'IndexSignature',
                'GetSignature',
                'SetSignature',
            ],

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
                // 'About': `${ homepage }/ReadMe.html`,
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

            sourceLinkExternal: true,
            sourceLinkTemplate: `${ repository }/blob/main/${ this.args.packaging ? encodeURI( this.pkg.version.replace( /-draft(\+|$)/gi, '$1' ) ) + '/' : '' }{path}#L{line}`,

            sort: [
                'documents-first',
                'static-first',
                'required-first',
                'kind',
                'visibility',
                'alphabetical',
            ],

            tsconfig: 'src/ts/tsconfig.json',

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
/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.3.draft
 * @license MIT
 */
import * as typeDoc from 'typedoc';
import {
    escRegExp,
    escRegExpReplace,
    mergeArgs,
} from '@maddimathon/utility-typescript';
import { TypeDocUtils } from '@maddimathon/utility-typescript/node';
import { StageError } from '../../@internal/index.js';
import { FileSystem } from '../../00-universal/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default package stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 */
export class DocumentStage extends AbstractStage {
    /* STATIC
     * ====================================================================== */
    /**
     * Returns external symbol mappings for TypeDoc.
     *
     * @category Config
     *
     * @since 0.3.0-alpha.5
     */
    static get typeDocConfig_externalSymbolLinkMappings() {
        return {
            '@maddimathon/utility-typescript':
                TypeDocUtils.Mappings.utilityTypescript,
            '@maddimathon/utility-typescript/node':
                TypeDocUtils.Mappings.utilityTypescript_node,
            '@maddimathon/utility-typescript/types':
                TypeDocUtils.Mappings.utilityTypescript_types,
            glob: {
                GlobOptions:
                    'https://github.com/search?q=repo%3Aisaacs%2Fnode-glob+path%3A%2F%5Esrc%5C%2F%2F+symbol%3AGlobOptions&type=code',
            },
            global: TypeDocUtils.Mappings.global,
            minify: {
                Options:
                    'https://github.com/search?q=repo%3ADefinitelyTyped%2FDefinitelyTyped+path%3A%2F%5Etypes%5C%2Fminify%5C%2F%2F+symbol%3AOptions&type=code',
            },
            postcss: {
                'postcss.process': 'https://postcss.org/api/#processor-process',
                'postcss.Parser': 'https://postcss.org/api/#postcss-parser',
                'postcss.SourceMapOptions':
                    'https://postcss.org/api/#sourcemapoptions',
                'postcss.Syntax': 'https://postcss.org/api/#syntax',
            },
            prettier: {
                Options: 'https://prettier.io/docs/options',
            },
            sass: TypeDocUtils.Mappings.sass,
            'sass-embedded': TypeDocUtils.Mappings.sass,
            typescript: {
                ...TypeDocUtils.Mappings.global,
                ...TypeDocUtils.Mappings.typescript,
            },
        };
    }
    /**
     * Returns a default TypeDoc configuration object.  For use as
     * {@link Stage.Args.Document.typeDoc}.
     *
     * @category Config
     */
    static typeDocConfig(stage) {
        const is = {
            dryrun:
                stage.params.dryrun
                || (!stage.params.packaging && !stage.params.releasing),
            packaging: stage.params.packaging || stage.params.releasing,
            releasing: stage.params.releasing,
        };
        const homepage = stage.pkg.homepage?.replace(/\/+$/gi, '');
        const repository = (
            typeof stage.pkg.repository === 'string' ?
                stage.pkg.repository
            :   stage.pkg.repository?.url)?.replace(/(\/+|\.git)$/gi, '');
        const navigationLinks = {
            // 'About': `${ homepage }/ReadMe.html`,
            GitHub: repository ?? '',
            'by Maddi Mathon': 'https://www.maddimathon.com/web',
        };
        if (!navigationLinks['GitHub']) {
            delete navigationLinks['GitHub'];
        }
        return {
            alwaysCreateEntryPointModule: true,
            basePath: stage.fs.pathRelative(stage.getSrcDir(undefined, 'ts')),
            blockTags: [
                ...typeDoc.OptionDefaults.blockTags,
                '@source',
                '@TODO',
                '@UPGRADE',
            ],
            cascadedModifierTags: [
                ...typeDoc.OptionDefaults.cascadedModifierTags,
                '@alpha',
                '@beta',
                '@experimental',
                '@internal',
            ],
            categorizeByGroup: true,
            categoryOrder: [
                'Documentation',
                '*',
                'Other',
                'Internal',
                'Deprecated',
            ],
            customFooterHtml: `<p>Copyright <a href="https://www.maddimathon.com/web" target="_blank">Maddi Mathon</a>, ${stage.config.launchYear}.</p><p>Site generated using <a href="https://typedoc.org/" target="_blank">TypeDoc</a>.</p>`,
            customFooterHtmlDisableWrapper: true,
            disableGit: false,
            disableSources: false,
            excludeInternal: is.packaging,
            excludeNotDocumented: false,
            excludePrivate: false,
            excludeProtected: false,
            excludeReferences: false,
            externalSymbolLinkMappings:
                DocumentStage.typeDocConfig_externalSymbolLinkMappings,
            githubPages: true,
            groupOrder: [
                '*',
                'Documents',
                'Variables',
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
            hideGenerator: true,
            highlightLanguages: [
                ...typeDoc.OptionDefaults.highlightLanguages,
                'astro',
                'csv',
                'handlebars',
                'jsx',
                'latex',
                'markdown',
                'md',
                'php',
                'regex',
                'regexp',
                'sass',
                'scss',
                'sh',
                'shell',
                'shellscript',
                'sql',
                'swift',
                'tsv',
                'vue-html',
                'vue',
                'xml',
                'yaml',
                'yml',
                'zsh',
            ],
            hostedBaseUrl: homepage,
            jsDocCompatibility: {
                exampleTag: false,
            },
            includeVersion: false,
            kindSortOrder: [
                'Document',
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
                stage.config.title,
                stage.version.toString(stage.isDraftVersion),
            ]
                .filter((v) => v)
                .join(' @ '),
            navigationLinks,
            notRenderedTags: [
                ...typeDoc.OptionDefaults.notRenderedTags,
                '@TODO',
                '@UPGRADE',
                '@expand',
                '@expandType',
                '@inline',
                '@inlineType',
                '@interface',
                '@preventExpand',
                '@preventInline',
                '@primaryExport',
                '@sortStrategy',
                '@useDeclaredType',
            ],
            out: 'docs',
            plugin: ['typedoc-plugin-inline-sources'],
            projectDocuments: ['README.md'],
            readme: 'none',
            router: 'structure',
            searchInComments: true,
            searchInDocuments: true,
            sourceLinkExternal: true,
            sourceLinkTemplate: `${repository}/blob/main/${stage.params.packaging && !stage.params.dryrun ? encodeURI(stage.pkg.version) + '/' : ''}{path}#L{line}`,
            sort: [
                'documents-first',
                'static-first',
                'required-first',
                'visibility',
                'kind',
                'alphabetical',
            ],
            tsconfig: stage.fs.pathRelative(
                stage.getSrcDir(undefined, 'ts', 'tsconfig.json'),
            ),
            useFirstParagraphOfCommentAsSummary: true,
            useTsLinkResolution: true,
            visibilityFilters: {
                '@alpha': !is.releasing,
                '@beta': true,
                external: true,
                inherited: true,
                private: !is.releasing,
                protected: true,
            },
        };
    }
    /* PROPERTIES
     * ====================================================================== */
    /**
     * {@inheritDoc AbstractStage.subStages}
     *
     * @category Running
     *
     * @source
     */
    subStages = ['typeDoc', 'replace'];
    /* Args ===================================== */
    get ARGS_DEFAULT() {
        const replace = (_stage) => ({
            current: ['docs/**'],
            ignore: [
                ...FileSystem.globs.IGNORE_COPIED(_stage),
                ...FileSystem.globs.IGNORE_PROJECT,
                ...FileSystem.globs.SYSTEM,
                '**/.vscode/**',
            ],
            package: ['docs/**'],
        });
        return {
            entryPoints: null,
            replace,
            /** This is {@link DocumentStage.typeDocConfig}. */
            typeDoc: DocumentStage.typeDocConfig,
            utils: {},
        };
    }
    /**
     * {@inheritDoc AbstractStage.buildArgs}
     *
     * @category Config
     */
    buildArgs(args = {}) {
        const _defaults = this.ARGS_DEFAULT;
        const merged = mergeArgs(_defaults, args, true);
        if (
            typeof _defaults.typeDoc === 'function'
            && merged.typeDoc
            && typeof merged.typeDoc !== 'function'
        ) {
            merged.typeDoc = mergeArgs(
                _defaults.typeDoc(this),
                merged.typeDoc,
                true,
            );
        }
        return merged;
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @category Constructor
     *
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param args     Partial overrides for the default args.
     * @param pkg      Parsed contents of the project’s package.json file.
     * @param version  Version object for the project’s version.
     */
    constructor(config, params, args, pkg, version) {
        super('document', 'turquoise', config, params, args, pkg, version);
    }
    /* LOCAL METHODS
     * ====================================================================== */
    startEndNotice(which) {
        return super.startEndNotice(which, !this.params.building);
    }
    /* RUNNING METHODS
     * ====================================================================== */
    async runSubStage(subStage) {
        return this[subStage]();
    }
    /**
     * Replaces placeholders in the built files and directories.
     *
     * @category Sub-Stages
     */
    async replace() {
        if (!this.args.replace) {
            return;
        }
        this.console.progress('replacing placeholders...', 1);
        const paths = this.args.replace(this);
        for (const _key of ['current', 'package']) {
            // continues
            if (!paths[_key]) {
                continue;
            }
            this.replaceInFiles(paths[_key], _key, 2, paths.ignore, true);
        }
    }
    /**
     * Runs TypeDoc to auto-document typescript.
     *
     * @category Sub-Stages
     */
    async typeDoc() {
        this.console.progress('documenting typescript...', 1);
        const entryPoints = this.args.entryPoints ?? [];
        // returns or throws if pkg.main is not a valid entry point
        if (!entryPoints?.length) {
            const _warnMsg =
                'no entry points configured, skipping typedoc generation...';
            const _exitError = new StageError(
                'No entry points configured, unable to run TypeDoc',
                { class: 'DocumentStage', method: 'typeDoc' },
            );
            // returns or throws
            if (!this.pkg.main || typeof this.pkg.main !== 'string') {
                if (!this.params.packaging || this.params.dryrun) {
                    this.console.verbose(_warnMsg, 2);
                } else {
                    this.handleError(_exitError, 2);
                }
                return;
            }
            const _distRegex = new RegExp(
                '(^|(?<!\\.)\\.?\\/)'
                    + escRegExp(
                        this.fs.pathRelative(this.getDistDir(undefined, 'ts')),
                    ),
            );
            // this.console.vi.log( { _distRegex }, 2 );
            const _srcReplace =
                '$1'
                + escRegExpReplace(
                    this.fs.pathRelative(this.getSrcDir(undefined, 'ts')),
                );
            // this.console.vi.log( { _srcReplace }, 2 );
            const _mainExportPath = this.pkg.main
                .replace(_distRegex, _srcReplace)
                .replace(/\.js(x)?$/gi, '.ts$1');
            // this.console.vi.log( { _mainExportPath }, 2 );
            // returns or throws
            if (!_mainExportPath || !this.fs.exists(_mainExportPath)) {
                if (!this.params.packaging || this.params.dryrun) {
                    this.console.verbose(_warnMsg, 2);
                } else {
                    this.handleError(_exitError, 2);
                }
                return;
            }
            entryPoints.push(_mainExportPath);
        }
        const config =
            typeof this.args.typeDoc === 'function' ?
                this.args.typeDoc(this)
            :   this.args.typeDoc;
        config.entryPoints = entryPoints;
        // deletes any existing files
        if (!this.isWatchedUpdate && config.out) {
            this.console.verbose('deleting existing files...', 2);
            const outDir = config.out.replace(/\/+$/gi, '');
            this.fs.delete(
                [outDir + '/*', outDir + '/.*'],
                this.params.verbose ? 3 : 2,
            );
        }
        // deletes any existing files
        if (config.json) {
            if (!config.out) {
                this.console.verbose('deleting existing files...', 2);
            }
            this.fs.delete([config.json], this.params.verbose ? 3 : 2);
        }
        this.console.verbose('running typedoc...', 2);
        this.console.vi.debug(
            { 'TypeDoc config': config },
            this.params.verbose ? 3 : 2,
        );
        const app = await typeDoc.Application.bootstrapWithPlugins(config);
        // May be undefined if errors are encountered.
        const project = await app.convert();
        // returns
        if (!project) {
            this.handleError(
                new StageError('ⅹ TypeDoc project setup failed', {
                    class: 'DocumentStage',
                    method: 'typeDoc',
                }),
                this.params.verbose ? 3 : 2,
                {
                    exitProcess: this.params.packaging && !this.params.dryrun,
                },
            );
            return;
        }
        // for some unknown reason, this breaks if I use this.atry
        try {
            await app.generateOutputs(project);
        } catch (error) {
            this.handleError(error, this.params.verbose ? 3 : 2, {
                exitProcess: this.params.packaging && !this.params.dryrun,
            });
            throw error;
        }
    }
}

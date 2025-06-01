/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-alpha.draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import * as typeDoc from 'typedoc';
import {
    escRegExp,
    escRegExpReplace,
    mergeArgs,
} from '@maddimathon/utility-typescript/functions';
import { ProjectError } from '../../@internal/index.js';
import { FileSystem } from '../../00-universal/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default package stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 */
export class DocumentStage extends AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
    subStages = ['typeDoc', 'replace'];
    /* Args ===================================== */
    get ARGS_DEFAULT() {
        const replace = (_stage) => ({
            current: ['docs/**'],
            ignore: [
                ...FileSystem.globs.IGNORE_COPIED(_stage),
                ...FileSystem.globs.IGNORE_PROJECT,
                ...FileSystem.globs.SYSTEM,
                '**/.new-scripts/**',
                '**/.vscode/**',
            ],
            package: ['docs/**'],
        });
        const typeDocOpts = (_stage) => {
            const _homepage = _stage.pkg.homepage?.replace(/\/+$/gi, '');
            const _repository = (
                typeof _stage.pkg.repository === 'string'
                    ? _stage.pkg.repository
                    : _stage.pkg.repository?.url
            )?.replace(/(\/+|\.git)$/gi, '');
            const navigationLinks = {
                // 'About': `${ _homepage }/ReadMe.html`,
                GitHub: _repository ?? '',
                'by Maddi Mathon': 'https://www.maddimathon.com',
            };
            if (!_repository) {
                delete navigationLinks.GitHub;
            }
            return {
                alwaysCreateEntryPointModule: true,
                basePath: _stage.fs.pathRelative(
                    _stage.getSrcDir(undefined, 'ts'),
                ),
                blockTags: [
                    ...typeDoc.OptionDefaults.blockTags,
                    '@homepage',
                    '@package',
                    '@source',
                    '@todo',
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
                    'Internal',
                    'Deprecated',
                ],
                customFooterHtml: `<p>Copyright <a href="https://www.maddimathon.com" target="_blank">Maddi Mathon</a>, ${_stage.config.launchYear}. <a href="${_homepage}/MIT_License.html">MIT license</a>.</p><p>Site generated using <a href="https://typedoc.org/" target="_blank">TypeDoc</a>.</p>`,
                customFooterHtmlDisableWrapper: true,
                disableGit: false,
                disableSources: false,
                excludeInternal: false,
                excludeNotDocumented: false,
                excludePrivate: false,
                excludeProtected: false,
                excludeReferences: false,
                externalSymbolLinkMappings: {
                    '@maddimathon/utility-typescript': {
                        mergeArgs:
                            'https://maddimathon.github.io/utility-typescript/functions/mergeArgs.html',
                        node: 'https://maddimathon.github.io/utility-typescript/classes/node.html',
                        NodeConsole:
                            'https://maddimathon.github.io/utility-typescript/classes/node/NodeConsole.html',
                        'node.NodeConsole':
                            'https://maddimathon.github.io/utility-typescript/classes/node/NodeConsole.html',
                        NodeFiles:
                            'https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles-1.html',
                        'node.NodeFiles':
                            'https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles-1.html',
                        'NodeFiles.Args':
                            'https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/Args.html',
                        'node.NodeFiles.Args':
                            'https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/Args.html',
                        MessageMaker:
                            'https://maddimathon.github.io/utility-typescript/classes/MessageMaker.html',
                        'MessageMaker.BulkMsgs':
                            'https://maddimathon.github.io/utility-typescript/classes/MessageMaker/BulkMsgs.html',
                        'MessageMaker.Colour':
                            'https://maddimathon.github.io/utility-typescript/classes/MessageMaker/Colour.html',
                        'MessageMaker.MsgArgs':
                            'https://maddimathon.github.io/utility-typescript/classes/MessageMaker/MsgArgs.html',
                        'MessageMaker.BulkMsgArgs':
                            'https://maddimathon.github.io/utility-typescript/classes/MessageMaker/BulkMsgArgs.html',
                        VariableInspector:
                            'https://maddimathon.github.io/utility-typescript/classes/VariableInspector.html',
                        Node: 'https://maddimathon.github.io/utility-typescript/Types/Node.html',
                        PackageJson:
                            'https://maddimathon.github.io/utility-typescript/Types/Node/PackageJson.html',
                        'Node.PackageJson':
                            'https://maddimathon.github.io/utility-typescript/Types/Node/PackageJson.html',
                        Objects:
                            'https://maddimathon.github.io/utility-typescript/Types/Objects.html',
                        Classify:
                            'https://maddimathon.github.io/utility-typescript/Types/Objects/Classify.html',
                        'Objects.Classify':
                            'https://maddimathon.github.io/utility-typescript/Types/Objects/Classify.html',
                        'Objects.Logger':
                            'https://maddimathon.github.io/utility-typescript/Types/Objects/Logger.html',
                        RecursivePartial:
                            'https://maddimathon.github.io/utility-typescript/Types/Objects/RecursivePartial.html',
                        'Objects.RecursivePartial':
                            'https://maddimathon.github.io/utility-typescript/Types/Objects/RecursivePartial.html',
                        RecursiveRequired:
                            'https://maddimathon.github.io/utility-typescript/Types/Objects/RecursiveRequired.html',
                        'Objects.RecursiveRequired':
                            'https://maddimathon.github.io/utility-typescript/Types/Objects/RecursiveRequired.html',
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
                hideGenerator: true,
                hostedBaseUrl: _homepage,
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
                    _stage.config.title,
                    _stage.version.toString(_stage.isDraftVersion),
                ]
                    .filter((v) => v)
                    .join(' @ '),
                navigationLinks,
                out: 'docs',
                plugin: ['typedoc-plugin-inline-sources'],
                projectDocuments: ['README.md'],
                readme: 'none',
                router: 'structure',
                searchInComments: true,
                searchInDocuments: true,
                sourceLinkExternal: true,
                sourceLinkTemplate: `${_repository}/blob/main/${_stage.params.packaging ? encodeURI(_stage.pkg.version) + '/' : ''}{path}#L{line}`,
                sort: [
                    'documents-first',
                    'static-first',
                    'required-first',
                    'kind',
                    'visibility',
                    'alphabetical',
                ],
                tsconfig: _stage.fs.pathRelative(
                    _stage.getSrcDir(undefined, 'ts', 'tsconfig.json'),
                ),
                useFirstParagraphOfCommentAsSummary: true,
                visibilityFilters: {
                    '@alpha':
                        !_stage.params.releasing || !!_stage.params.dryrun,
                    '@beta': true,
                    external: true,
                    inherited: true,
                    private: !_stage.params.releasing || !!_stage.params.dryrun,
                    protected: true,
                },
            };
        };
        return {
            ...AbstractStage.ARGS_DEFAULT,
            entryPoints: null,
            replace,
            typeDoc: typeDocOpts,
        };
    }
    /** {@inheritDoc AbstractStage.buildArgs} */
    buildArgs(args = {}) {
        const _defaults = this.ARGS_DEFAULT;
        const merged = mergeArgs(_defaults, args, true);
        if (
            typeof _defaults.replace === 'function'
            && merged.replace
            && typeof merged.replace !== 'function'
        ) {
            merged.replace = mergeArgs(
                _defaults.replace(this),
                merged.replace,
                false,
            );
        }
        if (
            typeof _defaults.typeDoc === 'function'
            && merged.typeDoc
            && typeof merged.typeDoc !== 'function'
        ) {
            merged.typeDoc = mergeArgs(
                _defaults.typeDoc(this),
                merged.typeDoc,
                false,
            );
        }
        return merged;
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor(config, params, args, _pkg, _version) {
        super('document', 'turquoise', config, params, args, _pkg, _version);
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /* RUNNING METHODS
     * ====================================================================== */
    async runSubStage(subStage) {
        await this[subStage]();
    }
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
            this.replaceInFiles(paths[_key], _key, 2, paths.ignore);
        }
    }
    async typeDoc() {
        this.console.progress('documenting typescript...', 1);
        const entryPoints = this.args.entryPoints ?? [];
        // returns or throws if pkg.main is not a valid entry point
        if (!entryPoints?.length) {
            const _warnMsg =
                'no entry points configured, skipping typedoc generation...';
            const _exitError = new ProjectError(
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
                        this.fs.pathRelative(this.getDistDir(undefined, 'js')),
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
        // this.console.vi.log( { entryPoints }, 2 );
        const config =
            typeof this.args.typeDoc === 'function'
                ? this.args.typeDoc(this)
                : this.args.typeDoc;
        config.entryPoints = entryPoints;
        // deletes any existing files
        if (config.out) {
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
                new ProjectError('TypeDoc project setup failed', {
                    class: 'DocumentStage',
                    method: 'typeDoc',
                }),
                this.params.verbose ? 3 : 2,
                {},
                this.params.packaging && !this.params.dryrun,
            );
            return;
        }
        // for some unknown reason, this breaks if I use this.try
        try {
            await app.generateOutputs(project);
        } catch (error) {
            this.handleError(
                error,
                this.params.verbose ? 3 : 2,
                {},
                this.params.packaging && !this.params.dryrun,
            );
            throw error;
        }
    }
}
//# sourceMappingURL=DocumentStage.js.map

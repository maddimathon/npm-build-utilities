/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.3.draft
 * @license MIT
 */
import * as typeDoc from "typedoc";
import type { PackageJson } from '@maddimathon/utility-typescript/types';
import type { CLI, Config, Stage } from '../../../types/index.js';
import { type SemVer } from '../../@internal/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default package stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 */
export declare class DocumentStage extends AbstractStage<Stage.Args.Document, Stage.SubStage.Document> {
    /**
     * Returns external symbol mappings for TypeDoc.
     *
     * @category Config
     *
     * @since 0.3.0-alpha.5
     */
    static get typeDocConfig_externalSymbolLinkMappings(): {
        readonly '@maddimathon/utility-typescript': {
            arrayUnique: string;
            deleteUndefinedProps: string;
            hasIterator: string;
            isObjectEmpty: string;
            mapFlatten: string;
            mapFlattenAsync: string;
            mapToObject: string;
            mapToObjectAsync: string;
            mergeArgs: string;
            mergeArgsAsync: string;
            typeOf: string;
            MessageMaker: string;
            'MessageMaker.BulkMsgs': string;
            'MessageMaker.Colour': string;
            'MessageMaker.MsgArgs': string;
            'MessageMaker.BulkMsgArgs': string;
            MiniConsole: string;
            VariableInspector: string;
        };
        readonly '@maddimathon/utility-typescript/node': {
            NodeConsole: string;
            NodeFiles: string;
            'NodeFiles.Args': string;
            'NodeFiles.CopyFileArgs': string;
            'NodeFiles.ReadDirArgs': string;
            'NodeFiles.ReadFileArgs': string;
            'NodeFiles.WriteFileArgs': string;
        };
        readonly '@maddimathon/utility-typescript/types': {
            Classify: string;
            RecursivePartial: string;
            RecursiveRequired: string;
        };
        readonly glob: {
            readonly GlobOptions: "https://github.com/search?q=repo%3Aisaacs%2Fnode-glob+path%3A%2F%5Esrc%5C%2F%2F+symbol%3AGlobOptions&type=code";
        };
        readonly global: {
            Error: string;
            'Error.cause': string;
            'Error.name': string;
            'Object.entries': string;
            'Object.fromEntries': string;
            Promise: string;
            RegExp: string;
        };
        readonly minify: {
            readonly Options: "https://github.com/search?q=repo%3ADefinitelyTyped%2FDefinitelyTyped+path%3A%2F%5Etypes%5C%2Fminify%5C%2F%2F+symbol%3AOptions&type=code";
        };
        readonly postcss: {
            readonly 'postcss.process': "https://postcss.org/api/#processor-process";
            readonly 'postcss.Parser': "https://postcss.org/api/#postcss-parser";
            readonly 'postcss.SourceMapOptions': "https://postcss.org/api/#sourcemapoptions";
            readonly 'postcss.Syntax': "https://postcss.org/api/#syntax";
        };
        readonly prettier: {
            readonly Options: "https://prettier.io/docs/options";
        };
        readonly sass: {
            CustomFunction: string;
            Logger: string;
            NodePackageImporter: string;
            Options: string;
            SassBoolean: string;
            SassCalculation: string;
            SassColor: string;
            SassFunction: string;
            SassList: string;
            SassMap: string;
            SassMixin: string;
            SassNumber: string;
            SassString: string;
            StringOptions: string;
            Value: string;
        };
        readonly 'sass-embedded': {
            CustomFunction: string;
            Logger: string;
            NodePackageImporter: string;
            Options: string;
            SassBoolean: string;
            SassCalculation: string;
            SassColor: string;
            SassFunction: string;
            SassList: string;
            SassMap: string;
            SassMixin: string;
            SassNumber: string;
            SassString: string;
            StringOptions: string;
            Value: string;
        };
        readonly typescript: {
            readonly Awaited: string;
            readonly Capitalize: string;
            readonly ConstructorParameters: string;
            readonly Exclude: string;
            readonly Extract: string;
            readonly InstanceType: string;
            readonly Lowercase: string;
            readonly NoInfer: string;
            readonly NonNullable: string;
            readonly Omit: string;
            readonly OmitThisParameter: string;
            readonly Parameters: string;
            readonly Partial: string;
            readonly Pick: string;
            readonly Record: string;
            readonly Required: string;
            readonly ReturnType: string;
            readonly ThisParameterType: string;
            readonly ThisType: string;
            readonly Uncapitalize: string;
            readonly Uppercase: string;
            readonly Error: string;
            readonly 'Error.cause': string;
            readonly 'Error.name': string;
            readonly 'Object.entries': string;
            readonly 'Object.fromEntries': string;
            readonly Promise: string;
            readonly RegExp: string;
        };
    };
    /**
     * Returns a default TypeDoc configuration object.  For use as
     * {@link Stage.Args.Document.typeDoc}.
     *
     * @category Config
     */
    static typeDocConfig(stage: Stage): {
        readonly alwaysCreateEntryPointModule: true;
        readonly basePath: string;
        readonly blockTags: [...`@${string}`[], "@source", "@TODO", "@UPGRADE"];
        readonly cascadedModifierTags: [...`@${string}`[], "@alpha", "@beta", "@experimental", "@internal"];
        readonly categorizeByGroup: true;
        readonly categoryOrder: ["Documentation", "*", "Other", "Internal", "Deprecated"];
        readonly customFooterHtml: `<p>Copyright <a href="https://www.maddimathon.com/web" target="_blank">Maddi Mathon</a>, ${string}.</p><p>Site generated using <a href="https://typedoc.org/" target="_blank">TypeDoc</a>.</p>`;
        readonly customFooterHtmlDisableWrapper: true;
        readonly disableGit: false;
        readonly disableSources: false;
        readonly excludeInternal: boolean;
        readonly excludeNotDocumented: false;
        readonly excludePrivate: false;
        readonly excludeProtected: false;
        readonly excludeReferences: false;
        readonly externalSymbolLinkMappings: {
            readonly '@maddimathon/utility-typescript': {
                arrayUnique: string;
                deleteUndefinedProps: string;
                hasIterator: string;
                isObjectEmpty: string;
                mapFlatten: string;
                mapFlattenAsync: string;
                mapToObject: string;
                mapToObjectAsync: string;
                mergeArgs: string;
                mergeArgsAsync: string;
                typeOf: string;
                MessageMaker: string;
                'MessageMaker.BulkMsgs': string;
                'MessageMaker.Colour': string;
                'MessageMaker.MsgArgs': string;
                'MessageMaker.BulkMsgArgs': string;
                MiniConsole: string;
                VariableInspector: string;
            };
            readonly '@maddimathon/utility-typescript/node': {
                NodeConsole: string;
                NodeFiles: string;
                'NodeFiles.Args': string;
                'NodeFiles.CopyFileArgs': string;
                'NodeFiles.ReadDirArgs': string;
                'NodeFiles.ReadFileArgs': string;
                'NodeFiles.WriteFileArgs': string;
            };
            readonly '@maddimathon/utility-typescript/types': {
                Classify: string;
                RecursivePartial: string;
                RecursiveRequired: string;
            };
            readonly glob: {
                readonly GlobOptions: "https://github.com/search?q=repo%3Aisaacs%2Fnode-glob+path%3A%2F%5Esrc%5C%2F%2F+symbol%3AGlobOptions&type=code";
            };
            readonly global: {
                Error: string;
                'Error.cause': string;
                'Error.name': string;
                'Object.entries': string;
                'Object.fromEntries': string;
                Promise: string;
                RegExp: string;
            };
            readonly minify: {
                readonly Options: "https://github.com/search?q=repo%3ADefinitelyTyped%2FDefinitelyTyped+path%3A%2F%5Etypes%5C%2Fminify%5C%2F%2F+symbol%3AOptions&type=code";
            };
            readonly postcss: {
                readonly 'postcss.process': "https://postcss.org/api/#processor-process";
                readonly 'postcss.Parser': "https://postcss.org/api/#postcss-parser";
                readonly 'postcss.SourceMapOptions': "https://postcss.org/api/#sourcemapoptions";
                readonly 'postcss.Syntax': "https://postcss.org/api/#syntax";
            };
            readonly prettier: {
                readonly Options: "https://prettier.io/docs/options";
            };
            readonly sass: {
                CustomFunction: string;
                Logger: string;
                NodePackageImporter: string;
                Options: string;
                SassBoolean: string;
                SassCalculation: string;
                SassColor: string;
                SassFunction: string;
                SassList: string;
                SassMap: string;
                SassMixin: string;
                SassNumber: string;
                SassString: string;
                StringOptions: string;
                Value: string;
            };
            readonly 'sass-embedded': {
                CustomFunction: string;
                Logger: string;
                NodePackageImporter: string;
                Options: string;
                SassBoolean: string;
                SassCalculation: string;
                SassColor: string;
                SassFunction: string;
                SassList: string;
                SassMap: string;
                SassMixin: string;
                SassNumber: string;
                SassString: string;
                StringOptions: string;
                Value: string;
            };
            readonly typescript: {
                readonly Awaited: string;
                readonly Capitalize: string;
                readonly ConstructorParameters: string;
                readonly Exclude: string;
                readonly Extract: string;
                readonly InstanceType: string;
                readonly Lowercase: string;
                readonly NoInfer: string;
                readonly NonNullable: string;
                readonly Omit: string;
                readonly OmitThisParameter: string;
                readonly Parameters: string;
                readonly Partial: string;
                readonly Pick: string;
                readonly Record: string;
                readonly Required: string;
                readonly ReturnType: string;
                readonly ThisParameterType: string;
                readonly ThisType: string;
                readonly Uncapitalize: string;
                readonly Uppercase: string;
                readonly Error: string;
                readonly 'Error.cause': string;
                readonly 'Error.name': string;
                readonly 'Object.entries': string;
                readonly 'Object.fromEntries': string;
                readonly Promise: string;
                readonly RegExp: string;
            };
        };
        readonly githubPages: true;
        readonly groupOrder: ["*", "Documents", "Variables", "Constructors", "Properties", "Accessors", "Functions", "Methods", "Classes", "Interfaces", "Type Aliases", "Namespaces", "Modules"];
        readonly groupReferencesByType: true;
        readonly hideGenerator: true;
        readonly highlightLanguages: [...import("@gerrit0/mini-shiki").BundledLanguage[], "astro", "csv", "handlebars", "jsx", "latex", "markdown", "md", "php", "regex", "regexp", "sass", "scss", "sh", "shell", "shellscript", "sql", "swift", "tsv", "vue-html", "vue", "xml", "yaml", "yml", "zsh"];
        readonly hostedBaseUrl: string | undefined;
        readonly jsDocCompatibility: {
            readonly exampleTag: false;
        };
        readonly includeVersion: false;
        readonly kindSortOrder: ["Document", "Module", "Constructor", "Property", "Variable", "Function", "Accessor", "Method", "Enum", "EnumMember", "Class", "Interface", "TypeAlias", "TypeLiteral", "Namespace", "Reference", "Project", "Parameter", "TypeParameter", "CallSignature", "ConstructorSignature", "IndexSignature", "GetSignature", "SetSignature"];
        readonly markdownLinkExternal: true;
        readonly name: string;
        readonly navigationLinks: {
            [key: string]: string;
        };
        readonly notRenderedTags: [...`@${string}`[], "@TODO", "@UPGRADE", "@expand", "@expandType", "@inline", "@inlineType", "@interface", "@preventExpand", "@preventInline", "@primaryExport", "@sortStrategy", "@useDeclaredType"];
        readonly out: "docs";
        readonly plugin: ["typedoc-plugin-inline-sources"];
        readonly projectDocuments: ["README.md"];
        readonly readme: "none";
        readonly router: "structure";
        readonly searchInComments: true;
        readonly searchInDocuments: true;
        readonly sourceLinkExternal: true;
        readonly sourceLinkTemplate: `undefined/blob/main/${string}{path}#L{line}` | `${string}/blob/main/${string}{path}#L{line}`;
        readonly sort: ["documents-first", "static-first", "required-first", "visibility", "kind", "alphabetical"];
        readonly tsconfig: string;
        readonly useFirstParagraphOfCommentAsSummary: true;
        readonly useTsLinkResolution: true;
        readonly visibilityFilters: {
            readonly '@alpha': boolean;
            readonly '@beta': true;
            readonly external: true;
            readonly inherited: true;
            readonly private: boolean;
            readonly protected: true;
        };
    };
    /**
     * {@inheritDoc AbstractStage.subStages}
     *
     * @category Running
     *
     * @source
     */
    readonly subStages: Stage.SubStage.Document[];
    get ARGS_DEFAULT(): {
        readonly entryPoints: null;
        readonly replace: (_stage: Stage) => {
            current: string[];
            ignore: string[];
            package: string[];
        };
        /** This is {@link DocumentStage.typeDocConfig}. */
        readonly typeDoc: (_stage: Stage) => Partial<Omit<typeDoc.TypeDocOptions, "entryPoints">>;
        readonly utils: {};
    };
    /**
     * {@inheritDoc AbstractStage.buildArgs}
     *
     * @category Config
     */
    buildArgs(args?: Partial<Stage.Args.Document>): Stage.Args.Document & Partial<Stage.Args.Document>;
    /**
     * @category Constructor
     *
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param args     Partial overrides for the default args.
     * @param pkg      Parsed contents of the project’s package.json file.
     * @param version  Version object for the project’s version.
     */
    constructor(config: Config.Class, params: CLI.Params, args: Partial<Stage.Args.Document>, pkg?: PackageJson, version?: SemVer);
    startEndNotice(which: "start" | "end" | null): void | Promise<void>;
    protected runSubStage(subStage: Stage.SubStage.Document): Promise<void>;
    /**
     * Replaces placeholders in the built files and directories.
     *
     * @category Sub-Stages
     */
    protected replace(): Promise<void>;
    /**
     * Runs TypeDoc to auto-document typescript.
     *
     * @category Sub-Stages
     */
    protected typeDoc(): Promise<void>;
}

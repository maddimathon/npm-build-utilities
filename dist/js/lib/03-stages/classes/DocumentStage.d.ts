/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.0
 * @license MIT
 */
import * as typeDoc from "typedoc";
import type { Json } from '@maddimathon/utility-typescript/types';
import type { CLI, Config, Stage } from '../../../types/index.js';
import { SemVer } from '../../@internal/index.js';
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
        readonly customFooterHtml: `<p>Copyright <a href="https://www.maddimathon.com" target="_blank">Maddi Mathon</a>, ${string}.</p><p>Site generated using <a href="https://typedoc.org/" target="_blank">TypeDoc</a>.</p>`;
        readonly customFooterHtmlDisableWrapper: true;
        readonly disableGit: false;
        readonly disableSources: false;
        readonly excludeInternal: false;
        readonly excludeNotDocumented: false;
        readonly excludePrivate: false;
        readonly excludeProtected: false;
        readonly excludeReferences: false;
        readonly externalSymbolLinkMappings: {
            readonly '@maddimathon/utility-typescript': {
                readonly mergeArgs: "https://maddimathon.github.io/utility-typescript/functions/mergeArgs.html";
                readonly node: "https://maddimathon.github.io/utility-typescript/classes/node.html";
                readonly NodeConsole: "https://maddimathon.github.io/utility-typescript/classes/node/NodeConsole.html";
                readonly 'node.NodeConsole': "https://maddimathon.github.io/utility-typescript/classes/node/NodeConsole.html";
                readonly NodeFiles: "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles.html";
                readonly 'node.NodeFiles': "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles.html";
                readonly 'NodeFiles.Args': "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/Args.html";
                readonly 'node.NodeFiles.Args': "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/Args.html";
                readonly 'NodeFiles.CopyFileArgs': "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/CopyFileArgs.html";
                readonly 'node.NodeFiles.CopyFileArgs': "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/CopyFileArgs.html";
                readonly 'NodeFiles.ReadDirArgs': "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/ReadDirArgs.html";
                readonly 'node.NodeFiles.ReadDirArgs': "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/ReadDirArgs.html";
                readonly 'NodeFiles.ReadFileArgs': "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/ReadFileArgs.html";
                readonly 'node.NodeFiles.ReadFileArgs': "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/ReadFileArgs.html";
                readonly 'NodeFiles.WriteFileArgs': "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/WriteFileArgs.html";
                readonly 'node.NodeFiles.WriteFileArgs': "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/WriteFileArgs.html";
                readonly CustomError: "https://maddimathon.github.io/utility-typescript/classes/CustomError.html";
                readonly 'CustomError.Args': "https://maddimathon.github.io/utility-typescript/classes/CustomError/Args.html";
                readonly 'CustomError.NodeCliError': "https://maddimathon.github.io/utility-typescript/classes/CustomError/NodeCliError.html";
                readonly Logger: "https://maddimathon.github.io/utility-typescript/classes/Logger.html";
                readonly 'Logger.Args': "https://maddimathon.github.io/utility-typescript/classes/Logger/Args.html";
                readonly MessageMaker: "https://maddimathon.github.io/utility-typescript/classes/MessageMaker.html";
                readonly 'MessageMaker.BulkMsgs': "https://maddimathon.github.io/utility-typescript/classes/MessageMaker/BulkMsgs.html";
                readonly 'MessageMaker.Colour': "https://maddimathon.github.io/utility-typescript/classes/MessageMaker/Colour.html";
                readonly 'MessageMaker.MsgArgs': "https://maddimathon.github.io/utility-typescript/classes/MessageMaker/MsgArgs.html";
                readonly 'MessageMaker.BulkMsgArgs': "https://maddimathon.github.io/utility-typescript/classes/MessageMaker/BulkMsgArgs.html";
                readonly VariableInspector: "https://maddimathon.github.io/utility-typescript/classes/VariableInspector.html";
                readonly Json: "https://maddimathon.github.io/utility-typescript/Types/Json.html";
                readonly PackageJson: "https://maddimathon.github.io/utility-typescript/Types/Json/PackageJson.html";
                readonly 'Json.PackageJson': "https://maddimathon.github.io/utility-typescript/Types/Json/PackageJson.html";
                readonly Objects: "https://maddimathon.github.io/utility-typescript/Types/Objects.html";
                readonly Classify: "https://maddimathon.github.io/utility-typescript/Types/Objects/Classify.html";
                readonly 'Objects.Classify': "https://maddimathon.github.io/utility-typescript/Types/Objects/Classify.html";
                readonly RecursivePartial: "https://maddimathon.github.io/utility-typescript/Types/Objects/RecursivePartial.html";
                readonly 'Objects.RecursivePartial': "https://maddimathon.github.io/utility-typescript/Types/Objects/RecursivePartial.html";
                readonly RecursiveRequired: "https://maddimathon.github.io/utility-typescript/Types/Objects/RecursiveRequired.html";
                readonly 'Objects.RecursiveRequired': "https://maddimathon.github.io/utility-typescript/Types/Objects/RecursiveRequired.html";
            };
            readonly glob: {
                readonly GlobOptions: "https://github.com/search?q=repo%3Aisaacs%2Fnode-glob+path%3A%2F%5Esrc%5C%2F%2F+symbol%3AGlobOptions&type=code";
            };
            readonly global: {
                readonly 'Error.name': "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name";
            };
            readonly minify: {
                readonly Options: "https://github.com/search?q=repo%3ADefinitelyTyped%2FDefinitelyTyped+path%3A%2F%5Etypes%5C%2Fminify%5C%2F%2F+symbol%3AOptions&type=code";
            };
            readonly prettier: {
                readonly Options: "https://prettier.io/docs/options";
            };
            readonly typescript: {
                readonly Error: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error";
                readonly 'Error.cause': "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause";
                readonly 'Error.name': "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name";
                readonly Promise: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise";
                readonly RegExp: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp";
                readonly Awaited: "https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype";
                readonly Capitalize: "https://www.typescriptlang.org/docs/handbook/utility-types.html#intrinsic-string-manipulation-types";
                readonly ConstructorParameters: "https://www.typescriptlang.org/docs/handbook/utility-types.html#constructorparameterstype";
                readonly Exclude: "https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers";
                readonly Extract: "https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union";
                readonly InstanceType: "https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype";
                readonly Lowercase: "https://www.typescriptlang.org/docs/handbook/utility-types.html#intrinsic-string-manipulation-types";
                readonly NoInfer: "https://www.typescriptlang.org/docs/handbook/utility-types.html#noinfertype";
                readonly NonNullable: "https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype";
                readonly Omit: "https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys";
                readonly OmitThisParameter: "https://www.typescriptlang.org/docs/handbook/utility-types.html#omitthisparametertype";
                readonly Parameters: "https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype";
                readonly Partial: "https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype";
                readonly Pick: "https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys";
                readonly Record: "https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type";
                readonly Required: "https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype";
                readonly ReturnType: "https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype";
                readonly ThisParameterType: "https://www.typescriptlang.org/docs/handbook/utility-types.html#thisparametertypetype";
                readonly ThisType: "https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypetype";
                readonly Uncapitalize: "https://www.typescriptlang.org/docs/handbook/utility-types.html#intrinsic-string-manipulation-types";
                readonly Uppercase: "https://www.typescriptlang.org/docs/handbook/utility-types.html#intrinsic-string-manipulation-types";
            };
        };
        readonly githubPages: true;
        readonly groupOrder: ["*", "Documents", "Constructors", "Properties", "Accessors", "Functions", "Methods", "Classes", "Interfaces", "Type Aliases", "Namespaces", "Modules"];
        readonly groupReferencesByType: true;
        readonly hideGenerator: true;
        readonly hostedBaseUrl: string | undefined;
        readonly jsDocCompatibility: {
            readonly exampleTag: false;
        };
        readonly includeVersion: false;
        readonly kindSortOrder: ["Module", "Constructor", "Property", "Variable", "Function", "Accessor", "Method", "Enum", "EnumMember", "Class", "Interface", "TypeAlias", "TypeLiteral", "Namespace", "Reference", "Project", "Parameter", "TypeParameter", "CallSignature", "ConstructorSignature", "IndexSignature", "GetSignature", "SetSignature"];
        readonly markdownLinkExternal: true;
        readonly name: string;
        readonly navigationLinks: {
            [key: string]: string;
        };
        readonly notRenderedTags: [...`@${string}`[], "@TODO", "@UPGRADE"];
        readonly out: "docs";
        readonly plugin: ["typedoc-plugin-inline-sources"];
        readonly projectDocuments: ["README.md"];
        readonly readme: "none";
        readonly router: "structure";
        readonly searchInComments: true;
        readonly searchInDocuments: true;
        readonly sourceLinkExternal: true;
        readonly sourceLinkTemplate: `undefined/blob/main/${string}{path}#L{line}` | `${string}/blob/main/${string}{path}#L{line}`;
        readonly sort: ["documents-first", "static-first", "required-first", "kind", "visibility", "alphabetical"];
        readonly tsconfig: string;
        readonly useFirstParagraphOfCommentAsSummary: true;
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
    constructor(config: Config.Class, params: CLI.Params, args: Partial<Stage.Args.Document>, pkg?: Json.PackageJson, version?: SemVer);
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
//# sourceMappingURL=DocumentStage.d.ts.map
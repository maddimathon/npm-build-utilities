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
import type { Node } from '@maddimathon/utility-typescript/types';
import type { CLI, Stage } from '../../../types/index.js';
import { SemVer } from '../../@internal/index.js';
import { ProjectConfig } from '../../01-config/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default package stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 */
export declare class DocumentStage extends AbstractStage<Stage.SubStage.Document, Stage.Args.Document> {
    readonly subStages: Stage.SubStage.Document[];
    get ARGS_DEFAULT(): {
        readonly entryPoints: null;
        readonly replace: (_stage: Stage.Class) => {
            current: string[];
            ignore: string[];
            package: string[];
        };
        readonly typeDoc: (_stage: Stage.Class) => {
            readonly alwaysCreateEntryPointModule: true;
            readonly basePath: string;
            readonly blockTags: [...`@${string}`[], "@homepage", "@package", "@source", "@todo"];
            readonly categorizeByGroup: true;
            readonly categoryOrder: ["*", "Other", "Internal", "Deprecated"];
            readonly customFooterHtml: `<p>Copyright <a href="https://www.maddimathon.com" target="_blank">Maddi Mathon</a>, ${string}. <a href="undefined/MIT_License.html">MIT license</a>.</p><p>Site generated using <a href="https://typedoc.org/" target="_blank">TypeDoc</a>.</p>` | `<p>Copyright <a href="https://www.maddimathon.com" target="_blank">Maddi Mathon</a>, ${string}. <a href="${string}/MIT_License.html">MIT license</a>.</p><p>Site generated using <a href="https://typedoc.org/" target="_blank">TypeDoc</a>.</p>`;
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
                    readonly NodeFiles: "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles-1.html";
                    readonly 'node.NodeFiles': "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles-1.html";
                    readonly 'NodeFiles.Args': "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/Args.html";
                    readonly 'node.NodeFiles.Args': "https://maddimathon.github.io/utility-typescript/classes/node/NodeFiles/Args.html";
                    readonly MessageMaker: "https://maddimathon.github.io/utility-typescript/classes/MessageMaker.html";
                    readonly 'MessageMaker.BulkMsgs': "https://maddimathon.github.io/utility-typescript/classes/MessageMaker/BulkMsgs.html";
                    readonly 'MessageMaker.Colour': "https://maddimathon.github.io/utility-typescript/classes/MessageMaker/Colour.html";
                    readonly 'MessageMaker.MsgArgs': "https://maddimathon.github.io/utility-typescript/classes/MessageMaker/MsgArgs.html";
                    readonly 'MessageMaker.BulkMsgArgs': "https://maddimathon.github.io/utility-typescript/classes/MessageMaker/BulkMsgArgs.html";
                    readonly VariableInspector: "https://maddimathon.github.io/utility-typescript/classes/VariableInspector.html";
                    readonly Node: "https://maddimathon.github.io/utility-typescript/Types/Node.html";
                    readonly PackageJson: "https://maddimathon.github.io/utility-typescript/Types/Node/PackageJson.html";
                    readonly 'Node.PackageJson': "https://maddimathon.github.io/utility-typescript/Types/Node/PackageJson.html";
                    readonly Objects: "https://maddimathon.github.io/utility-typescript/Types/Objects.html";
                    readonly Classify: "https://maddimathon.github.io/utility-typescript/Types/Objects/Classify.html";
                    readonly 'Objects.Classify': "https://maddimathon.github.io/utility-typescript/Types/Objects/Classify.html";
                    readonly 'Objects.Logger': "https://maddimathon.github.io/utility-typescript/Types/Objects/Logger.html";
                    readonly RecursivePartial: "https://maddimathon.github.io/utility-typescript/Types/Objects/RecursivePartial.html";
                    readonly 'Objects.RecursivePartial': "https://maddimathon.github.io/utility-typescript/Types/Objects/RecursivePartial.html";
                    readonly RecursiveRequired: "https://maddimathon.github.io/utility-typescript/Types/Objects/RecursiveRequired.html";
                    readonly 'Objects.RecursiveRequired': "https://maddimathon.github.io/utility-typescript/Types/Objects/RecursiveRequired.html";
                };
            };
            readonly githubPages: true;
            readonly groupOrder: ["*", "Documents", "Constructors", "Properties", "Accessors", "Functions", "Methods", "Classes", "Interfaces", "Type Aliases", "Namespaces", "Modules"];
            readonly groupReferencesByType: true;
            readonly hideGenerator: true;
            readonly hostedBaseUrl: string | undefined;
            readonly includeVersion: false;
            readonly kindSortOrder: ["Module", "Constructor", "Property", "Variable", "Function", "Accessor", "Method", "Enum", "EnumMember", "Class", "Interface", "TypeAlias", "TypeLiteral", "Namespace", "Reference", "Project", "Parameter", "TypeParameter", "CallSignature", "ConstructorSignature", "IndexSignature", "GetSignature", "SetSignature"];
            readonly markdownLinkExternal: true;
            readonly name: string;
            readonly navigationLinks: {
                [key: string]: string;
            };
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
        readonly objs: {};
    };
    /** {@inheritDoc AbstractStage.buildArgs} */
    buildArgs(args?: Partial<Stage.Args.Document>): Stage.Args.Document<string> & Partial<Stage.Args.Document<string>>;
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor(config: ProjectConfig, params: CLI.Params, args: Partial<Stage.Args.Document>, _pkg?: Node.PackageJson, _version?: SemVer);
    protected runSubStage(subStage: Stage.SubStage.Document): Promise<void>;
    protected replace(): Promise<void>;
    protected typeDoc(): Promise<void>;
}
//# sourceMappingURL=DocumentStage.d.ts.map
/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.12
 * @license MIT
 */
import type { Json } from '@maddimathon/utility-typescript/types';
import type { CLI, Config, Stage } from '../../../types/index.js';
import { SemVer } from '../../@internal/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default release stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 */
export declare class ReleaseStage extends AbstractStage<Stage.Args.Release, Stage.SubStage.Release> {
    /**
     * Default content for an empty, markdown changelog file.
     *
     * @category Constants
     */
    get DEFAULT_CHANGELOG(): string;
    /**
     * Default content for an empty, markdown release notes file.
     *
     * @category Constants
     */
    get DEFAULT_RELEASE_NOTES(): string;
    /**
     * {@inheritDoc AbstractStage.subStages}
     *
     * @category Running
     *
     * @source
     */
    readonly subStages: Stage.SubStage.Release[];
    get ARGS_DEFAULT(): {
        readonly commit: null;
        readonly replace: (_stage: Stage) => {
            readonly ignore: [".git/**", "**/.git/**", ".scripts/**", "**/.scripts/**", ".vscode/**/*.code-snippets", ".vscode/**/settings.json", "node_modules/**", "**/node_modules/**", "._*", "._*/**", "**/._*", "**/._*/**", "**/.DS_Store", "**/.smbdelete**", "**/.vscode/**", "**/*.zip"];
            readonly package: [string, string, string, string];
        };
        readonly utils: {};
    };
    /**
     * @category Constructor
     *
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param args     Partial overrides for the default args.
     * @param pkg      Parsed contents of the project’s package.json file.
     * @param version  Version object for the project’s version.
     */
    constructor(config: Config.Class, params: CLI.Params, args: Partial<Stage.Args.Release>, pkg?: Json.PackageJson, version?: SemVer);
    /**
     * Runs the prompters to confirm before starting the substages.
     *
     * @category Running
     */
    protected startPrompters(): Promise<void>;
    startEndNotice(which: "start" | "end" | null): Promise<void>;
    protected runSubStage(subStage: Stage.SubStage.Release): Promise<void>;
    /**
     * Add updates in the release notes file to the changelog.
     *
     * @category Sub-Stages
     */
    protected changelog(): Promise<void>;
    /**
     * Git commits files changed and created during build and package.
     *
     * @category Sub-Stages
     */
    protected commit(): Promise<void>;
    /**
     * Uses GitHub API to update repo meta and draft a release.
     *
     * @category Sub-Stages
     */
    protected github(): Promise<void>;
    /**
     * Runs the project's package class.
     *
     * @category Sub-Stages
     */
    protected package(): Promise<void>;
    /**
     * Replaces package placeholders in the source.
     *
     * @category Sub-Stages
     */
    protected replace(): Promise<void>;
    /**
     * Resets the release notes file.
     *
     * @category Sub-Stages
     */
    protected tidy(): Promise<void>;
}
//# sourceMappingURL=ReleaseStage.d.ts.map
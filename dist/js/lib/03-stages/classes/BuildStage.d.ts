/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.1.draft
 * @license MIT
 */
import type { Json } from '@maddimathon/utility-typescript/types';
import type { CLI, Config, Stage } from '../../../types/index.js';
import { SemVer } from '../../@internal/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default build stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 */
export declare class BuildStage extends AbstractStage<Stage.Args.Build, Stage.SubStage.Build> {
    /**
     * {@inheritDoc AbstractStage.subStages}
     *
     * @category Running
     *
     * @source
     */
    readonly subStages: Stage.SubStage.Build[];
    get ARGS_DEFAULT(): {
        readonly compile: true;
        readonly document: false;
        readonly minimize: (_stage: Stage) => {
            readonly css: false;
            readonly html: false;
            readonly js: false;
            readonly json: {
                readonly globs: [`${string}/**/*.json`];
            };
        };
        readonly prettify: (_stage: Stage) => {
            readonly css: readonly [readonly [`${string}/**/*.css`, `${string}/**/*.css`]];
            readonly html: readonly [readonly [`${string}/**/*.html`]];
            readonly js: readonly [readonly [`${string}/**/*.js`, `${string}/**/*.jsx`, `${string}/**/*.js`, `${string}/**/*.jsx`]];
            readonly json: readonly [readonly [`${string}/**/*.json`]];
            readonly md: undefined;
            readonly mdx: undefined;
            readonly scss: readonly [readonly [`${string}/**/*.scss`, `${string}/**/*.scss`]];
            readonly ts: readonly [readonly [`${string}/**/*.ts`, `${string}/**/*.tsx`, `${string}/**/*.ts`, `${string}/**/*.tsx`]];
            readonly yaml: readonly [readonly [`${string}/**/*.yaml`]];
        };
        readonly replace: (stage: Stage) => {
            current?: string[];
            ignore?: string[];
            package?: string[];
        };
        readonly test: false;
        readonly utils: {};
    };
    buildArgs(args?: Partial<Stage.Args.Build>): Stage.Args.Build & Partial<Stage.Args.Build>;
    /**
     * @category Constructor
     *
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param args     Partial overrides for the default args.
     * @param pkg      Parsed contents of the project’s package.json file.
     * @param version  Version object for the project’s version.
     */
    constructor(config: Config.Class, params: CLI.Params, args: Partial<Stage.Args.Build>, pkg?: Json.PackageJson, version?: SemVer);
    startEndNotice(which: "start" | "end" | null): void | Promise<void>;
    protected runSubStage(subStage: Stage.SubStage.Build): Promise<void>;
    /**
     * Runs the project's compile class.
     *
     * @category Sub-Stages
     */
    protected compile(): Promise<void>;
    /**
     * Runs the project's document class.
     *
     * @category Sub-Stages
     */
    protected document(): Promise<void>;
    /**
     * Minimizes files.
     *
     * @category Sub-Stages
     */
    protected minimize(): Promise<void>;
    /**
     * Runs prettier to format files.
     *
     * @category Sub-Stages
     */
    protected prettify(): Promise<void>;
    /**
     * Replaces placeholders in the built files and directories.
     *
     * @category Sub-Stages
     */
    protected replace(): Promise<void>;
    /**
     * Runs the project's test class.
     *
     * @category Sub-Stages
     */
    protected test(): Promise<void>;
}
//# sourceMappingURL=BuildStage.d.ts.map
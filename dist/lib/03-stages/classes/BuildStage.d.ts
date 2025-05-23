/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/npm-build-utilities@0.1.0-draft
 * @license MIT
 */
import type { CLI, Stage } from '../../../types/index.js';
import { ProjectConfig } from '../../01-config/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default build stage.
 *
 * @category Stages
 *
 * @since 0.1.0-draft
 */
export declare class BuildStage extends AbstractStage<Stage.SubStage.Build, Stage.Args.Build> {
    readonly subStages: Stage.SubStage.Build[];
    get ARGS_DEFAULT(): Stage.Args.Build;
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     */
    constructor(config: ProjectConfig, params: CLI.Params, args: Partial<Stage.Args.Build>);
    /**
     * Prints a message to the console signalling the start or end of this
     * build stage.
     *
     * @param which  Whether we are starting or ending.
     */
    startEndNotice(which: "start" | "end" | null): void;
    protected runSubStage(stage: Stage.SubStage.Build): Promise<void>;
    /**
     * Runs the project's compile class.
     */
    protected compile(): Promise<void>;
    /**
     * Runs the project's document class.
     */
    protected document(): Promise<void>;
    protected minimize(): Promise<void>;
    protected prettify(): Promise<void>;
    protected replace(): Promise<void>;
    /**
     * Runs the project's test class.
     */
    protected test(): Promise<void>;
}
//# sourceMappingURL=BuildStage.d.ts.map
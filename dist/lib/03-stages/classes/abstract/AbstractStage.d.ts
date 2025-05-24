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
import { MessageMaker } from '@maddimathon/utility-typescript/classes';
import type { CLI, Config, LocalError, Stage } from '../../../../types/index.js';
import { FileSystem } from '../../../00-universal/index.js';
import { ProjectConfig } from '../../../01-config/index.js';
import { Stage_Console } from '../../../02-utils/classes/Stage_Console.js';
import { Stage_Compiler } from '../../../02-utils/classes/Stage_Compiler.js';
/**
 * Abstract class for a single build stage, along with a variety of utilities
 * for building projects.
 *
 * @category Stages
 *
 * @since 0.1.0-draft
 *
 * {@include ./AbstractStage.example.md}
 */
export declare abstract class AbstractStage<SubStage extends string = string, Args extends Stage.Args = Stage.Args> implements Stage.Class<SubStage, Args> {
    /**
     * Default values for {@link Stage.Args}.
     *
     * @category Args
     */
    static get ARGS_DEFAULT(): Stage.Args;
    /**
     * {@inheritDoc Stage.Class.clr}
     *
     * @category Args
     */
    readonly clr: MessageMaker.Colour;
    /**
     * {@inheritDoc Stage.Class.config}
     *
     * @category Args
     */
    readonly config: ProjectConfig;
    /**
     * {@inheritDoc Stage.Class.console}
     *
     * @category Utilities
     */
    readonly console: Stage_Console;
    /**
     * Instance used to compile from the src directory.
     *
     * @category Utilities
     */
    readonly cpl: Stage_Compiler;
    /**
     * Instance used to deal with files and paths.
     *
     * @category Utilities
     */
    protected readonly fs: FileSystem;
    /**
     * {@inheritDoc Stage.Class.name}
     *
     * @category Args
     */
    readonly name: string;
    /**
     * {@inheritDoc Stage.Class.params}
     *
     * @category Args
     */
    readonly params: CLI.Params;
    /**
     * {@inheritDoc Stage.Class.subStages}
     *
     * @category Args
     */
    abstract readonly subStages: SubStage[];
    /**
     * Builds a complete version of this class' args, falling back to defaults
     * as needed.
     *
     * Uses {@link mergeArgs} recursively.
     *
     * @category Args
     */
    buildArgs(args?: Partial<Args>): Args;
    /**
     * {@inheritDoc Stage.Class.args}
     *
     * @category Args
     */
    readonly args: Args;
    /**
     * {@inheritDoc Stage.Class.ARGS_DEFAULT}
     *
     * @category Args
     */
    abstract get ARGS_DEFAULT(): Args;
    /**
     * @param name    Name for this stage used for notices.
     * @param clr     Colour used for colour-coding this class.
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Partial overrides for the default stage args.
     */
    constructor(name: string, clr: MessageMaker.Colour, config: ProjectConfig, params: CLI.Params, args: Partial<Args>);
    /** {@inheritDoc Stage.Class.isSubStageIncluded} */
    isSubStageIncluded(subStage: SubStage, level: number): boolean;
    /** {@inheritDoc Stage.Class.getDistDir} */
    getDistDir(subDir?: Config.Paths.SourceDirectory): string;
    getSrcDir(subDir: Config.Paths.SourceDirectory): string[];
    getSrcDir(subDir?: undefined): string;
    protected handleError(error: any, level: number, args?: Partial<LocalError.Handler.Args>): void;
    /** {@inheritDoc Stage.Class.startEndNotice} */
    startEndNotice(which: "start" | "end" | null, watcherVersion?: boolean, stageNameOverride?: null | string): void | Promise<void>;
    /**
     * Runs the entire stage (asynchronously).
     *
     * This method should probably not be overwritten, except in completely
     * custom class implementations.
     *
     * Cycles through each substage and runs {@link AbstractStage.runSubStage}
     * if {@link AbstractStage.isSubStageIncluded} returns true.
     */
    run(): Promise<void>;
    /**
     * Runs the given stage as a sub-stage to the current one.
     *
     * **This method should probably not be overwritten.**
     *
     * @param stage   Stage to run as a substage.
     * @param level   Depth level to add to {@link CLI.Params.log-base-level | this.params['log-base-level']}.
     */
    protected runStage<S extends Stage.Name>(stage: S, level: number): Promise<void>;
    /**
     * Used to run a single stage within this class; used by
     * {@link AbstractStage.run}.
     */
    protected abstract runSubStage(subStage: SubStage): Promise<void>;
}
//# sourceMappingURL=AbstractStage.d.ts.map
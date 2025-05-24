/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type {
    CLI,
    Stage,
} from '../../../types/index.js';

import { ProjectConfig } from '../../01-config/index.js';

import { AbstractStage } from './abstract/AbstractStage.js';



/**
 * Default build stage.
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 */
export class BuildStage extends AbstractStage<
    Stage.SubStage.Build,
    Stage.Args.Build
> {



    /* PROPERTIES
     * ====================================================================== */

    public readonly subStages: Stage.SubStage.Build[] = [
        'compile',
        'minimize',
        'replace',
        'prettify',
        'test',
        'document',
    ];


    /* Args ===================================== */

    public get ARGS_DEFAULT(): Stage.Args.Build {

        return {
            ...AbstractStage.ARGS_DEFAULT,
        };
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     */
    constructor (
        config: ProjectConfig,
        params: CLI.Params,
        args: Partial<Stage.Args.Build>,
    ) {
        super( 'build', 'blue', config, params, args );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /**
     * Prints a message to the console signalling the start or end of this
     * build stage.
     *
     * @param which  Whether we are starting or ending.
     */
    public override startEndNotice( which: "start" | "end" | null ) {
        super.startEndNotice( which, !this.params.building );
    }



    /* RUNNING METHODS
     * ====================================================================== */

    protected async runSubStage( subStage: Stage.SubStage.Build ) {
        await this[ subStage ]();
    }

    /**
     * Runs the project's compile class.
     */
    protected async compile() {
        await this.runStage( 'compile', 1 );
    }

    /**
     * Runs the project's document class.
     */
    protected async document() {
        await this.runStage( 'document', 1 );
    }

    protected async minimize() {
        this.console.progress( '(NOT IMPLEMENTED) running minimize sub-stage...', 1 );
    }

    protected async prettify() {
        this.console.progress( '(NOT IMPLEMENTED) running prettify sub-stage...', 1 );
    }

    protected async replace() {
        this.console.progress( '(NOT IMPLEMENTED) running replace sub-stage...', 1 );
    }

    /**
     * Runs the project's test class.
     */
    protected async test() {
        await this.runStage( 'test', 1 );
    }
}
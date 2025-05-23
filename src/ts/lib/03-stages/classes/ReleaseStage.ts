/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type {
    CLI,
    Stage,
} from '../../../types/index.js';

import { ProjectConfig } from '../../01-config/index.js';

import { AbstractStage } from './abstract/AbstractStage.js';



/**
 * Default release stage.
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 */
export class ReleaseStage extends AbstractStage<
    Stage.SubStage.Release,
    Stage.Args.Release
> {



    /* PROPERTIES
     * ====================================================================== */

    public readonly subStages: Stage.SubStage.Release[] = [
        'changelog',
        'package',
        'replace',
        'commit',
        'github',
        'tidy',
    ];


    /* Args ===================================== */

    public get ARGS_DEFAULT(): Stage.Args.Release {

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
        args: Partial<Stage.Args.Release>,
    ) {
        super( 'release', 'purple', config, params, args );
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

    protected async runSubStage( stage: Stage.SubStage.Release ) {
        await this[ stage ]();
    }

    protected async changelog() {
        this.console.progress( '(NOT IMPLEMENTED) running changelog sub-stage...', 1 );
    }

    protected async commit() {
        this.console.progress( '(NOT IMPLEMENTED) running commit sub-stage...', 1 );
    }

    protected async github() {
        this.console.progress( '(NOT IMPLEMENTED) running github sub-stage...', 1 );
    }

    /**
     * Runs the project's package class.
     */
    protected async package() {
        await this.runStage( 'package', 1 );
    }

    protected async replace() {
        this.console.progress( '(NOT IMPLEMENTED) running replace sub-stage...', 1 );
    }

    protected async tidy() {
        this.console.progress( '(NOT IMPLEMENTED) running tidy sub-stage...', 1 );
    }
}
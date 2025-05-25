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

import type { Node } from '@maddimathon/utility-typescript/types';

import type {
    CLI,
    Stage,
} from '../../../types/index.js';

import { ProjectConfig } from '../../01-config/index.js';

import { AbstractStage } from './abstract/AbstractStage.js';
import { SemVer } from '../../@internal.js';



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
     * @param config    Complete project configuration.
     * @param params    Current CLI params.
     * @param args      Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor (
        config: ProjectConfig,
        params: CLI.Params,
        args: Partial<Stage.Args.Build>,
        _pkg?: Node.PackageJson,
        _version?: SemVer,
    ) {
        super( 'build', 'blue', config, params, args, _pkg, _version );
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
        return super.startEndNotice( which, !this.params.packaging );
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
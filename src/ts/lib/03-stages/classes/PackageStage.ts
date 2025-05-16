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

import type { Test } from '@maddimathon/utility-typescript/types';
// import { typeOf } from '@maddimathon/utility-typescript/functions';

import type {
    CLI,
    // Config,
    Stage,
} from '../../../types/index.js';

import { ProjectConfig } from '../../01-config/index.js';

import { AbstractStage } from './abstract/AbstractStage.js';



/**
 * Default package stage.
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 */
export class PackageStage extends AbstractStage<
    Stage.SubStage.Package,
    Stage.Args.Package
> {



    /* PROPERTIES
     * ====================================================================== */

    public readonly subStages: Stage.SubStage.Package[] = [
        'snapshot',
        'build',
        'copy',
        'zip',
    ];


    /* Args ===================================== */

    public get ARGS_DEFAULT(): Stage.Args.Package {

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
        args?: Partial<Stage.Args.Package>,
    ) {
        super( 'package', params?.releasing ? 'orange' : 'purple', config, params, args );
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

    protected async runSubStage( stage: Stage.SubStage.Package ) {
        await this[ stage ]();
    }

    /**
     * Runs the project's build class.
     */
    protected async build() {
        await this.runStage( 'build', 1 );
    }

    protected async copy() {
        this.log.progress( '(NOT IMPLEMENTED) running copy sub-stage...', 1 );
    }

    /**
     * Runs the project's snapshot class.
     */
    protected async snapshot() {
        await this.runStage( 'snapshot', 1 );
    }

    protected async zip() {
        this.log.progress( '(NOT IMPLEMENTED) running zip sub-stage...', 1 );
    }
}


/*
 * TYPE TESTING 
 */

type PackageClassType = Stage.ClassType.All[ 'package' ];

const typeTest: PackageClassType = PackageStage;

type TypeTest = Test.Expect<Test.Satisfies<typeof PackageStage, PackageClassType>>;

// only so that these are used
true as TypeTest;
typeTest;
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

import type {
    CLI,
    Stage,
} from '../../../types/index.js';

import { ProjectConfig } from '../../01-config/index.js';

import { AbstractStage } from './abstract/AbstractStage.js';



/**
 * Default snapshot stage.
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 */
export class SnapshotStage extends AbstractStage<
    Stage.SubStage.Snapshot,
    Stage.Args.Snapshot
> {



    /* PROPERTIES
     * ====================================================================== */

    public readonly subStages: Stage.SubStage.Snapshot[] = [
        'snap',
    ];


    /* Args ===================================== */

    public get ARGS_DEFAULT(): Stage.Args.Snapshot {

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
        args?: Partial<Stage.Args.Snapshot>,
    ) {
        super( 'snapshot', 'pink', config, params, args );
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

    protected async runSubStage( stage: Stage.SubStage.Snapshot ) {
        await this[ stage ]();
    }

    protected async snap() {
        this.log.progress( '(NOT IMPLEMENTED) running snap sub-stage...', 1 );
    }
}


/*
 * TYPE TESTING 
 */

type SnapshotClassType = Stage.ClassType.All[ 'snapshot' ];

const typeTest: SnapshotClassType = SnapshotStage;

type TypeTest = Test.Expect<Test.Satisfies<typeof SnapshotStage, SnapshotClassType>>;

// only so that these are used
true as TypeTest;
typeTest;
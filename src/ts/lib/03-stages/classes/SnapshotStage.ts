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
     * @param _pkg    The current package.json value, if any.
     */
    constructor (
        config: ProjectConfig,
        params: CLI.Params,
        args: Partial<Stage.Args.Snapshot>,
        _pkg?: Node.PackageJson,
    ) {
        super( 'snapshot', 'pink', config, params, args, _pkg );
    }



    /* LOCAL METHODS
     * ====================================================================== */



    /* RUNNING METHODS
     * ====================================================================== */

    protected async runSubStage( subStage: Stage.SubStage.Snapshot ) {
        await this[ subStage ]();
    }

    protected async snap() {
        this.console.progress( 'running snap sub-stage...', 1 );

        await this._copy();
        await this._zip();
        await this._tidy();
    }

    protected async _copy() {
        this.console.progress( '(NOT IMPLEMENTED) copying files...', 2 );
    }

    protected async _zip() {
        this.console.progress( '(NOT IMPLEMENTED) zipping folder...', 2 );
    }

    protected async _tidy() {
        this.console.progress( '(NOT IMPLEMENTED) deleting snapshot folder...', 2 );
    }
}
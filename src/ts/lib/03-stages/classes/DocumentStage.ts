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
 */;

import type { Node } from '@maddimathon/utility-typescript/types';

import type {
    CLI,
    Stage,
} from '../../../types/index.js';

import { SemVer } from '../../@internal/index.js';

import { ProjectConfig } from '../../01-config/index.js';

import { AbstractStage } from './abstract/AbstractStage.js';



/**
 * Default package stage.
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 */
export class DocumentStage extends AbstractStage<Stage.SubStage.Document, Stage.Args.Document> {



    /* PROPERTIES
     * ====================================================================== */

    public readonly subStages: Stage.SubStage.Document[] = [
    ];


    /* Args ===================================== */

    public override get ARGS_DEFAULT() {

        return {
            ...AbstractStage.ARGS_DEFAULT,
        } as const satisfies Stage.Args.Document;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor (
        config: ProjectConfig,
        params: CLI.Params,
        args: Partial<Stage.Args.Document>,
        _pkg?: Node.PackageJson,
        _version?: SemVer,
    ) {
        super( 'document', 'turquoise', config, params, args, _pkg, _version );
    }



    /* LOCAL METHODS
     * ====================================================================== */



    /* RUNNING METHODS
     * ====================================================================== */

    protected async runSubStage( subStage: Stage.SubStage.Document ) {
        await this[ subStage ]();
    }

    protected async typeDoc() {
        this.console.progress( '(NOT IMPLEMENTED) running typeDoc sub-stage...', 1 );
    }
}
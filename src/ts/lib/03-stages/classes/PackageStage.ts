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
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor (
        config: ProjectConfig,
        params: CLI.Params,
        args: Partial<Stage.Args.Package>,
        _pkg?: Node.PackageJson,
        _version?: SemVer,
    ) {
        super( 'package', params?.releasing ? 'orange' : 'purple', config, params, args, _pkg, _version );
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

        const version = this.version.toString( this.isDraftVersion );

        // returns
        switch ( which ) {

            case 'start':
                this.console.startOrEnd( [
                    [ 'PACKAGING...' ],
                    [ `${ this.pkg.name }@${ version }`, { flag: 'reverse' } ],
                ], which );
                return;

            case 'end':
                this.console.startOrEnd( [
                    [ '✓ ', { flag: false } ],
                    [ 'Packaged!', { italic: true } ],
                    [ `${ this.pkg.name }@${ version }`, { flag: 'reverse' } ],
                ], which );
                return;
        }

        return super.startEndNotice( which, false );
    }



    /* RUNNING METHODS
     * ====================================================================== */

    protected async runSubStage( subStage: Stage.SubStage.Package ) {
        await this[ subStage ]();
    }

    /**
     * Runs the project's build class.
     */
    protected async build() {
        await this.runStage( 'build', 1 );
    }

    protected async copy() {
        this.console.progress( '(NOT IMPLEMENTED) running copy sub-stage...', 1 );
    }

    /**
     * Runs the project's snapshot class.
     */
    protected async snapshot() {
        await this.runStage( 'snapshot', 1 );
    }

    protected async zip() {
        this.console.progress( '(NOT IMPLEMENTED) running zip sub-stage...', 1 );
    }
}
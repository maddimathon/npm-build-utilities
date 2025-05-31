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

import {
    SemVer,
} from '../../@internal/index.js';

import {
    ProjectConfig,
} from '../../01-config/index.js';

import { AbstractStage } from './abstract/AbstractStage.js';



/**
 * Default package stage.
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 */
export class TestStage extends AbstractStage<Stage.SubStage.Test, Stage.Args.Test> {



    /* PROPERTIES
     * ====================================================================== */

    public readonly subStages: Stage.SubStage.Test[] = [
        'js',
        'scss',
    ];


    /* Args ===================================== */

    public get ARGS_DEFAULT() {

        return {
            ...AbstractStage.ARGS_DEFAULT,

            js: {
                tidy: [
                    'dist/js/**/*.test.d.ts',
                    'dist/js/**/*.test.d.ts.map',
                    'dist/js/**/*.test.js',
                    'dist/js/**/*.test.js.map',
                ],
            },

            scss: false,

        } as const satisfies Stage.Args.Test;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    protected testStatus: boolean = false;

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
        args: Partial<Stage.Args.Test>,
        _pkg?: Node.PackageJson,
        _version?: SemVer,
    ) {
        super( 'tests', 'red', config, params, args, _pkg, _version );
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

        // returns
        switch ( which ) {

            case 'end':
                this.console.startOrEnd( [
                    [ `${ this.testStatus ? '✓' : '❌' } `, { flag: false } ],
                    [ `Tests ${ this.testStatus ? 'Complete' : 'FAILED' }!`, { italic: true } ],
                ], which );
                return;
        }

        return super.startEndNotice( which, false );
    }



    /* RUNNING METHODS
     * ====================================================================== */

    protected async runSubStage( subStage: Stage.SubStage.Test ) {
        await this[ subStage ]();
    }

    protected async scss() {
        if ( !this.args.scss ) { return; }
        this.console.progress( '(NOT IMPLEMENTED) running scss sub-stage...', 1 );
    }

    protected async js() {
        if ( !this.args.js ) { return; }
        this.console.progress( 'running jest...', 1 );

        const result = this.try(
            this.console.nc.cmd,
            2,
            [ 'node --experimental-vm-modules --no-warnings node_modules/jest/bin/jest.js' ],
            {},
            ( this.params.packaging && !this.params.dryrun ),
        );

        this.testStatus = result !== 'FAILED';

        if ( this.params.releasing || this.params.packaging ) {
            this.console.verbose( 'removing test files from dist...', 2 );
            this.fs.delete( this.args.js.tidy, ( this.params.verbose ? 3 : 2 ) );
        }
    }
}
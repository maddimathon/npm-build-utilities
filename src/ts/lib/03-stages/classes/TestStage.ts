/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */;

import type {
    Json,
} from '@maddimathon/utility-typescript/types';

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
export class TestStage extends AbstractStage<
    Stage.Args.Test,
    Stage.SubStage.Test
> {



    /* PROPERTIES
     * ====================================================================== */

    public readonly subStages: Stage.SubStage.Test[] = [
        'js',
        'scss',
    ];


    /* Args ===================================== */

    public get ARGS_DEFAULT() {

        return {
            utils: {},

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

    /**
     * Whether any tests being run have passed.
     * 
     * Reset to `false` in {@link TestStage.startEndNotice}.
     * 
     * @category Sub-Stages
     */
    protected testStatus: boolean = false;

    /**
     * @category Constructor
     * 
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param args     Partial overrides for the default args.
     * @param pkg      Parsed contents of the project’s package.json file.
     * @param version  Version object for the project’s version.
     */
    constructor (
        config: ProjectConfig,
        params: CLI.Params,
        args: Partial<Stage.Args.Test>,
        pkg?: Json.PackageJson,
        version?: SemVer,
    ) {
        super( 'tests', 'red', config, params, args, pkg, version );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    public override startEndNotice( which: "start" | "end" | null ) {

        // returns for end
        switch ( which ) {

            case 'start':
                this.testStatus = false;
                break;

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

    /**
     * Not implemented.
     * 
     * @category Sub-Stages
     */
    protected async scss() {
        if ( !this.args.scss ) { return; }
        this.console.progress( '(NOT IMPLEMENTED) running scss sub-stage...', 1 );
    }

    /**
     * Runs jest for javascript testing.
     * 
     * @category Sub-Stages
     */
    protected async js() {
        if ( !this.args.js ) { return; }
        this.console.progress( 'running jest...', 1 );

        const result = this.try(
            this.console.nc.cmd,
            2,
            [ 'node --experimental-vm-modules --no-warnings node_modules/jest/bin/jest.js' ],
            {
                exitProcess: this.params.packaging && !this.params.dryrun,
            },
        );

        this.testStatus = result !== 'FAILED';

        if ( this.params.releasing || this.params.packaging ) {
            this.console.verbose( 'removing test files from dist...', 2 );
            this.fs.delete( this.args.js.tidy, ( this.params.verbose ? 3 : 2 ) );
        }
    }
}
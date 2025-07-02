/**
 * @since 0.1.0-alpha
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
    Config,
    Stage,
} from '../../../types/index.js';

import {
    SemVer,
} from '../../@internal/index.js';

// import {
// } from '../../01-config/index.js';

// import {
// } from '../../02-utils/index.js';
import { Stage_Compiler } from '../../02-utils/classes/Stage_Compiler.js';

import { AbstractStage } from './abstract/AbstractStage.js';



/**
 * Default package stage.
 * 
 * @category Stages
 * 
 * @since 0.1.0-alpha
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

    /**
     * Default values for {@link Stage.Args.Test | Stage.Args.Test.js.tidy}.
     * 
     * These default values are made using
     * {@link Stage_Compiler.getTsConfigPaths} and
     * {@link Stage_Compiler.getTsConfigOutDir}.  Assumes that tests match the
     * globs `**\/*.test.js` and should be deleted with any maps and type
     * definitions.
     * 
     * @category Config
     * 
     * @param level  Depth level for output to the console.
     *
     * @since ___PKG_VERSION___
     */
    protected async tsConfigTidyPaths( level: number ): Promise<string[]> {

        const tsconfigPaths = await Stage_Compiler.getTsConfigPaths( this, level, false );

        return tsconfigPaths.map( ( _tsconfig ) => {

            const _outDir = this.compiler.getTsConfigOutDir( _tsconfig, level, false );

            // returns
            if ( !_outDir ) {
                return [];
            }

            return [
                this.fs.pathResolve( _outDir, '**/*.test.d.ts' ),
                this.fs.pathResolve( _outDir, '**/*.test.d.ts.map' ),
                this.fs.pathResolve( _outDir, '**/*.test.js' ),
                this.fs.pathResolve( _outDir, '**/*.test.js.map' ),
            ];
        } ).flat();
    }

    public get ARGS_DEFAULT() {

        return {
            js: {},
            scss: false,
            utils: {},
        } as const satisfies Stage.Args.Test;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * Whether any tests being run have passed.
     * 
     * Reset to empty array in {@link TestStage.startEndNotice}.
     * 
     * @category Sub-Stages
     * 
     * @since ___PKG_VERSION___ — Converted from boolean to boolean[].
     */
    protected testResults: boolean[] = [];

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
        config: Config.Class,
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
                this.testResults = [];
                break;

            case 'end':

                const _allTestsSucceeded = !this.testResults.length
                    || this.testResults.every( _val => _val );

                this.console.startOrEnd( [
                    [ `${ _allTestsSucceeded ? '✓' : '❌' } `, { flag: false } ],
                    [ `Tests ${ _allTestsSucceeded ? 'Complete' : 'FAILED' }!`, { italic: true } ],
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

        this.testResults.push( result !== 'FAILED' );

        this.console.verbose( 'tidying up...', 2 );

        const tidyFiles = this.args.js.tidy ?? await this.tsConfigTidyPaths( this.params.verbose ? 3 : 2 );

        if (
            ( this.params.releasing || this.params.packaging )
            && tidyFiles.length
        ) {
            this.console.verbose( 'deleting...', 3 );
            this.fs.delete( tidyFiles, this.params.verbose ? 4 : 3 );
        }
    }
}
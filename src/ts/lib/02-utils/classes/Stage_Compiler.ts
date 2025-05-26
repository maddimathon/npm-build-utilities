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

// import type typescript from 'typescript';

import * as sass from 'sass';

import type { Json } from '@maddimathon/utility-typescript/types';

import type {
    CLI,
    Stage,
} from '../../../types/index.js';

import {
    ProjectError,
} from '../../@internal/index.js';

import {
    catchOrReturn,
    FileSystem,
} from '../../00-universal/index.js';

import {
    ProjectConfig,
} from '../../01-config/index.js';

import type { Stage_Console } from './Stage_Console.js';


/**
 * To be used by {@link AbstractStage} and those that inherit from it.
 *
 * Includes a variety of utilities for compiling files (like scss and
 * typescript).
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 * 
 * @internal
 */
export class Stage_Compiler implements Stage.Compiler {



    /* LOCAL PROPERTIES
     * ====================================================================== */


    /* Args ===================================== */

    /**
     * Default values for the args property.
     * 
     * @category Args
     */
    protected get ARGS_DEFAULT() {

        return {
        } as const satisfies Stage_Compiler.Args;
    }

    /**
     * A completed args object.
     * 
     * @category Args
     */
    public readonly args: Stage_Compiler.Args;



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param console  Instance used to send messages to the console.
     * @param fs       Instance used to work with paths and files.
     * @param args     Partial overrides for the default args.
     */
    constructor (
        public readonly config: ProjectConfig,
        public readonly params: CLI.Params,
        public readonly console: Stage_Console,
        public readonly fs: FileSystem,
        args: Partial<Stage_Compiler.Args> = {},
    ) {
        this.args = {
            ...this.ARGS_DEFAULT,
            ...args,
        };
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /**
     * Compiles scss using the 
     * {@link https://www.npmjs.com/package/sass | sass npm package}.
     * 
     * @param input   Scss input path.
     * @param output  Scss output path.
     * @param level   Depth level for this message (above the value of 
     *                {@link CLI.Params.log-base-level}).
     */
    public async scss(
        input: string,
        output: string,
        level: number,
        sassOpts?: sass.Options<"sync">,
    ): Promise<void> {
        this.console.vi.debug( { 'Stage_Compiler.scss() params': { input, output, level, sassOpts } }, level, { bold: true } );

        const compiled = sass.compile( input, {
            ...this.config.compiler?.sass,
            ...sassOpts,
        } );

        this.params.debug && this.console.vi.verbose( { compiled }, level );

        if ( compiled.css ) {
            this.console.verbose( 'writing css to path: ' + output, level );
            this.fs.write( output, compiled.css, { force: true } );
        }

        if ( compiled.sourceMap ) {

            const sourceMap = output.replace( /\.(s?css)$/g, '.$1.map' );

            this.console.verbose( 'writing sourceMap to path: ' + sourceMap, level );
            this.fs.write(
                sourceMap,
                JSON.stringify(
                    compiled.sourceMap,
                    null,
                    this.params.packaging ? 0 : 4,
                ),
                { force: true }
            );
        }
    }

    /**
     * Compiles typescript using the 
     * {@link https://www.npmjs.com/package/sass | sass npm package}.
     * 
     * @throws {@link ProjectError}  If the tsconfig file doesn’t exist.
     * 
     * @param tsConfig  Path to TS config json used to compile the project.
     * @param level     Depth level for this message (above the value of 
     *                  {@link (root).CLI.Params.log-base-level}).
     */
    public async typescript(
        tsConfig: string,
        level: number,
    ): Promise<void> {
        this.console.verbose( 'running tsc...', 0 + level );

        // throws
        if ( !this.fs.exists( tsConfig ) ) {

            throw new ProjectError(
                'tsConfig path does not exist: ' + tsConfig,
                {
                    class: 'Stage_Compiler',
                    method: 'typescript',
                },
            );
        }

        // throws
        if ( !this.fs.isFile( tsConfig ) ) {

            throw new ProjectError(
                'tsConfig path was not a file: ' + tsConfig,
                {
                    class: 'Stage_Compiler',
                    method: 'typescript',
                },
            );
        }

        let config_obj = JSON.parse( this.fs.readFile( tsConfig ) ) as Partial<Json.TsConfig> | string;

        if (
            typeof config_obj === 'object'
            && config_obj?.compilerOptions?.noEmit !== true
            && config_obj?.compilerOptions?.outDir
        ) {
            const _output = this.fs.pathResolve(
                this.fs.dirname( tsConfig ),
                config_obj.compilerOptions.outDir,
                '*',
            );

            this.console.debug(
                'deleting existing files from ' + this.fs.pathRelative( _output ).replace( ' ', '%20' ) + ' ...',
                ( this.params.verbose ? 1 : 0 ) + level
            );
            this.fs.delete( [ _output ], ( this.params.verbose ? 2 : 0 ) + level + this.console.params[ 'log-base-level' ] );
        }

        catchOrReturn(
            this.console.nc.cmd,
            1 + level,
            this.console,
            this.fs,
            [ `tsc --project "${ this.fs.pathRelative( tsConfig ).replace( /"/g, '\\"' ) }"` ],
        );
    }
}

/**
 * Used only for {@link Stage_Compiler}.
 * 
 * @category Class-Helpers
 */
export namespace Stage_Compiler {

    /**
     * Optional configuration for {@link Stage_Compiler}.
     * 
     * @since ___PKG_VERSION___
     */
    export interface Args { };
}
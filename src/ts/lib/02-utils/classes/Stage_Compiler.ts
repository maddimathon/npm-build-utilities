/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import * as sass from 'sass';

import type {
    Json,
} from '@maddimathon/utility-typescript/types';

import {
    mergeArgs,
} from '@maddimathon/utility-typescript/functions';

import type {
    CLI,
    Config,
    Stage,
} from '../../../types/index.js';

import {
    StageError,
} from '../../@internal/index.js';

import {
    catchOrReturn,
    FileSystem,
} from '../../00-universal/index.js';

// import {
// } from '../../01-config/index.js';

import type { Stage_Console } from './Stage_Console.js';


/**
 * To be used by {@link AbstractStage} and those that inherit from it.
 *
 * Includes a variety of utilities for compiling files (like scss and
 * typescript).
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export class Stage_Compiler implements Stage.Compiler {



    /* LOCAL PROPERTIES
     * ====================================================================== */

    public get tsConfig() {

        const tsSrcDir = this.config.getSrcDir( this.fs, 'ts' )[ 0 ];

        const baseUrl = tsSrcDir.replace( /(?<=^|\/)[^\/]+(\/|$)/g, '..\/' );

        const outDir = this.fs.pathRelative( this.fs.pathResolve(
            baseUrl,
            this.config.getDistDir( this.fs ),
            'ts',
        ) );

        return {

            extends: '@maddimathon/build-utilities/tsconfig',

            exclude: [
                '**/node_modules/**/*',
            ],

            compilerOptions: {
                exactOptionalPropertyTypes: false,
                outDir,
                baseUrl,
            },
        } as const satisfies Json.TsConfig;
    }


    /* Args ===================================== */

    public get ARGS_DEFAULT() {

        return {

            sass: {
                charset: true,
                sourceMap: true,
                sourceMapIncludeSources: true,
                style: 'expanded',
            },

            ts: {},

        } as const satisfies Stage.Compiler.Args;
    }

    public readonly args: Stage.Compiler.Args;



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param console  Instance used to log messages and debugging info.
     * @param fs       Instance used to work with paths and files.
     */
    constructor (
        protected readonly config: Config.Class,
        protected readonly params: CLI.Params,
        protected readonly console: Stage_Console,
        protected readonly fs: FileSystem,
    ) {
        this.args = {
            ...this.ARGS_DEFAULT,
            ...config.compiler,
        };

        this.scss = this.scss.bind( this );
        this.typescript = this.typescript.bind( this );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    public async scss(
        input: string,
        output: string,
        level: number,
        sassOpts?: sass.Options<"sync">,
    ): Promise<void> {
        this.console.vi.debug( { 'Stage_Compiler.scss() params': { input, output, level, sassOpts } }, level, { bold: true } );

        sassOpts = mergeArgs( this.args.sass, sassOpts, true );
        sassOpts = {
            ...sassOpts,

            importers: [
                ...sassOpts.importers ?? [],
                new sass.NodePackageImporter(),
            ],
        };

        const compiled = sass.compile( input, {
            ...sassOpts,
        } );

        this.params.debug && this.console.vi.verbose( { compiled }, level );

        if ( compiled.css ) {
            this.console.verbose( 'writing css to path: ' + this.fs.pathRelative( output ), level, { maxWidth: null } );
            this.fs.write( output, compiled.css, { force: true } );
        }

        if ( compiled.sourceMap ) {

            const sourceMap = output.replace( /\.(s?css)$/g, '.$1.map' );

            this.params.debug && this.console.verbose( 'writing sourceMap to path: ' + this.fs.pathRelative( sourceMap ), 1 + level );
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

    public async typescript(
        tsConfig: string,
        level: number,
    ): Promise<void> {
        this.console.verbose( 'running tsc...', 0 + level );

        // throws
        if ( !this.fs.exists( tsConfig ) ) {

            throw new StageError(
                'tsConfig path does not exist: ' + tsConfig,
                {
                    class: 'Stage_Compiler',
                    method: 'typescript',
                },
            );
        }

        // throws
        if ( !this.fs.isFile( tsConfig ) ) {

            throw new StageError(
                'tsConfig path was not a file: ' + tsConfig,
                {
                    class: 'Stage_Compiler',
                    method: 'typescript',
                },
            );
        }

        let config_obj = JSON.parse( this.fs.readFile( tsConfig ) ) as Partial<Json.TsConfig> | string;

        const outDir = (
            typeof config_obj === 'object'
            && config_obj.compilerOptions?.noEmit !== true
            && config_obj.compilerOptions?.outDir
        )
            && this.fs.pathResolve(
                this.fs.dirname( tsConfig ),
                config_obj.compilerOptions.outDir,
            ).replace( /\/+$/gi, '' )
            || false;

        if ( outDir ) {
            this.console.debug(
                'deleting existing files from ' + this.fs.pathRelative( outDir ).replace( ' ', '%20' ) + ' ...',
                ( this.params.verbose ? 1 : 0 ) + level
            );
            this.fs.delete(
                outDir + '/*',
                ( this.params.debug ? 1 : 0 ) + ( this.params.verbose ? 1 : 0 ) + level,
            );
        }

        catchOrReturn(
            this.console.nc.cmd,
            1 + level,
            this.console,
            this.fs,
            [ `tsc --project "${ this.fs.pathRelative( tsConfig ).replace( /"/g, '\\"' ) }"` ],
        );

        if ( outDir && this.args.ts.tidyGlobs?.length ) {
            this.console.verbose( 'tidying compiled files...', 0 + level );

            const _globs = (
                Array.isArray( this.args.ts.tidyGlobs )
                    ? this.args.ts.tidyGlobs
                    : [ this.args.ts.tidyGlobs ]
            ).map(
                _glob => this.fs.pathResolve( outDir, _glob )
            );

            this.console.vi.debug(
                { tidyGlobs: _globs },
                ( this.params.verbose ? 1 : 0 ) + level
            );

            this.fs.delete(
                _globs,
                ( this.params.debug ? 1 : 0 ) + ( this.params.verbose ? 1 : 0 ) + level,
            );
        }
    }
}
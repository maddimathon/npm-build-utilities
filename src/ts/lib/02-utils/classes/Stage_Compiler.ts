/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import postcss from 'postcss';
import * as postcss_PresetEnv from 'postcss-preset-env';

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



    /* STATIC
     * ====================================================================== */

    /**
     * Gets paths to tsconfig files according to the project configuration.
     * 
     * If none is found, a console prompt asks to write a default file.
     * 
     * @param stage            Current stage being run.
     * @param level            Depth level for output to the console.
     * @param writeIfNotFound  Whether to prompt (via console) to write a new tsconfig file if none are found.
     * 
     * @since 0.2.0-alpha
     */
    public static async getTsConfigPaths(
        stage: Stage,
        level: number,
        writeIfNotFound: boolean = true,
    ): Promise<string[]> {
        const tsSrcDirs = stage.getSrcDir( 'ts' );

        const tsPaths = tsSrcDirs.map( ( path ) => {
            // returns
            if ( !stage.fs.exists( path ) ) {
                stage.console.verbose( 'ⅹ configured ts source path not found: ' + path, level, { italic: true } );
                return [];
            }

            // returns
            if ( !stage.fs.isDirectory( path ) ) {
                stage.console.verbose( '✓ configured ts source path found: ' + path, level, { italic: true } );
                return path;
            }

            stage.console.verbose( 'configured ts source path is a directory: ' + stage.fs.pathRelative( path ), level, { italic: true } );

            const testSubPaths = [
                'tsconfig.json',
                'tsConfig.json',
                '../tsconfig.json',
                '../tsConfig.json',
            ];

            for ( const subPath of testSubPaths ) {

                const fullPath = stage.fs.pathResolve( path, subPath );

                // returns
                if ( stage.fs.exists( fullPath ) && stage.fs.isFile( fullPath ) ) {
                    const relativePath = stage.fs.pathRelative( fullPath );
                    stage.console.verbose( '✓ default sub-file found: ' + relativePath, 1 + level, { italic: true } );
                    return relativePath;
                }
            }

            stage.console.verbose( 'ⅹ no default files found', 1 + level );
            return [];
        } ).flat();

        stage.console.vi.debug( { tsPaths }, ( stage.params.verbose ? 1 : 0 ) + level );

        // returns
        if ( tsPaths.length || !writeIfNotFound ) {
            return tsPaths;
        }

        const msgArgs = {
            depth: level + stage.params[ 'log-base-level' ],
        };

        // returns
        if ( !await stage.console.nc.prompt.bool( {
            message: 'No tsconfig.json files found, do you want to create one?',

            default: true,
            msgArgs: {
                ...msgArgs,
                linesIn: 1,
            },
        } ) ) {
            return [];
        }

        const tsSrcDir = stage.getSrcDir( 'ts' )[ 0 ];

        const _tsConfigDefaultPath = stage.fs.pathRelative( stage.fs.pathResolve(
            tsSrcDir,
            './tsconfig.json'
        ) );

        const tsConfigFile = await stage.console.nc.prompt.input( {
            message: 'Where should the tsconfig.json be written?',

            default: _tsConfigDefaultPath,
            msgArgs: {
                ...msgArgs,
                linesOut: 1,
            },
            required: true,
        } );

        stage.console.vi.debug( { tsConfigFile }, 3 );

        // returns
        if ( !tsConfigFile ) {
            return [];
        }

        const baseUrl = tsSrcDir.replace( /(?<=^|\/)[^\/]+(\/|$)/g, '..\/' );

        stage.console.vi.debug( { baseUrl }, 2 );

        const outDir = stage.fs.pathRelative( stage.fs.pathResolve(
            baseUrl,
            stage.getDistDir(),
            'js',
        ) );

        stage.console.vi.debug( { outDir }, 2 );

        const _writeResult = stage.fs.write(
            stage.fs.pathResolve( tsConfigFile ),
            JSON.stringify( stage.compiler.tsConfig, null, 4 ),
            { force: true },
        );

        // returns
        if ( !_writeResult ) {
            stage.console.verbose( 'ⅹ error writing new tsconfig file', 3 );
            return [];
        }

        return [ tsConfigFile ];
    }

    /**
     * Default configuration for working with PostCSS.
     * 
     * @since 0.2.0-alpha
     */
    public static get postCssConfig() {

        const features = {
            'all-property': false,
            'any-link-pseudo-class': false,
            'blank-pseudo-class': false,
            'break-properties': true,
            'cascade-layers': true,
            'case-insensitive-attributes': true,
            'clamp': { preserve: true },
            'color-function': { preserve: true },
            'color-functional-notation': false,
            'color-mix': false,
            'color-mix-variadic-function-arguments': false,
            'content-alt-text': { preserve: true },
            'custom-media-queries': false,
            'custom-properties': { preserve: true },
            'custom-selectors': false,
            'dir-pseudo-class': false,
            'display-two-values': false,
            'double-position-gradients': true,
            'exponential-functions': true,
            'float-clear-logical-values': true,
            'focus-visible-pseudo-class': false,
            'focus-within-pseudo-class': false,
            'font-format-keywords': false,
            'font-variant-property': false,
            'gamut-mapping': false,
            'gap-properties': true,
            'gradients-interpolation-method': false,
            'has-pseudo-class': false,
            'hexadecimal-alpha-notation': true,
            'hwb-function': true,
            'ic-unit': false,
            'image-set-function': false,
            'is-pseudo-class': false,
            'lab-function': { preserve: true },
            'light-dark-function': false,
            'logical-overflow': true,
            'logical-overscroll-behavior': true,
            'logical-properties-and-values': true,
            'logical-resize': true,
            'logical-viewport-units': true,
            'media-queries-aspect-ratio-number-values': false,
            'media-query-ranges': true,
            'nested-calc': true,
            'nesting-rules': true,
            'not-pseudo-class': false,
            'oklab-function': { preserve: true },
            'opacity-percentage': true,
            'overflow-property': true,
            'overflow-wrap-property': false,
            'place-properties': true,
            'prefers-color-scheme-query': false,
            'random-function': false,
            'rebeccapurple-color': true,
            'relative-color-syntax': false,
            'scope-pseudo-class': false,
            'sign-functions': false,
            'stepped-value-functions': false,
            'system-ui-font-family': false,
            'text-decoration-shorthand': false,
            'trigonometric-functions': false,
            'unset-value': { preserve: true },
        } as const satisfies Required<postcss_PresetEnv.pluginsOptions>;

        const presetEnv = {

            features,

            logical: {
                blockDirection: 'top-to-bottom' as postcss_PresetEnv.DirectionFlow.TopToBottom,
                inlineDirection: 'left-to-right' as postcss_PresetEnv.DirectionFlow.LeftToRight,
            } satisfies Required<Required<postcss_PresetEnv.pluginOptions>[ 'logical' ]>,

            stage: false,

        } as const satisfies postcss_PresetEnv.pluginOptions;

        return {
            presetEnv,
            processor: {
                map: false,
            },
        } as const satisfies Stage.Compiler.Args.PostCSS;
    }



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

            /**
             * This is the value of the {@link Stage_Compiler.postCssConfig}
             * static accessor.
             */
            postCSS: Stage_Compiler.postCssConfig as Stage.Compiler.Args.PostCSS,

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
        this.args = mergeArgs(
            this.ARGS_DEFAULT as Stage.Compiler.Args,
            config.compiler,
            true
        );

        this.postCSS = this.postCSS.bind( this );
        this.scss = this.scss.bind( this );
        this.typescript = this.typescript.bind( this );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /**
     * Gets the value of the given tsconfig file.
     * 
     * @throws {@link StageError}  If the tsconfig file doesn’t exist and errorIfNotFound is truthy.
     * 
     * @param tsconfig         Path to TS config json used to compile the project.
     * @param level            Depth level for this message.
     * @param errorIfNotFound  Whether to throw an error if tsconfig is not found.
     * 
     * @since 0.2.0-alpha
     */
    public getTsConfig(
        tsconfig: string,
        level: number,
        errorIfNotFound: boolean = true,
    ): Partial<Json.TsConfig> {
        this.console.verbose( 'getting tsconfig value...', level );

        // throws or returns
        if ( !this.fs.exists( tsconfig ) ) {

            if ( errorIfNotFound ) {
                throw new StageError(
                    'tsconfig path does not exist: ' + tsconfig,
                    {
                        class: 'Stage_Compiler',
                        method: 'typescript',
                    },
                );
            }

            return {};
        }

        // throws or returns
        if ( !this.fs.isFile( tsconfig ) ) {

            if ( errorIfNotFound ) {
                throw new StageError(
                    'tsconfig path was not a file: ' + tsconfig,
                    {
                        class: 'Stage_Compiler',
                        method: 'typescript',
                    },
                );
            }

            return {};
        }

        const config_obj = JSON.parse( this.fs.readFile( tsconfig ) ) as Partial<Json.TsConfig> | string;

        // returns
        if ( typeof config_obj === 'object' ) {
            return config_obj;
        }

        return {};
    }

    /**
     * Gets the value of the given tsconfig file.
     * 
     * @throws {@link StageError}  If the tsconfig file doesn’t exist and errorIfNotFound is truthy.
     * 
     * @param tsconfig         Path to TS config json.
     * @param level            Depth level for this message.
     * @param errorIfNotFound  Whether to throw an error if tsconfig is not found.
     * 
     * @since 0.2.0-alpha
     */
    public getTsConfigOutDir(
        tsconfig: string | Partial<Json.TsConfig> & { path: string; },
        level: number,
        errorIfNotFound: boolean = true,
    ) {
        const config_obj = typeof tsconfig === 'string'
            ? {
                ...this.getTsConfig( tsconfig, level, errorIfNotFound ),
                path: tsconfig,
            }
            : tsconfig;

        return (
            config_obj.compilerOptions?.noEmit !== true
            && config_obj.compilerOptions?.outDir
            && this.fs.pathResolve(
                this.fs.dirname( config_obj.path ),
                config_obj.compilerOptions.outDir,
            ).replace( /\/+$/gi, '' )
            || false
        );
    }

    public async postCSS(
        paths: {
            from: string,
            to?: string,
        }[],
        level: number,
        _postCssOpts: Stage.Compiler.Args.PostCSS = {},
    ): Promise<void> {

        const postCssOpts = mergeArgs( this.args.postCSS, _postCssOpts, true );

        const plugins = postCssOpts.plugins ?? [];

        if ( postCssOpts.presetEnv ) {
            plugins.push( postcss_PresetEnv.default( {
                ...postCssOpts.presetEnv,
                debug: this.params.debug,
            } ) );
        }

        const inst = postcss( plugins );

        await Promise.all( paths.map(
            ( { from, to } ) => {

                // returns
                if ( !this.fs.exists( from ) ) {
                    return;
                }

                const _css = this.fs.readFile( from );

                const _outputPath = to ?? from;

                return inst.process( _css, {
                    from,
                    to: _outputPath,
                    ...postCssOpts.processor,
                } ).then( ( _result ) => {

                    this.fs.write(
                        _outputPath,
                        _result.css,
                        { force: true, rename: false },
                    );

                    if ( _result.map ) {

                        const _mapPath = _outputPath.replace( /\.css$/gi, '.css.map' );

                        if ( _outputPath != _mapPath ) {

                            this.fs.write(
                                _mapPath,
                                _result.map.toString(),
                                { force: true, rename: false },
                            );
                        }
                    }

                    if ( to ) {
                        this.params.debug && this.console.verbose(
                            'processed: ' + this.fs.pathRelative( from ) + ' → ' + this.fs.pathRelative( to ),
                            level,
                            { maxWidth: null },
                        );
                    } else {
                        this.params.debug && this.console.verbose(
                            'processed: ' + this.fs.pathRelative( from ),
                            level,
                            { maxWidth: null },
                        );
                    }
                } );
            }
        ) );
    }

    // UPGRADE - convert input to allow for arrays
    public async scss(
        input: string,
        output: string,
        level: number,
        sassOpts?: Stage.Compiler.Args.Sass,
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
            this.params.debug && this.console.verbose( 'writing css to path: ' + this.fs.pathRelative( output ), level, { maxWidth: null } );
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

    /**
     * {@inheritDoc Stage.Compiler.typescript}
     * 
     * @since 0.2.0-alpha — Now has errorIfNotFound param for use with new {@link Stage_Compiler.getTsConfig} method.
     */
    public async typescript(
        tsconfig: string,
        level: number,
        errorIfNotFound?: boolean,
    ): Promise<void> {
        this.console.verbose( 'running tsc...', level );

        const outDir = this.getTsConfigOutDir( tsconfig, 1 + level, errorIfNotFound );

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
            [ `tsc --project "${ this.fs.pathRelative( tsconfig ).replace( /"/g, '\\"' ) }"` ],
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
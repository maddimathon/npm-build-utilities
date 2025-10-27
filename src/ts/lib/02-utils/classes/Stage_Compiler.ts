/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import { DateTime, Interval } from 'luxon';

import postcss from 'postcss';
import * as postcss_PresetEnv from 'postcss-preset-env';

import * as sass from 'sass-embedded';

import type {
    Json,
    Objects,
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

        // returns
        if ( !tsSrcDir ) {
            return [];
        }

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
            'alpha-function': { preserve: false },
            'any-link-pseudo-class': false,
            'blank-pseudo-class': false,
            'break-properties': true,
            'cascade-layers': true,
            'case-insensitive-attributes': true,
            'clamp': { preserve: false },
            'color-function-display-p3-linear': { preserve: false },
            'color-function': { preserve: true },
            'color-functional-notation': false,
            'color-mix-variadic-function-arguments': false,
            'color-mix': false,
            'content-alt-text': { preserve: true },
            'contrast-color-function': { preserve: true },
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
            'nested-calc': { preserve: false },
            'nesting-rules': true,
            'not-pseudo-class': true,
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

        const baseUrl = tsSrcDir?.replace( /(?<=^|\/)[^\/]+(\/|$)/g, '..\/' );

        const outDir = this.fs.pathRelative( this.fs.pathResolve(
            baseUrl ?? '.',
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
             * This is actually the value of the
             * {@link Stage_Compiler.postCssConfig} static accessor, but not as
             * const for ease and smoother integration.
             */
            postCSS: Stage_Compiler.postCssConfig as Stage.Compiler.Args.PostCSS,

            sass: {
                alertAscii: undefined,
                alertColor: undefined,
                benchmarkCompileTime: undefined,
                charset: true,
                cli: undefined,
                compileViaCLI: undefined,
                fatalDeprecations: undefined,
                functions: undefined,
                futureDeprecations: undefined,
                importers: undefined,
                isWatchedUpdate: undefined,
                loadPaths: undefined,
                logger: undefined,
                quietDeps: undefined,
                silenceDeprecations: undefined,
                sourceMap: true,
                sourceMapIncludeSources: true,
                style: 'expanded',
                verbose: undefined,
            },

            ts: {},

        } as const satisfies Stage.Compiler.Args & {
            sass: Objects.Classify<Stage.Compiler.Args.Sass>;
        };
    }

    public readonly args: Stage.Compiler.Args & {
        sass: Objects.Classify<Stage.Compiler.Args.Sass>;
    };



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
            this.ARGS_DEFAULT as Stage.Compiler.Args & {
                sass: Objects.Classify<Stage.Compiler.Args.Sass>;
            },
            config.compiler,
            true
        );

        this.getTsConfig = this.getTsConfig.bind( this );
        this.getTsConfigOutDir = this.getTsConfigOutDir.bind( this );
        this.postCSS = this.postCSS.bind( this );
        this.scss = this.scss.bind( this );
        this.scssAPI = this.scssAPI.bind( this );
        this.scssCLI = this.scssCLI.bind( this );
        this.scssBulk = this.scssBulk.bind( this );
        this.sassCompileAsync = this.sassCompileAsync.bind( this );
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

    /**
     * Logs the message for the benchmark end notice.
     * 
     * @since 0.3.0-alpha.1
     */
    protected benchmarkEndTimeLog(
        msg: string,
        level: number,
        start: DateTime,
        end: DateTime,
    ) {
        const timePassed = Interval.fromDateTimes( start, end );

        const durationInSeconds = timePassed.toDuration().toMillis() / 1000;

        this.console.log(
            (
                this.params.verbose
                    ? `${ msg } @ ${ end.toFormat( 'H:mm:ss.SSS' ) } (${ durationInSeconds.toString() }s)`
                    : `${ msg } (${ durationInSeconds.toString() }s)`
            ),
            level,
            {
                clr: 'grey',
                italic: true,
                linesIn: 0,
                linesOut: 0,
            },
        );
    }

    /**
     * Logs the message for the benchmark start notice.
     * 
     * @since 0.3.0-alpha.1
     */
    protected benchmarkStartTimeLog(
        msg: string,
        level: number,
        start: DateTime,
    ) {

        this.console.verbose(
            `${ msg } @ ${ start.toFormat( 'H:mm:ss.SSS' ) }`,
            level,
            {
                clr: 'grey',
                italic: true,
                linesIn: 0,
                linesOut: 0,
            },
        );
    }



    /**
     * Runs the compileAsync from the sass package and returns with an ending
     * timestamp.
     *
     * @since 0.3.0-alpha.1
     */
    protected async sassCompileAsync(
        input: string,
        level: number,
        opts: Stage.Compiler.Args.Sass,
    ) {
        const start = DateTime.now();

        if ( opts.benchmarkCompileTime ) {
            this.benchmarkStartTimeLog( `compiling ${ input }`, level, start );
        }

        const compiled = await sass.compileAsync( input, opts );

        // returns
        if ( !compiled ) {
            this.benchmarkEndTimeLog(
                `compile FAILED: ${ input }`,
                level,
                start,
                DateTime.now(),
            );
            return compiled;
        }

        if ( opts.benchmarkCompileTime ) {
            this.benchmarkEndTimeLog(
                `compile finished: ${ input }`,
                level,
                start,
                DateTime.now(),
            );
        }

        return compiled;
    }

    /**
     * Compiles scss via API. This skips compiling options and validating values.
     * 
     * @since 0.3.0-alpha.1
     */
    protected async scssAPI(
        input: string,
        output: string,
        level: number,
        sassCompleteOpts: Objects.Classify<Stage.Compiler.Args.Sass>,
        compileFn?: (
            input: string,
            level: number,
            opts: Stage.Compiler.Args.Sass,
        ) => Promise<sass.CompileResult>,
    ) {
        const opts = {
            ...sassCompleteOpts,

            importers: [
                ...sassCompleteOpts.importers ?? [],
                new sass.NodePackageImporter(),
            ],
        };

        return ( compileFn ?? this.sassCompileAsync )( input, level, opts ).then(
            async ( compiled ) => {

                this.params.debug && this.console.verbose(
                    'writing css to path: ' + this.fs.pathRelative( output ),
                    level,
                    { maxWidth: null },
                );
                this.fs.write( output, compiled.css, { force: true } );

                // returns
                if ( !compiled.sourceMap ) {
                    return output;
                }

                const sourceMap = output.replace( /\.(s?css)$/g, '.$1.map' );

                this.params.debug && this.console.verbose(
                    'writing sourceMap to path: ' + this.fs.pathRelative( sourceMap ),
                    1 + level,
                    { maxWidth: null },
                );
                this.fs.write(
                    sourceMap,
                    JSON.stringify(
                        compiled.sourceMap,
                        null,
                        this.params.packaging ? 0 : 4,
                    ),
                    { force: true },
                );

                return output;
            }
        );
    }

    /**
     * Coverts scss args for the CLI.
     * 
     * @since 0.3.0-alpha.1
     */
    protected scssCLI_args( completeSassOpts: Stage.Compiler.Args.Sass ) {
        const opts: Objects.Classify<Stage.Compiler.Args.SassCLI> = {
            charset: completeSassOpts.charset,
            'embed-sources': completeSassOpts.cli?.[ 'embed-sources' ] ?? completeSassOpts.sourceMap ?? true,
            'embed-source-map': completeSassOpts.cli?.[ 'embed-source-map' ] ?? completeSassOpts.sourceMap ?? true,
            'error-css': completeSassOpts.cli?.[ 'error-css' ],
            'fatal-deprecation': completeSassOpts.fatalDeprecations,
            'future-deprecation': completeSassOpts.futureDeprecations,
            'load-path': completeSassOpts.loadPaths,
            indented: completeSassOpts.cli?.indented,
            'pkg-importer': 'node',
            'source-map': completeSassOpts.sourceMap,
            'source-map-urls': completeSassOpts.cli?.[ 'source-map-urls' ] ?? 'relative',
            style: completeSassOpts.style,
            update: completeSassOpts.cli?.update,
        };

        const argString: string[] = [
            '--no-color',
            '--trace',
        ];

        for ( const _key in opts ) {
            const key = _key as keyof typeof opts;
            const value = opts[ key ];

            switch ( typeof value ) {

                case 'boolean':
                    argString.push( value ? `--${ key }` : `--no-${ key }` );
                    break;

                case 'object':
                    if ( Array.isArray( value ) ) {
                        value.forEach( ( val ) => argString.push( `--${ key }=${ val }` ) );
                    }
                    break;

                case 'bigint':
                case 'number':
                case 'string':
                    argString.push( `--${ key }=${ value }` );
                    break;
            }
        }

        return argString.join( ' ' );
    }

    /**
     * Compiles scs via CLI. This skips compiling options and validating values.
     * 
     * @since 0.3.0-alpha.1
     */
    protected async scssCLI(
        input: string,
        output: string,
        level: number,
        sassCompleteOpts: Objects.Classify<Stage.Compiler.Args.Sass>,
    ) {
        const start = DateTime.now();

        if ( sassCompleteOpts.benchmarkCompileTime ) {
            this.benchmarkStartTimeLog( `compiling ${ input }`, level, start );
        }

        this.console.nc.cmd(
            `sass ${ this.fs.pathRelative( input ) }:${ this.fs.pathRelative( output ) } ${ this.scssCLI_args( sassCompleteOpts ) }`
        );

        if ( sassCompleteOpts.benchmarkCompileTime ) {
            this.benchmarkEndTimeLog(
                `compile finished: ${ input }`,
                level,
                start,
                DateTime.now(),
            );
        }

        return output;
    }

    /**
     * Best for CLI or single-file compiles. Otherwise use scssBulk.
     */
    public async scss(
        input: string,
        output: string,
        level: number,
        sassOpts?: Stage.Compiler.Args.Sass,
    ): Promise<string> {

        const opts = mergeArgs( this.args.sass, sassOpts, true );

        return (
            opts.compileViaCLI
                ? this.scssCLI(
                    input,
                    output,
                    level + ( ( opts.benchmarkCompileTime && this.params.verbose ) ? 1 : 0 ),
                    opts,
                )
                : this.scssAPI( input, output, level, opts )
        );
    }

    public async scssBulk(
        paths: {
            input: string;
            output: string;
        }[],
        level: number,
        sassOpts?: Stage.Compiler.Args.Sass,
        maxConcurrent: number = 10,
    ): Promise<string[]> {

        const opts = mergeArgs( this.args.sass, sassOpts, true );
        const startTime = DateTime.now();

        if ( opts.benchmarkCompileTime ) {
            this.benchmarkStartTimeLog( 'bulk compiling', level, startTime );
        }

        // returns
        if ( opts.compileViaCLI ) {

            const filePathArgs = paths.map(
                ( { input, output } ) => `${ this.fs.pathRelative( input ) }:${ this.fs.pathRelative( output ) }`
            );

            this.console.nc.cmd(
                `sass ${ filePathArgs.join( ' ' ) } ${ this.scssCLI_args( opts ) }`
            );

            if ( opts.benchmarkCompileTime ) {
                this.benchmarkEndTimeLog(
                    `bulk compile finished`,
                    level,
                    startTime,
                    DateTime.now(),
                );
            }

            return paths.map( p => p.output );
        }

        const compiledPaths: string[] = [];

        const compiler = await sass.initAsyncCompiler();

        const compileFn = async (
            _input: string,
            _level: number,
            _opts: Stage.Compiler.Args.Sass,
        ) => {
            const start = DateTime.now();

            if ( _opts.benchmarkCompileTime ) {
                this.benchmarkStartTimeLog( `compiling ${ _input }`, _level, start );
            }

            const compiled = await compiler.compileAsync( _input, _opts );

            // returns
            if ( !compiled ) {
                this.benchmarkEndTimeLog(
                    `compile FAILED: ${ _input }`,
                    _level,
                    start,
                    DateTime.now(),
                );
                return compiled;
            }

            if ( opts.benchmarkCompileTime ) {
                this.benchmarkEndTimeLog(
                    `compile finished: ${ _input }`,
                    _level,
                    start,
                    DateTime.now(),
                );
            }

            return compiled;
        };

        for ( let i = 0; i < paths.length; i += maxConcurrent ) {
            const chunk = paths.slice( i, i + maxConcurrent );

            const _chunkStart = DateTime.now();

            if ( opts.benchmarkCompileTime ) {
                this.benchmarkStartTimeLog(
                    `compiling chunk #${ i + 1 }`,
                    1 + level,
                    _chunkStart,
                );
            }

            const compiled = await Promise.all(
                chunk.map(
                    ( { input, output } ) => this.scssAPI(
                        input,
                        output,
                        ( this.params.verbose && opts.benchmarkCompileTime ? 2 : 0 ) + level,
                        opts,
                        compileFn,
                    )
                )
            );

            compiledPaths.push( ...compiled );

            if ( opts.benchmarkCompileTime ) {

                this.benchmarkEndTimeLog(
                    `done compiling chunk #${ i + 1 }`,
                    1 + level,
                    _chunkStart,
                    DateTime.now(),
                );
            }
        }

        if ( opts.benchmarkCompileTime ) {
            this.benchmarkEndTimeLog(
                `bulk compile finished`,
                level,
                startTime,
                DateTime.now(),
            );
        }

        await compiler.dispose();
        return compiledPaths;
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
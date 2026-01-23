/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.14
 * @license MIT
 */
import { DateTime, Interval } from 'luxon';
import postcss from 'postcss';
import * as postcss_PresetEnv from 'postcss-preset-env';
import * as sass from 'sass-embedded';
import {
    arrayUnique,
    escRegExp,
    escRegExpReplace,
    mergeArgs,
} from '@maddimathon/utility-typescript/functions';
import {} from '@maddimathon/utility-typescript/classes';
import { StageError } from '../../@internal/index.js';
import { catchOrReturn, FileSystem } from '../../00-universal/index.js';
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
export class Stage_Compiler {
    config;
    params;
    console;
    fs;
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
    static async getTsConfigPaths(stage, level, writeIfNotFound = true) {
        const tsSrcDirs = stage.getSrcDir('ts');
        const tsPaths = tsSrcDirs
            .map((path) => {
                // returns
                if (!stage.fs.exists(path)) {
                    stage.console.verbose(
                        'ⅹ configured ts source path not found: ' + path,
                        level,
                        { italic: true },
                    );
                    return [];
                }
                // returns
                if (!stage.fs.isDirectory(path)) {
                    stage.console.verbose(
                        '✓ configured ts source path found: ' + path,
                        level,
                        { italic: true },
                    );
                    return path;
                }
                stage.console.verbose(
                    'configured ts source path is a directory: '
                        + stage.fs.pathRelative(path),
                    level,
                    { italic: true },
                );
                const testSubPaths = [
                    'tsconfig.json',
                    'tsConfig.json',
                    '../tsconfig.json',
                    '../tsConfig.json',
                ];
                for (const subPath of testSubPaths) {
                    const fullPath = stage.fs.pathResolve(path, subPath);
                    // returns
                    if (
                        stage.fs.exists(fullPath)
                        && stage.fs.isFile(fullPath)
                    ) {
                        const relativePath = stage.fs.pathRelative(fullPath);
                        stage.console.verbose(
                            '✓ default sub-file found: ' + relativePath,
                            1 + level,
                            { italic: true },
                        );
                        return relativePath;
                    }
                }
                stage.console.verbose('ⅹ no default files found', 1 + level);
                return [];
            })
            .flat();
        stage.console.vi.debug(
            { tsPaths },
            (stage.params.verbose ? 1 : 0) + level,
        );
        // returns
        if (tsPaths.length || !writeIfNotFound) {
            return tsPaths;
        }
        // returns
        if (
            !(await stage.console.prompt.bool(
                'No tsconfig.json files found, do you want to create one?',
                level,
                {
                    default: true,
                    msgArgs: {
                        linesIn: 1,
                    },
                },
            ))
        ) {
            return [];
        }
        const tsSrcDir = stage.getSrcDir('ts')[0];
        // returns
        if (!tsSrcDir) {
            return [];
        }
        const _tsConfigDefaultPath = stage.fs.pathRelative(
            stage.fs.pathResolve(tsSrcDir, './tsconfig.json'),
        );
        const tsConfigFile = await stage.console.prompt.input(
            'Where should the tsconfig.json be written?',
            level,
            {
                default: _tsConfigDefaultPath,
                msgArgs: {
                    linesOut: 1,
                },
                required: true,
            },
        );
        stage.console.vi.debug({ tsConfigFile }, 3);
        // returns
        if (!tsConfigFile) {
            return [];
        }
        const baseUrl = tsSrcDir.replace(/(?<=^|\/)[^\/]+(\/|$)/g, '..\/');
        stage.console.vi.debug({ baseUrl }, 2);
        const outDir = stage.fs.pathRelative(
            stage.fs.pathResolve(baseUrl, stage.getDistDir(), 'js'),
        );
        stage.console.vi.debug({ outDir }, 2);
        const _writeResult = stage.fs.write(
            stage.fs.pathResolve(tsConfigFile),
            JSON.stringify(stage.compiler.tsConfig, null, 4),
            { force: true },
        );
        // returns
        if (!_writeResult) {
            stage.console.verbose('ⅹ error writing new tsconfig file', 3);
            return [];
        }
        return [tsConfigFile];
    }
    /**
     * Default configuration for working with PostCSS.
     *
     * @since 0.2.0-alpha
     */
    static get postCssConfig() {
        const features = {
            'all-property': false,
            'alpha-function': { preserve: false },
            'any-link-pseudo-class': false,
            'blank-pseudo-class': false,
            'break-properties': true,
            'cascade-layers': true,
            'case-insensitive-attributes': true,
            clamp: { preserve: false },
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
        };
        const presetEnv = {
            features,
            logical: {
                blockDirection: 'top-to-bottom',
                inlineDirection: 'left-to-right',
            },
            stage: false,
        };
        return {
            presetEnv,
            processor: {
                map: false,
            },
        };
    }
    /* LOCAL PROPERTIES
     * ====================================================================== */
    get tsConfig() {
        const tsSrcDir = this.config.getSrcDir(this.fs, 'ts')[0];
        const baseUrl = tsSrcDir?.replace(/(?<=^|\/)[^\/]+(\/|$)/g, '..\/');
        const outDir = this.fs.pathRelative(
            this.fs.pathResolve(
                baseUrl ?? '.',
                this.config.getDistDir(this.fs),
                'ts',
            ),
        );
        return {
            extends: '@maddimathon/build-utilities/tsconfig',
            exclude: ['**/node_modules/**/*'],
            compilerOptions: {
                exactOptionalPropertyTypes: false,
                outDir,
                baseUrl,
            },
        };
    }
    /* Args ===================================== */
    get ARGS_DEFAULT() {
        return {
            /**
             * This is actually the value of the
             * {@link Stage_Compiler.postCssConfig} static accessor, but not as
             * const for ease and smoother integration.
             */
            postCSS: Stage_Compiler.postCssConfig,
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
                holdDeprecationsToEnd: true,
                ignoreWarningsInPackaging: undefined,
                importers: undefined,
                isWatchedUpdate: undefined,
                loadPaths: undefined,
                logger: undefined,
                neverDisplayDeprecationDetails: undefined,
                onlyOneDeprecationWarningPerCompile: true,
                pathToSassLoggingRoot: undefined,
                quietDeps: undefined,
                silenceDeprecations: undefined,
                sourceMap: true,
                sourceMapIncludeSources: true,
                style: 'expanded',
                verbose: true,
            },
            ts: {},
        };
    }
    args;
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param console  Instance used to log messages and debugging info.
     * @param fs       Instance used to work with paths and files.
     */
    constructor(config, params, console, fs) {
        this.config = config;
        this.params = params;
        this.console = console;
        this.fs = fs;
        this.args = mergeArgs(this.ARGS_DEFAULT, config.compiler, true);
        this.getTsConfig = this.getTsConfig.bind(this);
        this.getTsConfigOutDir = this.getTsConfigOutDir.bind(this);
        this.postCSS = this.postCSS.bind(this);
        this.scss = this.scss.bind(this);
        this.scssAPI = this.scssAPI.bind(this);
        this.scssCLI = this.scssCLI.bind(this);
        this.scssBulk = this.scssBulk.bind(this);
        this.sassCompileAsync = this.sassCompileAsync.bind(this);
        this.typescript = this.typescript.bind(this);
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
    getTsConfig(tsconfig, level, errorIfNotFound = true) {
        this.console.verbose('getting tsconfig value...', level);
        // throws or returns
        if (!this.fs.exists(tsconfig)) {
            if (errorIfNotFound) {
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
        if (!this.fs.isFile(tsconfig)) {
            if (errorIfNotFound) {
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
        const config_obj = JSON.parse(this.fs.readFile(tsconfig));
        // returns
        if (typeof config_obj === 'object') {
            if (!config_obj.compilerOptions) {
                config_obj.compilerOptions = {};
            }
            config_obj.compilerOptions.sourceMap =
                (config_obj.compilerOptions?.sourceMap ?? false)
                && !this.params.packaging
                && !this.params.releasing;
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
    getTsConfigOutDir(tsconfig, level, errorIfNotFound = true) {
        const config_obj =
            typeof tsconfig === 'string' ?
                {
                    ...this.getTsConfig(tsconfig, level, errorIfNotFound),
                    path: tsconfig,
                }
            :   tsconfig;
        return (
            (config_obj.compilerOptions?.noEmit !== true
                && config_obj.compilerOptions?.outDir
                && this.fs
                    .pathResolve(
                        this.fs.dirname(config_obj.path),
                        config_obj.compilerOptions.outDir,
                    )
                    .replace(/\/+$/gi, ''))
            || false
        );
    }
    async postCSS(paths, level, _postCssOpts = {}) {
        const postCssOpts = mergeArgs(this.args.postCSS, _postCssOpts, true);
        const plugins = postCssOpts.plugins ?? [];
        if (postCssOpts.presetEnv) {
            plugins.push(
                postcss_PresetEnv.default({
                    ...postCssOpts.presetEnv,
                    debug: this.params.debug,
                }),
            );
        }
        const inst = postcss(plugins);
        await Promise.all(
            paths.map(({ from, to }) => {
                // returns
                if (!this.fs.exists(from)) {
                    return;
                }
                const _css = this.fs.readFile(from);
                const _outputPath = to ?? from;
                return inst
                    .process(_css, {
                        from,
                        to: _outputPath,
                        ...postCssOpts.processor,
                    })
                    .then((_result) => {
                        this.fs.write(_outputPath, _result.css, {
                            force: true,
                            rename: false,
                        });
                        if (_result.map) {
                            const _mapPath = _outputPath.replace(
                                /\.css$/gi,
                                '.css.map',
                            );
                            if (_outputPath != _mapPath) {
                                this.fs.write(
                                    _mapPath,
                                    _result.map.toString(),
                                    { force: true, rename: false },
                                );
                            }
                        }
                        if (to) {
                            this.params.debug
                                && this.console.verbose(
                                    'processed: '
                                        + this.fs.pathRelative(from)
                                        + ' → '
                                        + this.fs.pathRelative(to),
                                    level,
                                    { maxWidth: null },
                                );
                        } else {
                            this.params.debug
                                && this.console.verbose(
                                    'processed: ' + this.fs.pathRelative(from),
                                    level,
                                    { maxWidth: null },
                                );
                        }
                    });
            }),
        );
    }
    /**
     * Logs the message for the benchmark end notice.
     *
     * @since 0.3.0-alpha.1
     */
    benchmarkEndTimeLog(msg, level, start, end) {
        const timePassed = Interval.fromDateTimes(start, end);
        const durationInSeconds = timePassed.toDuration().toMillis() / 1000;
        this.console.log(
            this.params.verbose ?
                `${msg} @ ${end.toFormat('H:mm:ss.SSS')} (${durationInSeconds.toString()}s)`
            :   `${msg} (${durationInSeconds.toString()}s)`,
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
    benchmarkStartTimeLog(msg, level, start) {
        this.console.verbose(
            `${msg} @ ${start.toFormat('H:mm:ss.SSS')}`,
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
    async sassCompileAsync(input, level, opts) {
        const start = DateTime.now();
        if (opts.benchmarkCompileTime) {
            this.benchmarkStartTimeLog(`compiling ${input}`, level, start);
        }
        return sass.compileAsync(input, opts).then(
            (compiled) => {
                if (opts.benchmarkCompileTime) {
                    if (!compiled) {
                        this.benchmarkEndTimeLog(
                            `compile FAILED: ${input}`,
                            level,
                            start,
                            DateTime.now(),
                        );
                    } else {
                        this.benchmarkEndTimeLog(
                            `compile finished: ${input}`,
                            level,
                            start,
                            DateTime.now(),
                        );
                    }
                }
                return compiled;
            },
            (error) => {
                if (opts.benchmarkCompileTime) {
                    this.benchmarkEndTimeLog(
                        `compile FAILED: ${input}`,
                        level,
                        start,
                        DateTime.now(),
                    );
                }
                throw error;
            },
        );
    }
    /**
     * Filters the paths in stack traces from the sass compiler API.
     *
     * @since 0.3.0-alpha.3
     */
    sassErrorStackFilter(stack, opts) {
        const sassStackRegex = /^(\s*)([^\s]+)\s+(\d+:\d+)(?=\s|$)/i;
        const pathToSassLoggingRoot =
            opts.pathToSassLoggingRoot
            ?? this.args.sass?.pathToSassLoggingRoot
            ?? '.';
        const splitStack = stack.split('\n').filter((l) => l);
        const sassPathsFiltered = splitStack.map((line) => {
            const match = line.match(sassStackRegex);
            if (!match) {
                return line;
            }
            const [fullMatch, startPadding, path, lineLocation] = match;
            if (!fullMatch) {
                return line;
            }
            const relativePath = this.fs.pathRelative(
                this.fs.pathResolve(pathToSassLoggingRoot, path),
            );
            return line.replace(
                sassStackRegex,
                escRegExpReplace(
                    `${startPadding}${relativePath}:${lineLocation}`,
                ),
            );
        });
        const stackPathRegex =
            /^(\s*at\s+[^\n]*?\s+)\(?(?:file\:\/\/)?([^\(\)]+)\)?(?=(?:\s*$))/;
        const urlPathsFiltered = sassPathsFiltered.map((path) => {
            const _matches = path.match(stackPathRegex);
            if (_matches && _matches[2]) {
                path =
                    path.replace(stackPathRegex, '$1')
                    + `(${this.fs.pathRelative(decodeURI(_matches[2])).replace(' ', '%20')})`;
            }
            return path;
        });
        return urlPathsFiltered;
    }
    /**
     * Runs a bare-bones instance of the sass API to compile. Intended only for
     * use by {@link Stage_Compiler.scssAPI} and {@link Stage_Compiler.scssBulk}.
     *
     * @since 0.3.0-alpha.12
     */
    async scssAPI_barebones(
        input,
        output,
        level,
        sassCompleteOpts,
        logger,
        compileFn,
    ) {
        const opts = {
            ...sassCompleteOpts,
            logger,
            importers: [
                ...(sassCompleteOpts.importers ?? []),
                new sass.NodePackageImporter(),
            ],
        };
        return (compileFn ?? this.sassCompileAsync)(input, level, opts).then(
            async (compiled) => {
                this.params.debug
                    && this.console.verbose(
                        'writing css to path: ' + this.fs.pathRelative(output),
                        level,
                        { maxWidth: null },
                    );
                this.fs.write(output, compiled.css, { force: true });
                // returns
                if (!compiled.sourceMap) {
                    return { output, logger };
                }
                const sourceMap = output.replace(/\.(s?css)$/g, '.$1.map');
                this.params.debug
                    && this.console.verbose(
                        'writing sourceMap to path: '
                            + this.fs.pathRelative(sourceMap),
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
                return { output, logger };
            },
        );
    }
    /**
     * Compiles scss via API. This skips compiling options and validating values.
     *
     * @since 0.3.0-alpha.1
     */
    async scssAPI(input, output, level, sassCompleteOpts, logger, compileFn) {
        return this.scssAPI_barebones(
            input,
            output,
            level,
            sassCompleteOpts,
            logger
                ?? new Stage_Compiler.SassLogger(
                    this.console,
                    this.fs,
                    this.params,
                    this.sassErrorStackFilter,
                    level,
                    sassCompleteOpts,
                ),
            compileFn,
        ).then(({ output, logger }) => {
            if (this.args.sass.holdDeprecationsToEnd) {
                logger.outputAllDeprecations();
            }
            return { output, logger };
        });
    }
    /**
     * Coverts scss args for the CLI.
     *
     * @since 0.3.0-alpha.1
     */
    scssCLI_args(completeSassOpts) {
        const opts = {
            charset: completeSassOpts.charset,
            'embed-sources':
                completeSassOpts.cli?.['embed-sources']
                ?? completeSassOpts.sourceMapIncludeSources
                ?? true,
            'embed-source-map':
                completeSassOpts.cli?.['embed-source-map']
                ?? completeSassOpts.sourceMap
                ?? true,
            'error-css': completeSassOpts.cli?.['error-css'],
            'fatal-deprecation': completeSassOpts.fatalDeprecations,
            'future-deprecation': completeSassOpts.futureDeprecations,
            'load-path': completeSassOpts.loadPaths,
            indented: completeSassOpts.cli?.indented,
            'pkg-importer': 'node',
            'quiet-deps': completeSassOpts.quietDeps,
            'source-map': completeSassOpts.sourceMap,
            'source-map-urls':
                completeSassOpts.cli?.['source-map-urls'] ?? 'relative',
            style: completeSassOpts.style,
            update: completeSassOpts.cli?.update,
        };
        const argString = ['--no-color', '--trace'];
        for (const _key in opts) {
            const key = _key;
            const value = opts[key];
            switch (typeof value) {
                case 'boolean':
                    argString.push(value ? `--${key}` : `--no-${key}`);
                    break;
                case 'object':
                    if (Array.isArray(value)) {
                        value.forEach((val) =>
                            argString.push(`--${key}=${val}`),
                        );
                    }
                    break;
                case 'bigint':
                case 'number':
                case 'string':
                    argString.push(`--${key}=${value}`);
                    break;
            }
        }
        return argString.join(' ');
    }
    /**
     * Compiles scs via CLI. This skips compiling options and validating values.
     *
     * @since 0.3.0-alpha.1
     */
    async scssCLI(input, output, level, sassCompleteOpts) {
        const start = DateTime.now();
        if (sassCompleteOpts.benchmarkCompileTime) {
            this.benchmarkStartTimeLog(`compiling ${input}`, level, start);
        }
        this.console.nc.cmd(
            `sass ${this.fs.pathRelative(input)}:${this.fs.pathRelative(output)} ${this.scssCLI_args(sassCompleteOpts)}`,
        );
        if (sassCompleteOpts.benchmarkCompileTime) {
            this.benchmarkEndTimeLog(
                `compile finished: ${input}`,
                level,
                start,
                DateTime.now(),
            );
        }
        return { output, logger: undefined };
    }
    /**
     * Best for CLI or single-file compiles. Otherwise use scssBulk.
     */
    async scss(input, output, level, sassOpts) {
        const opts = mergeArgs(this.args.sass, sassOpts, true);
        return (
            opts.compileViaCLI ?
                this.scssCLI(
                    input,
                    output,
                    level
                        + (opts.benchmarkCompileTime && this.params.verbose ?
                            1
                        :   0),
                    opts,
                )
            :   this.scssAPI(input, output, level, opts)).then(
            async ({ output: compiled, logger }) => {
                // prompts for exit
                if (logger?.sassLoggerWarningDuringPackaging) {
                    // exits process
                    if (
                        !(await this.console.prompt.bool(
                            'A Sass warning fired during a packaging compile — do you want to continue?',
                            level,
                            {
                                msgArgs: {
                                    clr: 'black',
                                    linesIn: 1,
                                    linesOut: 1,
                                },
                            },
                        ))
                    ) {
                        process.exit();
                    }
                }
                return compiled;
            },
        );
    }
    async scssBulk(paths, level, sassOpts, maxConcurrent = 10) {
        const opts = mergeArgs(this.args.sass, sassOpts, true);
        const startTime = DateTime.now();
        const pathCount = paths.length;
        if (opts.benchmarkCompileTime) {
            this.benchmarkStartTimeLog(
                `bulk compiling – ${pathCount} files`,
                level,
                startTime,
            );
        }
        // returns
        if (opts.compileViaCLI) {
            const filePathArgs = paths.map(
                ({ input, output }) =>
                    `${this.fs.pathRelative(input)}:${this.fs.pathRelative(output)}`,
            );
            this.console.nc.cmd(
                `sass ${filePathArgs.join(' ')} ${this.scssCLI_args(opts)}`,
            );
            if (opts.benchmarkCompileTime) {
                this.benchmarkEndTimeLog(
                    `bulk compile finished – ${pathCount} files`,
                    level,
                    startTime,
                    DateTime.now(),
                );
            }
            return paths.map((p) => p.output);
        }
        const logger = new Stage_Compiler.SassLogger(
            this.console,
            this.fs,
            this.params,
            this.sassErrorStackFilter,
            level,
            opts,
        );
        const compiledPaths = [];
        const compiler = await sass.initAsyncCompiler();
        const compileFn = async (_input, _level, _opts) => {
            const start = DateTime.now();
            if (_opts.benchmarkCompileTime) {
                this.benchmarkStartTimeLog(
                    `compiling ${_input}`,
                    _level,
                    start,
                );
            }
            return compiler.compileAsync(_input, _opts).then(
                (compiled) => {
                    if (opts.benchmarkCompileTime) {
                        if (!compiled) {
                            this.benchmarkEndTimeLog(
                                `compile FAILED: ${_input}`,
                                _level,
                                start,
                                DateTime.now(),
                            );
                        } else {
                            this.benchmarkEndTimeLog(
                                `compile finished: ${_input}`,
                                _level,
                                start,
                                DateTime.now(),
                            );
                        }
                    }
                    return compiled;
                },
                (error) => {
                    if (opts.benchmarkCompileTime) {
                        this.benchmarkEndTimeLog(
                            `compile FAILED: ${_input}`,
                            _level,
                            start,
                            DateTime.now(),
                        );
                    }
                    throw error;
                },
            );
        };
        const compileErrors = [];
        for (let i = 0; i < paths.length; i += maxConcurrent) {
            const chunk = paths.slice(i, i + maxConcurrent);
            const _chunkStart = DateTime.now();
            if (opts.benchmarkCompileTime) {
                this.benchmarkStartTimeLog(
                    `compiling chunk #${i / maxConcurrent + 1}`,
                    1 + level,
                    _chunkStart,
                );
            }
            const compiled = await Promise.allSettled(
                chunk.map(({ input, output }) =>
                    this.scssAPI_barebones(
                        input,
                        output,
                        (this.params.verbose && opts.benchmarkCompileTime ?
                            2
                        :   0) + level,
                        opts,
                        logger,
                        compileFn,
                    ),
                ),
            ).then((arr) =>
                arr
                    .map((result) => {
                        // returns
                        if (result.status == 'rejected') {
                            compileErrors.push(result.reason);
                            return false;
                        }
                        return result.value.output;
                    })
                    .filter((v) => v !== false),
            );
            compiledPaths.push(...compiled);
            if (opts.benchmarkCompileTime) {
                this.benchmarkEndTimeLog(
                    `done compiling chunk #${i / maxConcurrent + 1}`,
                    1 + level,
                    _chunkStart,
                    DateTime.now(),
                );
            }
        }
        if (opts.benchmarkCompileTime) {
            this.benchmarkEndTimeLog(
                `bulk compile finished – ${pathCount} files`,
                level,
                startTime,
                DateTime.now(),
            );
        }
        await compiler.dispose();
        // throws
        if (compileErrors.length) {
            compileErrors.forEach((err) => {
                throw err;
            });
        }
        // outputs deprecation warnings
        if (this.args.sass.holdDeprecationsToEnd) {
            logger.outputAllDeprecations();
        }
        // prompts for exit
        if (logger.sassLoggerWarningDuringPackaging) {
            // exits process
            if (
                !(await this.console.prompt.bool(
                    'A Sass warning fired during a packaging compile — do you want to continue?',
                    level,
                    {
                        msgArgs: {
                            clr: 'black',
                            linesIn: 1,
                            linesOut: 1,
                        },
                    },
                ))
            ) {
                process.exit();
            }
        }
        return compiledPaths;
    }
    /**
     * {@inheritDoc Stage.Compiler.typescript}
     *
     * @since 0.2.0-alpha — Now has errorIfNotFound param for use with new {@link Stage_Compiler.getTsConfig} method.
     */
    async typescript(tsconfig, level, errorIfNotFound) {
        this.console.verbose('running tsc...', level);
        const outDir = this.getTsConfigOutDir(
            tsconfig,
            1 + level,
            errorIfNotFound,
        );
        catchOrReturn(this.console.nc.cmd, 1 + level, this.console, this.fs, [
            `tsc --project "${this.fs.pathRelative(tsconfig).replace(/"/g, '\\"')}"`,
        ]);
        if (outDir && this.args.ts.tidyGlobs?.length) {
            this.console.verbose('tidying compiled files...', 0 + level);
            const _globs = (
                Array.isArray(this.args.ts.tidyGlobs) ?
                    this.args.ts.tidyGlobs
                :   [this.args.ts.tidyGlobs]).map((_glob) =>
                this.fs.pathResolve(outDir, _glob),
            );
            this.console.vi.debug(
                { tidyGlobs: _globs },
                (this.params.verbose ? 1 : 0) + level,
            );
            this.fs.delete(
                _globs,
                (this.params.debug ? 1 : 0)
                    + (this.params.verbose ? 1 : 0)
                    + level,
            );
        }
    }
}
/**
 * Utilities for the {@link Stage_Compiler} class.
 *
 * @since 0.3.0-alpha.12
 */
(function (Stage_Compiler) {
    /**
     * Handles logging for sass compilations.
     *
     * @since 0.3.0-alpha.12
     */
    class SassLogger {
        console;
        fs;
        params;
        sassErrorStackFilter;
        level;
        args;
        deprecationWarnings = new Map();
        _sassLoggerWarningDuringPackaging = false;
        get sassLoggerWarningDuringPackaging() {
            return this._sassLoggerWarningDuringPackaging;
        }
        constructor(console, fs, params, sassErrorStackFilter, level, args) {
            this.console = console;
            this.fs = fs;
            this.params = params;
            this.sassErrorStackFilter = sassErrorStackFilter;
            this.level = level;
            this.args = args;
        }
        messageMaker(options) {
            const msgs = [];
            if ('stack' in options && options.stack) {
                const stack = this.sassErrorStackFilter(
                    options.stack,
                    this.args,
                );
                stack.length
                    && msgs.push([
                        '\n' + stack.join('\n'),
                        {
                            italic: true,
                            maxWidth: null,
                        },
                    ]);
            }
            return msgs;
        }
        optionSpanMaker(options) {
            if (!options.span) {
                return null;
            }
            const url =
                options.span.url
                && this.fs.pathRelative(decodeURI(options.span.url.pathname));
            return {
                start:
                    url
                    && `${url}:${options.span.start.line}:${options.span.start.column}`,
                end:
                    url
                    && `${url}:${options.span.end.line}:${options.span.end.column}`,
            };
        }
        /**
         * Outputs a debug message received from Sass.
         *
         * @since 0.3.0-alpha.12 — Moved to own class.
         */
        debug(message, options) {
            const msgs = [];
            if (options.span) {
                const span = this.optionSpanMaker(options);
                const spanMsg = span?.end ?? span?.start;
                spanMsg
                    && msgs.push([
                        spanMsg,
                        {
                            clr: 'black',
                            italic: true,
                        },
                    ]);
            }
            this.console.log(
                [
                    ...msgs,
                    [
                        `[${options.span ? '' : 'Sass: '}Debug] `,
                        {
                            bold: true,
                            clr: 'grey',
                        },
                    ],
                    [message.trim(), { clr: 'black' }],
                    // ...messageMaker( options ),
                ],
                this.level,
                {
                    bold: false,
                    italic: false,
                    linesIn: 0,
                    linesOut: 0,
                    joiner: ' ',
                    maxWidth: null,
                },
            );
        }
        /**
         * @since 0.3.0-alpha.12
         */
        deprecation_headerMessageMaker(depType, introMessage) {
            return [
                [
                    `[Sass: Deprecated] ${introMessage ?? depType.id}\n`,
                    {
                        bold: true,
                        clr: 'yellow',
                    },
                ],
            ];
        }
        /**
         * @since 0.3.0-alpha.12 — Moved to own class.
         */
        outputAllDeprecations() {
            for (const [depKey, value] of this.deprecationWarnings.entries()) {
                const _warningsArr = Array.from(value);
                const depType = _warningsArr
                    .map((warn) => warn.deprecationType)
                    .reduce(
                        (previous, current) => {
                            const deprecatedIn =
                                previous.deprecatedIn instanceof Set ?
                                    previous.deprecatedIn
                                : previous.deprecatedIn ?
                                    new Set([
                                        `${previous.deprecatedIn.major}.${previous.deprecatedIn.minor}.${previous.deprecatedIn.patch}`,
                                    ])
                                :   new Set();
                            if (current.deprecatedIn) {
                                deprecatedIn.add(
                                    `${current.deprecatedIn.major}.${current.deprecatedIn.minor}.${current.deprecatedIn.patch}`,
                                );
                            }
                            const description =
                                previous.description instanceof Set ?
                                    previous.description
                                : previous.description ?
                                    new Set([previous.description])
                                :   new Set();
                            if (current.description) {
                                description.add(current.description);
                            }
                            const obsoleteIn =
                                previous.obsoleteIn instanceof Set ?
                                    previous.obsoleteIn
                                : previous.obsoleteIn ?
                                    new Set([
                                        `${previous.obsoleteIn.major}.${previous.obsoleteIn.minor}.${previous.obsoleteIn.patch}`,
                                    ])
                                :   new Set();
                            if (current.obsoleteIn) {
                                obsoleteIn.add(
                                    `${current.obsoleteIn.major}.${current.obsoleteIn.minor}.${current.obsoleteIn.patch}`,
                                );
                            }
                            const status =
                                previous.status instanceof Set ? previous.status
                                : previous.status ? new Set([previous.status])
                                : new Set();
                            if (current.status) {
                                status.add(current.status);
                            }
                            return {
                                ...previous,
                                ...current,
                                id: depKey,
                                description,
                                status,
                                deprecatedIn,
                                obsoleteIn,
                            };
                        },
                        {
                            id: depKey,
                        },
                    );
                const parsedInstances = _warningsArr.map((value) => {
                    const message = value.message.trim();
                    const moreInfoMessage = message.match(
                        /[\n\s]*(More info: .+?)[\n\s]*$/i,
                    );
                    const shortMessage = message
                        .replace(/[\n\s]*More info: .+$/gi, '')
                        .replace(/[\n\s]*Suggestion: .+$/gi, '')
                        .trim();
                    return {
                        message,
                        shortMessage,
                        moreInfoMessage:
                            moreInfoMessage ?
                                moreInfoMessage[1]
                            :   moreInfoMessage,
                        span: this.optionSpanMaker(value),
                        stack: value.stack,
                    };
                });
                const messages = new Set();
                const shortMessages = new Set();
                const moreInfoMessages = new Set();
                parsedInstances.forEach((inst) => {
                    messages.add(inst.message.trim());
                    shortMessages.add(inst.shortMessage.trim());
                    if (inst.moreInfoMessage) {
                        moreInfoMessages.add(inst.moreInfoMessage.trim());
                    }
                });
                const headerMessage = [...shortMessages][0];
                const headerMessageRegex =
                    headerMessage
                    && new RegExp(
                        `^[\\n\\s]*${escRegExp(headerMessage)}(?=[\\n\\s]|$)`,
                        'gi',
                    );
                const theseMsgs = [
                    ...this.deprecation_headerMessageMaker(
                        depType,
                        headerMessage,
                    ),
                    [
                        [...moreInfoMessages],
                        {
                            clr: 'yellow',
                            italic: true,
                        },
                    ],
                    [''],
                ];
                if (
                    parsedInstances.length > 10
                    || this.args.neverDisplayDeprecationDetails
                ) {
                    // only display the paths to instances
                    theseMsgs.push([
                        [
                            `There were ${parsedInstances.length} instances of this warning:`,
                        ],
                        {},
                    ]);
                    theseMsgs.push([
                        arrayUnique(
                            parsedInstances
                                .map(
                                    (_psd) =>
                                        (_psd.span?.end
                                            ?? _psd.span?.start
                                            ?? _psd.stack
                                                ?.trim()
                                                .split(/\n+/)[0])
                                        || false,
                                )
                                .filter((_psd) => _psd !== false)
                                .map((_l) => `    ${_l}`),
                        ),
                        {
                            italic: true,
                            maxWidth: null,
                        },
                    ]);
                    theseMsgs.push(['']);
                } else {
                    // display details about each instance
                    theseMsgs.push([
                        [
                            `There were ${parsedInstances.length} instances of this warning.`,
                            '',
                        ],
                        {},
                    ]);
                    theseMsgs.push(
                        ...parsedInstances
                            .map((_inst) => {
                                const _location = (
                                    _inst.span?.end
                                    ?? _inst.span?.start
                                    ?? _inst.stack
                                        ?.trim()
                                        .split(/\n+/)
                                        .filter((_l) => _l)[0]
                                )?.trim();
                                let __simpleMsg = _inst.message.replace(
                                    /[\n\s]*(More info: .+?)[\n\s]*$/i,
                                    '',
                                );
                                if (headerMessageRegex) {
                                    __simpleMsg = __simpleMsg.replace(
                                        headerMessageRegex,
                                        '',
                                    );
                                }
                                const _simpleMsg = __simpleMsg.trim();
                                // returns
                                if (!_location && !_simpleMsg) {
                                    return [['FALSE - ' + depKey]];
                                }
                                const msgs = [['']];
                                if (_location) {
                                    msgs.push([_location, { bold: true }]);
                                }
                                if (_simpleMsg) {
                                    if (_location) {
                                        msgs.push([
                                            [
                                                '',
                                                _simpleMsg
                                                    .split('\n')
                                                    .map((_l) => '    ' + _l)
                                                    .join('\n'),
                                            ],
                                        ]);
                                    } else {
                                        msgs.push([_simpleMsg]);
                                    }
                                }
                                // returns
                                if (!msgs.length) {
                                    return [['FALSE - ' + depKey]];
                                }
                                return [...msgs, ['']];
                            })
                            .flat(),
                    );
                }
                this.console.warn(
                    theseMsgs,
                    this.level,
                    {
                        bold: false,
                        clr: 'yellow',
                        italic: false,
                        linesIn: 1,
                        linesOut: 1,
                        joiner: '\n',
                    },
                    {
                        bold: true,
                    },
                );
                // varDumps[ depKey ] = _warningsArr;
            }
            // this.console.vi.log( { deprecationWarnings: warnings }, this.level );
            // this.console.vi.log( { deprecationWarnings: varDumps }, this.level );
        }
        /**
         * Outputs a warning (or deprecation) message received from Sass.
         *
         * @since 0.3.0-alpha.12 — Moved to own class.
         */
        warn(message, options) {
            const msgs = [];
            const span = this.optionSpanMaker(options);
            let deprecationIsDuplicate = false;
            // returns if duplicate
            if (options.deprecation) {
                const deprecationID = options.deprecationType.id;
                if (this.deprecationWarnings.has(deprecationID)) {
                    deprecationIsDuplicate = true;
                } else {
                    this.deprecationWarnings.set(deprecationID, new Set());
                }
                this.deprecationWarnings.get(deprecationID)?.add({
                    ...options,
                    message,
                });
                // returns
                if (
                    this.args.holdDeprecationsToEnd
                    || (deprecationIsDuplicate
                        && this.args.onlyOneDeprecationWarningPerCompile)
                ) {
                    return;
                }
                msgs.push(
                    ...this.deprecation_headerMessageMaker(
                        options.deprecationType,
                    ),
                );
            } else {
                msgs.push([
                    `[Sass: Warning]`,
                    {
                        bold: true,
                    },
                ]);
            }
            span
                && this.params.verbose
                && this.console.vi.debug({ span }, this.level);
            msgs.push([message.trim(), {}]);
            this.console.warn(
                msgs.concat(this.messageMaker(options)),
                this.level,
                {
                    bold: false,
                    clr:
                        options.deprecation ? 'yellow'
                        : this.params.packaging || this.params.releasing ? 'red'
                        : 'orange',
                    italic: false,
                    linesIn: 1,
                    linesOut: 1,
                    joiner: '\n',
                },
                {
                    bold: true,
                },
            );
            // exits
            if (this.params.packaging || this.params.releasing) {
                this._sassLoggerWarningDuringPackaging = true;
            }
        }
    }
    Stage_Compiler.SassLogger = SassLogger;
})(Stage_Compiler || (Stage_Compiler = {}));
//# sourceMappingURL=Stage_Compiler.js.map

/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.1.draft
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
    objectKeySort,
} from '@maddimathon/utility-typescript';
import { AbstractError, StageError } from '../../@internal/index.js';
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
    stage;
    errorHandler;
    /* STATIC
     * ====================================================================== */
    /**
     * Gets paths to tsconfig files according to the project configuration.
     *
     * If none is found, a console prompt asks to write a default file.
     *
     * @category Typescript
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
        const _writeResult = stage.fs.write(
            stage.fs.pathResolve(tsConfigFile),
            JSON.stringify(
                stage.compiler.tsConfig({
                    path: tsConfigFile,
                }),
                null,
                4,
            ),
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
     * @category Meta
     */
    parseArgs(defaultArgs, inputArgs) {
        const sass =
            typeof inputArgs?.sass === 'function' ?
                inputArgs.sass(this.stage)
            :   inputArgs?.sass;
        return mergeArgs(
            defaultArgs,
            {
                ...inputArgs,
                sass,
            },
            true,
        );
    }
    /**
     * Default configuration for working with PostCSS.
     *
     * @category PostCSS
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
            'container-rule-prelude-list': true,
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
            'font-width-property': { preserve: true },
            'gamut-mapping': false,
            'gap-properties': true,
            'gradients-interpolation-method': false,
            'has-pseudo-class': false,
            'hexadecimal-alpha-notation': true,
            'hwb-function': true,
            'ic-unit': false,
            'image-function': true,
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
            mixins: { preserve: false },
            'nested-calc': { preserve: false },
            'nesting-rules': false,
            'not-pseudo-class': true,
            'oklab-function': { preserve: true },
            'opacity-percentage': true,
            'overflow-property': true,
            'overflow-wrap-property': false,
            'place-properties': true,
            'position-area-property': true,
            'prefers-color-scheme-query': false,
            'property-rule-prelude-list': true,
            'random-function': false,
            'rebeccapurple-color': true,
            'relative-color-syntax': false,
            'scope-pseudo-class': false,
            'sign-functions': false,
            'stepped-value-functions': false,
            'syntax-descriptor-syntax-production': { preserve: false },
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
    /**
     * @category Meta
     */
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
            ts: {
                mergeArraysInTsConfig: true,
                tidyGlobs: undefined,
            },
        };
    }
    /**
     * @category Meta
     */
    args;
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * Current project config.
     *
     * @category Internal
     *
     * @since 0.3.0-beta — Removed from constructor params.
     */
    config;
    /**
     * Current CLI params.
     *
     * @category Internal
     *
     * @since 0.3.0-beta — Removed from constructor params.
     */
    params;
    /**
     * Instance used to log messages and debugging info.
     *
     * @category Internal
     *
     * @since 0.3.0-beta — Removed from constructor params.
     */
    console;
    /**
     * Instance used to work with paths and files.
     *
     * @category Internal
     *
     * @since 0.3.0-beta — Removed from constructor params.
     */
    fs;
    /**
     * @category Constructor
     */
    constructor(
        /**
         * The name of the stage using this compiler instance.
         *
         * @category Internal
         *
         * @since 0.3.0-beta
         */
        stage,
        /**
         * An error handler for caught errors.
         *
         * @category Internal
         *
         * @since 0.3.0-beta
         */
        errorHandler,
    ) {
        this.stage = stage;
        this.errorHandler = errorHandler;
        this.config = this.stage.config;
        this.params = this.stage.params;
        this.console = this.stage.console;
        this.fs = this.stage.fs;
        this.args = this.parseArgs(this.ARGS_DEFAULT, this.config.compiler);
        this.getTsConfigOutDir = this.getTsConfigOutDir.bind(this);
        this.postCSS = this.postCSS.bind(this);
        this.readTsConfigFile = this.readTsConfigFile.bind(this);
        this.resolveTsConfig = this.resolveTsConfig.bind(this);
        this.sassCompileAsync = this.sassCompileAsync.bind(this);
        this.scss = this.scss.bind(this);
        this.scssAPI = this.scssAPI.bind(this);
        this.scssCLI = this.scssCLI.bind(this);
        this.scssBulk = this.scssBulk.bind(this);
        this.tsConfig = this.tsConfig.bind(this);
        this.typescript = this.typescript.bind(this);
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /**
     * Logs the message for the benchmark end notice.
     *
     * @category Internal
     *
     * @since 0.3.0-alpha.1
     */
    benchmarkEndTimeLog(msg, level, start, end, linesOut = 0) {
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
                linesOut,
                maxWidth: null,
            },
        );
    }
    /**
     * Logs the message for the benchmark start notice.
     *
     * @category Internal
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
                maxWidth: null,
            },
        );
    }
    /**
     * Gets the value of the given tsconfig file.
     *
     * @category Typescript
     *
     * @throws {@link StageError}  If the tsconfig file doesn’t exist and errorIfNotFound is truthy.
     *
     * @param tsconfig         Path to TS config json.
     * @param level            Depth level for this message.
     * @param errorIfNotFound  Whether to throw an error if tsconfig is not found.
     *
     * @since 0.2.0-alpha
     */
    async getTsConfigOutDir(tsconfig, level, errorIfNotFound = true) {
        const resolvedConfig = await this.resolveTsConfig(
            tsconfig,
            level,
            errorIfNotFound,
        );
        // returns
        if (
            resolvedConfig.compilerOptions.noEmit
            || !resolvedConfig.compilerOptions.outDir
        ) {
            return false;
        }
        return this.fs
            .pathResolve(
                this.fs.dirname(resolvedConfig.path),
                resolvedConfig.compilerOptions.outDir,
            )
            .replace(/\/+$/gi, '');
    }
    /**
     * Combines two ts config objects, overriding and merging as applicable.
     *
     * @category Typescript
     *
     * @since 0.3.0-beta
     */
    mergeTsConfigs(fallbacks, overrides) {
        const compilerOptions = mergeArgs(
            fallbacks.compilerOptions ?? {},
            overrides.compilerOptions,
            true,
            this.args.ts.mergeArraysInTsConfig,
        );
        const extendsArr = (
            (
                typeof fallbacks.extends !== 'undefined'
                && !Array.isArray(fallbacks.extends)
            ) ?
                [fallbacks.extends]
            :   (fallbacks.extends ?? [])).concat(
            (
                typeof overrides.extends !== 'undefined'
                    && !Array.isArray(overrides.extends)
            ) ?
                [overrides.extends]
            :   (overrides.extends ?? []),
        );
        return {
            ...fallbacks,
            exclude: undefined,
            include: undefined,
            files: undefined,
            ...overrides,
            extends: extendsArr.length ? extendsArr : undefined,
            compilerOptions,
            $schema: 'https://json.schemastore.org/tsconfig',
        };
    }
    /**
     * @category PostCSS
     */
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
     * Gets the value of the given tsconfig file.
     *
     * @category Typescript
     *
     * @throws {@link StageError}  If the tsconfig file doesn’t exist and errorIfNotFound is truthy.
     *
     * @param tsconfig         Path to TS config json used to compile the project.
     * @param level            Depth level for this message.
     * @param errorIfNotFound  Whether to throw an error if tsconfig is not found.
     *
     * @since 0.2.0-alpha
     * @since 0.3.0-beta — Renamed from getTsConfig to readTsConfigFile.
     */
    readTsConfigFile(tsconfig, level, errorIfNotFound = true) {
        this.console.verbose('getting tsconfig file content...', level);
        let resolvedPath = this.fs.pathResolve(tsconfig);
        let errMsg = null;
        if (!this.fs.exists(resolvedPath)) {
            errMsg = 'tsconfig path does not exist: ' + tsconfig;
        } else if (!this.fs.isFile(resolvedPath)) {
            errMsg = 'tsconfig path was not a file: ' + tsconfig;
        }
        // throws and unsets resolvedPath
        if (errMsg) {
            // throws
            if (errorIfNotFound) {
                throw new StageError(errMsg, {
                    class: 'Stage_Compiler',
                    method: 'readTsConfigFile',
                });
            }
            resolvedPath = null;
        }
        const parsedFileContent =
            resolvedPath ?
                JSON.parse(
                    this.fs
                        .readFile(resolvedPath)
                        .replace(/^\s*\/\/[^\n]*$/gim, ''),
                )
            :   {};
        return typeof parsedFileContent === 'object' ? parsedFileContent : {};
    }
    /**
     * Takes an input tsconfig path (or object) and attempts to resolve and
     * include the values from any configs in its "extends".
     *
     * @category Typescript
     *
     * @since 0.3.0-beta
     */
    async resolveTsConfig(tsconfig, level, errorIfNotFound = true) {
        const _tsconfig_obj =
            typeof tsconfig === 'string' ?
                {
                    ...this.readTsConfigFile(tsconfig, level, errorIfNotFound),
                    path: tsconfig,
                }
            :   tsconfig;
        const path = _tsconfig_obj.path;
        this.console.verbose('resolving tsconfig contents...', level);
        const resolvedObj = {
            ..._tsconfig_obj,
            compilerOptions: _tsconfig_obj.compilerOptions ?? {},
        };
        const extendsValue =
            typeof resolvedObj.extends === 'string' ?
                [resolvedObj.extends]
            :   resolvedObj.extends;
        // returns
        if (!extendsValue) {
            return { ...resolvedObj, path };
        }
        delete resolvedObj.extends;
        const extendsPaths = new Set(extendsValue);
        const localBasePath =
            resolvedObj.path ?
                [this.fs.pathRelative(this.fs.dirname(resolvedObj.path))]
            :   [];
        const _errCatcher = (err) => {
            if (
                typeof err !== 'object'
                || err?.code !== 'ERR_MODULE_NOT_FOUND'
            ) {
                const compileError = new Stage_Compiler.Error(
                    `An error was thrown while trying to resolve a path (${path}) extended by the ts config at ${this.fs.pathRelative(resolvedObj.path)}`,
                    Stage_Compiler.Error.Code.Caught,
                    {
                        stage: this.stage.name,
                        method: 'compiler.resolveTsConfig',
                    },
                    err,
                );
                if (errorIfNotFound) {
                    throw compileError;
                } else {
                    this.errorHandler(compileError, level, {
                        exitProcess: false,
                    });
                }
            }
        };
        /**
         * The complete resolved value of the ts configs being extended.
         */
        let extendsObject = {};
        // deletes extendees from extendsPaths on success
        for (const _path of extendsValue) {
            const _isRelative = _path.match(/^\.*\//gi) !== null;
            /**
             * The object from the extended json file.
             */
            let _filepath;
            // tries as a package module
            if (!_isRelative) {
                let __modulePath;
                try {
                    __modulePath = import.meta.resolve(_path);
                } catch (err) {
                    _errCatcher(err);
                }
                if (__modulePath) {
                    _filepath = decodeURI(__modulePath).replace(
                        /^file:\/\//gi,
                        '',
                    );
                }
            }
            if (!_filepath) {
                _filepath = this.fs.pathResolve(...localBasePath, _path);
                // tries some other options
                if (!this.fs.exists(_filepath)) {
                    _filepath = this.fs.pathResolve(_path);
                    // tries some other options
                    if (!_isRelative && !this.fs.exists(_filepath)) {
                        _filepath = this.fs.pathResolve(
                            this.config.paths.modules,
                            ...localBasePath,
                            _path,
                        );
                        // tries some other options
                        if (!this.fs.exists(_filepath)) {
                            _filepath = this.fs.pathResolve(
                                this.config.paths.modules,
                                _path,
                            );
                        }
                    }
                }
            }
            // continues
            if (!_filepath || !this.fs.exists(_filepath)) {
                this.console.debug(
                    `a _path (${_path}) extended by the ts config at ${this.fs.pathRelative(resolvedObj.path)} could not be found`,
                    level,
                );
                continue;
            }
            const _pathResolvedValue = await this.resolveTsConfig(
                _filepath,
                (this.params.verbose ? 1 : 0) + level,
                errorIfNotFound,
            ).catch((err) => _errCatcher(err));
            // continues
            if (!_pathResolvedValue) {
                this.console.debug(
                    `a _path (${_path}) extended by the ts config at ${this.fs.pathRelative(resolvedObj.path)} could not be resolved`,
                    level,
                );
                continue;
            }
            extendsObject = this.mergeTsConfigs(
                extendsObject,
                _pathResolvedValue,
            );
            extendsPaths.delete(_path);
        }
        const mergedResolvedObj = {
            ...this.mergeTsConfigs(extendsObject, resolvedObj),
            path: resolvedObj.path,
        };
        if (extendsPaths.size) {
            mergedResolvedObj.extends = Array.from(extendsPaths.values());
        }
        return objectKeySort(mergedResolvedObj, true);
    }
    /**
     * Runs the compileAsync from the sass package and returns with an ending
     * timestamp.
     *
     * @category Sass
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
     * @category Sass
     */
    static DEFAULT_PATHTOSASSLOGGINGROOT =
        'node_modules/@maddimathon/build-utilities/package.json';
    /**
     * Filters the paths in stack traces from the sass compiler API.
     *
     * @category Sass
     *
     * @since 0.3.0-alpha.3
     */
    sassErrorStackFilter(stack, opts) {
        const pathToSassLoggingRoot =
            opts.pathToSassLoggingRoot
            ?? this.args.sass?.pathToSassLoggingRoot
            ?? Stage_Compiler.DEFAULT_PATHTOSASSLOGGINGROOT;
        const regex_stackPath = /^(\s*)([^\s]+)\s+(\d+:\d+)(?=\s|$)/i;
        const regex_stackURL =
            /^(\s*at\s+[^\n]*?\s+)\(?(?:file\:\/\/)?([\\|\/|\.][^\(\)]+)(?:\s+|\:)(\d+:\d+)?\)?(?=\s|$)/;
        const splitStack = stack
            .replace(/^\s*Error:\s+Error:\s+/, 'Error: ')
            .split(/\s*\n/)
            .filter((l) => l);
        const _resolvePaths = (line) => {
            const match = line.match(regex_stackPath);
            if (!match) {
                return line;
            }
            const [fullMatch, startPadding = '', path = '', lineLocation = ''] =
                match;
            if (!fullMatch) {
                return line;
            }
            const relativePath = this.fs.pathRelative(
                this.fs.pathResolve(pathToSassLoggingRoot, path),
            );
            return line.replace(
                regex_stackPath,
                escRegExpReplace(
                    `${startPadding}${relativePath}:${lineLocation}`,
                ),
            );
        };
        const _resolveURLs = (line) => {
            const _matches = line.match(regex_stackURL);
            if (!_matches) {
                return line;
            }
            const [fullMatch, startPadding = '', path = '', lineLocation = ''] =
                _matches;
            if (!fullMatch || !path) {
                return line;
            }
            const relativePath = this.fs
                .pathRelative(
                    this.fs.pathResolve(pathToSassLoggingRoot, decodeURI(path)),
                )
                .replace(' ', '%20');
            return line.replace(
                regex_stackURL,
                escRegExpReplace(
                    `${startPadding}(${relativePath}:${lineLocation})`,
                ),
            );
        };
        return splitStack.map((line) => _resolveURLs(_resolvePaths(line)));
    }
    /**
     * Runs a bare-bones instance of the sass API to compile. Intended only for
     * use by {@link Stage_Compiler.scssAPI} and {@link Stage_Compiler.scssBulk}.
     *
     * @category Sass
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
     * @category Sass
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
            if (this.args.sass?.holdDeprecationsToEnd) {
                logger.outputAllDeprecations();
            }
            return { output, logger };
        });
    }
    /**
     * Coverts scss args for the CLI.
     *
     * @category Sass
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
     * @category Sass
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
     *
     * @category Sass
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
    /**
     * @category Sass
     *
     * @since 0.3.0-alpha.1
     */
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
                    .map((result, index) => {
                        // returns
                        if (result.status == 'rejected') {
                            if (
                                typeof result.reason === 'object'
                                && result.reason !== null
                            ) {
                                try {
                                    if (
                                        typeof result.reason.context
                                        === 'undefined'
                                    ) {
                                        result.reason.context = {};
                                    }
                                    result.reason.context.source =
                                        chunk[index]?.input;
                                } catch (err) {}
                            }
                            compileErrors.push(result.reason);
                            return false;
                        }
                        return result.value.output;
                    })
                    .filter((v) => v !== false),
            );
            compiledPaths.push(...compiled);
            if (opts.benchmarkCompileTime) {
                const _msg =
                    paths.length > maxConcurrent ?
                        ` – ${compiled.length}/${chunk.length} files`
                    :   '';
                this.benchmarkEndTimeLog(
                    `done compiling chunk #${i / maxConcurrent + 1}${_msg}`,
                    1 + level,
                    _chunkStart,
                    DateTime.now(),
                    1,
                );
            }
        }
        if (opts.benchmarkCompileTime) {
            this.benchmarkEndTimeLog(
                `bulk compile finished – ${compiledPaths.length}/${pathCount} files`,
                level,
                startTime,
                DateTime.now(),
            );
        }
        await compiler.dispose();
        // throws errors
        if (compileErrors.length) {
            throw compileErrors;
        }
        // outputs deprecation warnings
        if (this.args.sass?.holdDeprecationsToEnd) {
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
     * Returns a default, simple tsconfig object (using config for paths).
     *
     * @category Typescript
     *
     * @since 0.3.0-beta — Converted to a method instead of an accessor for better path-matching.
     */
    tsConfig({ path, ...compilerOptions } = {}) {
        const outDir =
            compilerOptions?.outDir
            ?? this.fs.pathRelative(
                this.fs.pathResolve(
                    path
                        ?.replace(/(?<=^|\/)[^\/]*\.[a-z][a-z|0-9|\-]*$/gi, '')
                        .replace(/(?<=^|\/)[^\/]+(\/|$)/g, '..\/') ?? '../',
                    this.config.getDistDir(this.fs),
                    'ts',
                ),
            );
        const exclude = ['**/node_modules/**/*'];
        return {
            extends: '@maddimathon/build-utilities/tsconfig',
            exclude,
            compilerOptions: {
                ...(compilerOptions ?? {}),
                rootDir: compilerOptions?.rootDir ?? './',
                outDir,
            },
        };
    }
    /**
     * {@inheritDoc Stage.Compiler.typescript}
     *
     * @category Typescript
     *
     * @since 0.2.0-alpha — Now has errorIfNotFound param for use with new {@link Stage_Compiler.getTsConfigOutDir} method.
     */
    async typescript(tsconfig, level, errorIfNotFound) {
        this.console.verbose('running tsc...', level);
        const outDir = await this.getTsConfigOutDir(
            tsconfig,
            (this.params.verbose ? 1 : 0) + level,
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
 * @category Stages
 *
 * @since 0.3.0-alpha.12
 *
 * @internal
 */
(function (Stage_Compiler) {
    /**
     * An extension of the utilities error used by the {@link Stage_Compiler} class.
     *
     * @since 0.3.0-beta
     *
     * @internal
     */
    class Error extends AbstractError {
        code;
        name = 'Stage_Compiler Error';
        constructor(message, code, context, cause) {
            super(message, { class: 'Stage_Compiler', ...context }, cause);
            this.code = code;
        }
    }
    Stage_Compiler.Error = Error;
    /**
     * Used only for {@link Stage_Compiler.Error}.
     *
     * @since 0.3.0-beta
     *
     * @internal
     */
    (function (Error) {
        /**
         * All allowed error codes.
         *
         * @since 0.3.0-beta
         */
        let Code;
        (function (Code) {
            /**
             * Re-throwing caught error(s) with context and a new trace.
             */
            Code[(Code['Caught'] = 0)] = 'Caught';
        })((Code = Error.Code || (Error.Code = {})));
    })((Error = Stage_Compiler.Error || (Stage_Compiler.Error = {})));
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
        args;
        deprecationWarnings = new Map();
        _sassLoggerWarningDuringPackaging = false;
        get sassLoggerWarningDuringPackaging() {
            return this._sassLoggerWarningDuringPackaging;
        }
        level;
        constructor(console, fs, params, sassErrorStackFilter, level, args) {
            this.console = console;
            this.fs = fs;
            this.params = params;
            this.sassErrorStackFilter = sassErrorStackFilter;
            this.args = args;
            this.level = level + (this.params.verbose ? 1 : 0);
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
                this.console.warn(theseMsgs, this.level, {
                    bold: false,
                    clr: 'yellow',
                    italic: false,
                    linesIn: 1,
                    linesOut: 1,
                    joiner: '\n',
                    time: {
                        bold: true,
                    },
                });
                // varDumps[ depKey ] = _warningsArr;
            }
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
                    time: {
                        bold: true,
                    },
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

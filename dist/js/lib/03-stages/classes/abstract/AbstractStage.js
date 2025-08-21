/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.2.0-alpha.3
 * @license MIT
 */
import {
    escRegExp,
    escRegExpReplace,
    mergeArgs,
    toTitleCase,
} from '@maddimathon/utility-typescript/functions';
import { MessageMaker } from '@maddimathon/utility-typescript/classes';
import {
    errorHandler,
    writeLog,
    SemVer,
    logError,
    StageError,
} from '../../../@internal/index.js';
import { FileSystem } from '../../../00-universal/index.js';
import { getPackageJson } from '../../../00-universal/getPackageJson.js';
// import {
// } from '../../../01-config/index.js';
import { Stage_Compiler } from '../../../02-utils/classes/Stage_Compiler.js';
import { Stage_Console } from '../../../02-utils/classes/Stage_Console.js';
/**
 * Abstract class for a single build stage, along with a variety of utilities
 * for building projects.
 *
 * @category Stages
 *
 * @typeParam T_Args      Argument object for this stage.
 * @typeParam T_SubStage  String literal of substages to run within this stage.
 *
 * @since 0.1.0-alpha
 */
export class AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
    /**
     * {@inheritDoc Stage.clr}
     *
     * @category Config
     */
    clr;
    /**
     * {@inheritDoc Stage.config}
     *
     * @category Config
     */
    config;
    /**
     * {@inheritDoc Stage.console}
     *
     * @category Utilities
     */
    console;
    /**
     * {@inheritDoc Stage.compiler}
     *
     * @category Utilities
     */
    compiler;
    /** @hidden */
    #fs;
    /**
     * {@inheritDoc Stage.fs}
     *
     * @category Utilities
     */
    get fs() {
        // returns
        if (typeof this.#fs === 'undefined') {
            return new FileSystem(this.console, this.config.fs);
        }
        return this.#fs;
    }
    /**
     * {@inheritDoc Stage.fs}
     *
     * @category Utilities
     */
    set fs(fs) {
        this.#fs = fs ?? new FileSystem(this.console, this.config.fs);
    }
    /**
     * {@inheritDoc Stage.name}
     *
     * @category Config
     */
    name;
    /**
     * {@inheritDoc Stage.params}
     *
     * @category Config
     */
    params;
    /** @hidden */
    #pkg;
    /**
     * {@inheritDoc Stage.pkg}
     *
     * @category Project
     */
    get pkg() {
        if (typeof this.#pkg === 'undefined') {
            this.#pkg = this.try(getPackageJson, 1, [this.fs]);
        }
        const repository =
            typeof this.#pkg?.repository === 'string' ?
                this.#pkg?.repository
            :   this.#pkg?.repository?.url;
        return {
            name: this.#pkg?.name,
            version: this.#pkg?.version,
            description: this.#pkg?.description,
            homepage: this.#pkg?.homepage,
            config: this.#pkg?.config,
            license: this.#pkg?.license,
            repository,
            engines: this.#pkg?.engines,
            files: this.#pkg?.files,
            main: this.#pkg?.main,
            bin: this.#pkg?.bin,
            bugs: this.#pkg?.bugs,
        };
    }
    /** @hidden */
    #releaseDir;
    /**
     * Path to release directory for building a package for the current version.
     *
     * @category Config
     */
    get releaseDir() {
        if (this.#releaseDir === undefined) {
            const name = this.pkg.name.replace(/^@([^\/]+)\//, '$1_');
            const version = this.version
                .toString(this.isDraftVersion)
                .replace(/\./gi, '-');
            this.#releaseDir = this.fs.pathRelative(
                this.fs.pathResolve(
                    this.config.paths.release,
                    `${name}@${version}`,
                ),
            );
        }
        return this.#releaseDir;
    }
    /** @hidden */
    #version;
    /**
     * {@inheritDoc Stage.version}
     *
     * @category Project
     */
    get version() {
        if (typeof this.#version === 'undefined') {
            try {
                this.console.vi.debug(
                    { 'SemVer input': this.pkg.version ?? '0.0.0' },
                    1,
                );
                this.#version = new SemVer(
                    this.pkg.version ?? '0.0.0',
                    this.console,
                );
            } catch (error) {
                error = new StageError(
                    'Error while constructing SemVer',
                    {
                        class: 'AbstractStage',
                        method: 'get version',
                        file: __filename,
                    },
                    { cause: error },
                );
                this.handleError(error, 1);
                throw error;
            }
        }
        return this.#version;
    }
    /**
     * If undefined, nothing is set.  Otherwise, a {@link SemVer} is created and
     * the value of {@link AbstractStage.pkg}.version is updated.
     */
    set version(input) {
        if (!input) {
            return;
        }
        // returns
        if (input instanceof SemVer) {
            this.#version = input;
            return;
        }
        try {
            this.console.vi.debug(
                { 'SemVer input': this.pkg.version ?? '0.0.0' },
                1,
            );
            this.#version = new SemVer(input, this.console);
        } catch (error) {
            error = new StageError(
                'Error while constructing SemVer',
                {
                    class: 'AbstractStage',
                    method: 'set version',
                    file: __filename,
                },
                { cause: error },
            );
            this.handleError(error, 1);
            throw error;
        }
        if (this.#pkg) {
            this.#pkg.version = this.#version.toString();
        }
    }
    /* Args ===================================== */
    /**
     * Builds a complete version of this class' args, falling back to defaults
     * as needed.
     *
     * Uses {@link mergeArgs} recursively.
     *
     * @category Config
     */
    buildArgs(args) {
        return mergeArgs(this.ARGS_DEFAULT, args ?? {}, true);
    }
    /**
     * {@inheritDoc Stage.args}
     *
     * @category Config
     */
    args;
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @category Constructor
     *
     * @param name     Name for this stage used for notices.
     * @param clr      Colour used for colour-coding this class.
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param args     Partial overrides for the default stage args.
     * @param pkg      Parsed contents of the project’s package.json file.
     * @param version  Version object for the project’s version.
     */
    constructor(name, clr, config, params, args, pkg, version) {
        this.#pkg = pkg;
        this.name = name;
        this.clr = clr;
        this.config = config;
        this.params = params;
        this.version = version;
        this.console = new Stage_Console(this.clr, this.config, this.params);
        this.args = this.buildArgs(args);
        this.fs = this.args.utils.fs;
        this.compiler =
            this.args.utils.compiler
            ?? new Stage_Compiler(
                this.config,
                this.params,
                this.console,
                this.fs,
            );
        this.uncaughtErrorListener = this.uncaughtErrorListener.bind(this);
    }
    /* METHODS
     * ====================================================================== */
    /** {@inheritDoc Stage.isDraftVersion} */
    get isDraftVersion() {
        return (
            !(this.params?.packaging || this.params?.releasing)
            || !!this.params?.dryrun
        );
    }
    /**
     * Replaces placeholders in files as defined by {@link Config.replace}.
     *
     * @category Utilities
     *
     * @param globs     Where to find & replace placeholders.
     * @param version   Which version of the replacements to run.
     * @param level     Depth level for output to the console.
     * @param ignore    Globs to ignore while replacing. Default {@link FileSystem.globs.SYSTEM}.
     * @param docsMode  Whether to make the replacements in 'docs' mode (i.e.,
     *                  assumes markdown in comments was converted to HTML).
     *
     * @return  Paths where placeholders were replaced.
     */
    replaceInFiles(globs, version, level, ignore = [], docsMode = false) {
        let replacements =
            typeof this.config.replace === 'function' ?
                this.config.replace(this)[version]
            :   this.config.replace[version];
        // returns
        if (!replacements) {
            return [];
        }
        this.console.verbose(`making ${version} replacements...`, level);
        if (docsMode) {
            this.console.verbose(`running in docs mode`, 1 + level);
            replacements = replacements.map(([_find, _repl]) => {
                // returns
                if (typeof _find !== 'string') {
                    const _findString = _find
                        .toString()
                        .replace(/(^\/|\/[a-z]+$)/g, '');
                    // returns
                    if (_findString.match(/^___[^\s]+___$/g) === null) {
                        return [_find, _repl];
                    }
                    const _findHTML =
                        '<em><strong>'
                        + _findString.replace(/(^___|___$)/g, '')
                        + '<\\/strong><\\/em>';
                    const _regex = new RegExp(
                        `(${_findString}|${_findHTML})`,
                        _find.toString().match(/(^\/|(?<=\/)([a-z]+)$)/g)?.[1]
                            || 'g',
                    );
                    return [_regex, _repl];
                }
                // returns
                if (_find.match(/^___[^\s]+___$/g) === null) {
                    return [_find, _repl];
                }
                const _findHTML =
                    '<em><strong>'
                    + _find.replace(/(^___|___$)/g, '')
                    + '</strong></em>';
                const _regex = new RegExp(
                    `(${escRegExp(_find)}|${escRegExp(_findHTML)})`,
                    'g',
                );
                return [_regex, _repl];
            });
        }
        const replaced = this.fs.replaceInFiles(
            globs,
            replacements,
            (this.params.verbose ? 1 : 0) + level,
            {
                ignore: ignore ?? FileSystem.globs.SYSTEM,
            },
        );
        this.console.verbose(
            `replaced ${version} placeholders in ${replaced.length} files`,
            1 + level,
            { italic: true },
        );
        return replaced;
    }
    /**
     * Alias for {@link internal.writeLog}.
     *
     * @category Errors
     *
     * @param msg       Log message to write.
     * @param filename  File name for the log.
     * @param subDir    Subdirectories used for the path to write the log file.
     * @param date      Used for the timestamp.
     *
     * @return  If false, writing the log failed. Otherwise, this is the path to
     *          the written log file.
     */
    writeLog(msg, filename, subDir = [], date = null) {
        if (!msg.length) {
            return false;
        }
        return writeLog(msg, filename, {
            config: this.config,
            date: date ?? new Date(),
            fs: this.fs,
            subDir,
        });
    }
    /* CONFIG & ARGS ===================================== */
    /**
     * {@inheritDoc Stage.isSubStageIncluded}
     *
     * @category Config
     */
    isSubStageIncluded(subStage, level) {
        this.params.debug
            && this.console.verbose(
                `isSubStageIncluded( '${subStage}' )`,
                level,
                { italic: true },
            );
        // returns
        if (!(subStage in this) || typeof this[subStage] !== 'function') {
            return false;
        }
        // returns
        if (!this.subStages.includes(subStage)) {
            return false;
        }
        this.params.debug
            && this.console.vi.verbose(
                { 'this.params.only': this.params.only },
                1 + level,
                { italic: true },
            );
        const only = {
            isUndefined: !this.params.only || !this.params.only.length,
        };
        const include = Boolean(
            only.isUndefined
                || this.params.only == subStage
                || this.params.only.includes(subStage),
        );
        this.params.debug
            && this.console.vi.verbose({ include }, 1 + level, {
                italic: true,
            });
        if (this.params.debug && this.params.verbose && !include) {
            this.console.vi.verbose(
                {
                    include: {
                        isUndefined: only.isUndefined,
                        'this.params.only == subStage':
                            this.params.only == subStage,
                        'this.params.only.includes( subStage )':
                            this.params.only.includes(subStage),
                    },
                },
                2 + level,
                { italic: true },
            );
        }
        this.params.debug
            && this.console.vi.verbose(
                { 'this.params.without': this.params.without },
                1 + level,
                { italic: true },
            );
        const without = {
            isDefined: this.params.without || this.params.without.length,
        };
        const exclude = Boolean(
            without.isDefined
                && (this.params.without == subStage
                    || this.params.without.includes(subStage)),
        );
        this.console.vi.debug({ exclude }, 1 + level, { italic: true });
        if (this.params.debug && this.params.verbose && exclude) {
            this.console.vi.verbose(
                {
                    exclude: {
                        isDefined: without.isDefined,
                        'this.params.without == subStage':
                            this.params.without == subStage,
                        'this.params.without.includes( subStage )':
                            this.params.without.includes(subStage),
                    },
                },
                2 + level,
                { italic: true },
            );
        }
        const result = Boolean(include && !exclude && this[subStage]);
        this.console.vi.debug(
            { 'isSubStageIncluded() return': result },
            1 + level,
            { italic: true },
        );
        if (this.params.debug && this.params.verbose && !result) {
            this.console.vi.verbose(
                {
                    result: {
                        include,
                        exclude,
                        'this[ subStage as keyof typeof this ]': Boolean(
                            this[subStage],
                        ),
                    },
                },
                2 + level,
                { italic: true },
            );
        }
        return result;
    }
    /**
     * {@inheritDoc Stage.getDistDir}
     *
     * @category Config
     */
    getDistDir(subDir, ...subpaths) {
        return this.config.getDistDir(this.fs, subDir, ...(subpaths ?? []));
    }
    /**
     * {@inheritDoc Stage.getScriptsPath}
     *
     * @category Config
     */
    getScriptsPath(subDir, ...subpaths) {
        return this.config.getScriptsPath(this.fs, subDir, ...(subpaths ?? []));
    }
    /**
     * {@inheritDoc Stage.getSrcDir}
     *
     * @category Config
     */
    getSrcDir(subDir, ...subpaths) {
        return this.config.getSrcDir(this.fs, subDir, ...(subpaths ?? []));
    }
    /* ERRORS ===================================== */
    /**
     * Alias for {@link errorHandler}.
     *
     * @category Errors
     *
     * @param error    Error to handle.
     * @param level    Depth level for output to the console.
     * @param args     Overrides for default options.
     */
    handleError(error, level, args) {
        return errorHandler(error, level, this.console, this.fs, args);
    }
    /**
     * Alias for {@link internal.logError}.
     *
     * @category Errors
     *
     * @param logMsg  Message to prepend to the return for output to the console.
     * @param error   Caught error to log.
     * @param level   Depth level for output to the console.
     * @param errMsg  See {@link logError.Args.errMsg}.
     * @param date    Used for the timestamp.
     */
    logError(logMsg, error, level, errMsg, date) {
        return logError(logMsg, error, level, {
            errMsg,
            console: this.console,
            fs: this.fs,
            date,
        });
    }
    /**
     * Handles uncaught errors in node.
     *
     * @param error  To handle.
     *
     * @since 0.2.0-alpha
     */
    uncaughtErrorListener(error) {
        this.handleError(error, 1);
    }
    /**
     * Runs a function, with parameters as applicable, and catches (& handles)
     * anything thrown.
     *
     * For the asynchronous method, see {@link AbstractStage.atry}.
     *
     * Overloaded for better function param typing.
     *
     * @category Errors
     *
     * @experimental
     */
    try(tryer, level, params, handlerArgs) {
        try {
            return tryer(...(params ?? []));
        } catch (error) {
            this.handleError(error, level, handlerArgs);
            return 'FAILED';
        }
    }
    /**
     * Runs a function (asynchronously), with parameters as applicable, and
     * catches (& handles) anything thrown.
     *
     * For the synchronous method, see {@link AbstractStage.try}.
     *
     * Overloaded for better function param typing.
     *
     * @category Errors
     *
     * @experimental
     */
    async atry(tryer, level, params, handlerArgs) {
        try {
            return await tryer(...(params ?? []));
        } catch (error) {
            this.handleError(error, level, handlerArgs);
            return 'FAILED';
        }
    }
    /* MESSAGES ===================================== */
    /**
     * {@inheritDoc Stage.startEndNotice}
     *
     * @category Running
     */
    startEndNotice(which, watcherVersion = false) {
        const uppercase = {
            name: this.name.toUpperCase(),
            which: which?.toUpperCase() ?? '',
        };
        const messages =
            (
                watcherVersion
                && (this.params.watchedWatcher
                    || this.params.watchedFilename
                    || this.params.watchedEvent)
            ) ?
                {
                    default: [
                        ['👀 ', { flag: false }],
                        [
                            `[watch-change-${which}] file ${this.params.watchedEvent}: ${this.params.watchedFilename}`,
                        ],
                    ],
                    start: [
                        ['🚨 ', { flag: false }],
                        [
                            `[watch-change-${which}] file ${this.params.watchedEvent}: ${this.params.watchedFilename}`,
                        ],
                    ],
                    end: [
                        ['✅ ', { flag: false }],
                        [
                            `[watch-change-${which}] file ${this.params.watchedEvent}: ${this.params.watchedFilename}`,
                        ],
                    ],
                }
            :   {
                    default: [[`${uppercase.which}ING ${uppercase.name}`]],
                    start: [[`${uppercase.name} ${uppercase.which}ING...`]],
                    end: [
                        ['✓ ', { flag: false }],
                        [
                            `${toTitleCase(this.name)} Complete!`,
                            { italic: true },
                        ],
                    ],
                };
        this.console.startOrEnd(messages[which ?? 'default'], which);
    }
    /* RUNNING ===================================== */
    /**
     * Runs the entire stage (asynchronously).
     *
     * This method should probably not be overwritten, except in completely
     * custom class implementations.
     *
     * Cycles through each substage and runs {@link AbstractStage.runSubStage}
     * if {@link AbstractStage.isSubStageIncluded} returns true.
     *
     * @category Running
     */
    async run() {
        /* start */
        await this.startEndNotice('start');
        this.console.vi.debug({ subStages: this.subStages }, 1);
        /* loop through the steps in order */
        for (const method of this.subStages) {
            this.params.debug
                && this.console.verbose(`testing method: ${method}`, 1, {
                    italic: true,
                });
            if (
                method in this
                && typeof this[method] === 'function'
                && this.isSubStageIncluded(
                    method,
                    this.params.debug && this.params.verbose ? 2 : 1,
                )
            ) {
                await this.runSubStage(method);
            }
        }
        /* end */
        await this.startEndNotice('end');
    }
    /**
     * Runs the given stage as a sub-stage to the current one.
     *
     * **This method should probably not be overwritten.**
     *
     * @param stage  Stage to run as a substage.
     * @param level  Depth level for output to the console.
     *
     * @category Running
     */
    async runStage(stage, level) {
        const _onlyKey = `only-${stage}`;
        const _withoutKey = `without-${stage}`;
        const _subParams = {
            ...this.params,
            'log-base-level': level + this.params['log-base-level'],
            only: this.params[_onlyKey],
            without: this.params[_withoutKey],
        };
        const _subConsole = new Stage_Console(
            this.clr,
            this.config,
            _subParams,
        );
        const [stageClass, stageArgs = {}] =
            (await this.config.getStage(stage, _subConsole)) ?? [];
        // returns
        if (!stageClass) {
            return;
        }
        if (stageArgs.utils?.compiler) {
            stageArgs.utils.compiler = undefined;
        }
        if (stageArgs.utils?.fs) {
            stageArgs.utils.fs = undefined;
        }
        this.params.debug && this.console.vi.verbose({ _subParams }, level);
        return new stageClass(
            this.config,
            _subParams,
            stageArgs,
            this.#pkg,
            this.#version,
        ).run();
    }
    /**
     * This runs a custom sub-stage that only copies a whole folder at the given
     * subpath from the source to the dist directories.
     *
     * Deletes any existing, logs update messages, etc.
     *
     * @category Running
     *
     * @param subpath       The subdriectory, relative to src path.
     * @param _distDir      Optionally force a diffrent output directory than the auto-generated one.
     * @param logLevelBase  Base output level for log messages.
     *
     * @since 0.1.4-alpha
     * @since 0.2.0-alpha.1 — Added logLevelBase param.
     *
     * @experimental
     */
    async runCustomDirCopySubStage(subpath, _distDir, logLevelBase = 1) {
        this.console.progress(
            'copying ' + subpath + ' to dist...',
            0 + logLevelBase,
        );
        const distDir =
            _distDir ?? this.getDistDir(undefined).replace(/\/$/g, '');
        if (this.fs.exists(distDir)) {
            this.console.verbose(
                'deleting any existing files...',
                1 + logLevelBase,
            );
            this.fs.delete(
                [distDir + '/' + subpath],
                (this.params.verbose ? 2 : 1) + logLevelBase,
            );
        }
        const srcDir = this.getSrcDir(undefined).replace(/\/+$/gi, '');
        // returns
        if (!this.fs.exists(srcDir + '/' + subpath)) {
            this.console.verbose(
                'ⅹ source dir '
                    + this.fs.pathRelative(srcDir)
                    + ' does not exist, exiting...',
                1 + logLevelBase,
            );
            return;
        }
        // returns
        if (!this.fs.isDirectory(srcDir + '/' + subpath)) {
            this.console.verbose(
                'ⅹ source dir '
                    + this.fs.pathRelative(srcDir)
                    + ' is not a directory, exiting...',
                1 + logLevelBase,
            );
            return;
        }
        this.console.verbose('copying files...', 1 + logLevelBase);
        this.fs.copy(
            subpath,
            (this.params.verbose ? 2 : 1) + logLevelBase,
            distDir,
            srcDir,
            {
                force: true,
                rename: true,
                recursive: true,
            },
        );
    }
    /**
     * @category Running
     *
     * @experimental
     */
    async runCustomScssDirSubStage(subpath, _distDir, _opts, logLevelBase = 1) {
        this.console.progress(
            'compiling ' + subpath + ' to css...',
            0 + logLevelBase,
        );
        const distDir =
            _distDir ?? this.getDistDir(undefined, subpath).replace(/\/$/g, '');
        // if the output dir exists, we should delete the old contents
        if (this.fs.exists(distDir)) {
            this.console.verbose(
                'deleting existing dist files...',
                1 + logLevelBase,
            );
            this.fs.delete(
                [distDir],
                (this.params.verbose ? 2 : 1) + logLevelBase,
            );
        }
        const srcDir = this.getSrcDir(undefined, subpath).replace(/\/+$/gi, '');
        // returns
        if (!this.fs.exists(srcDir)) {
            this.console.progress(
                'ⅹ source dir '
                    + this.fs.pathRelative(srcDir)
                    + ' does not exist, exiting...',
                1 + logLevelBase,
            );
            return [];
        }
        // returns
        if (!this.fs.isDirectory(srcDir)) {
            this.console.progress(
                'ⅹ source dir '
                    + this.fs.pathRelative(srcDir)
                    + ' is not a directory, exiting...',
                1 + logLevelBase,
            );
            return [];
        }
        const opts = mergeArgs(
            AbstractStage.runCustomScssDirSubStage.DEFAULT_OPTS,
            typeof _opts === 'boolean' ? { postCSS: _opts } : _opts,
        );
        this.params.debug
            && this.console.verbose(
                'globbing for scss files...',
                1 + logLevelBase,
            );
        const scssPaths = this.fs
            .glob(
                opts.globs.map((_g) => srcDir + '/' + _g.replace(/^\//gi, '')),
                {
                    ignore: [...FileSystem.globs.SYSTEM, ...opts.ignoreGlobs],
                },
            )
            .filter(this.fs.isFile)
            .map(this.fs.pathRelative);
        // returns
        if (!scssPaths.length) {
            this.console.verbose(
                'ⅹ no css, sass, or scss files found',
                1 + logLevelBase,
            );
            return [];
        }
        const regex = {
            srcDir: new RegExp(
                escRegExp(srcDir.replace(/\/$/g, '') + '/'),
                'gi',
            ),
        };
        this.params.debug
            && this.console.verbose(
                'building path arguments...',
                1 + logLevelBase,
            );
        const scssPathArgs = scssPaths.map((_path) => {
            const _output = this.fs
                .pathRelative(_path)
                .replace(regex.srcDir, escRegExpReplace(distDir + '/'))
                .replace(/\.(sass|scss)$/gi, '.css')
                .replace(/\/_?index\.css$/gi, '.css');
            this.params.debug
                && this.console.verbose(
                    `${_path} → ${_output}`,
                    2 + logLevelBase,
                    { italic: true },
                );
            return {
                input: _path,
                output: _output,
            };
        });
        this.console.vi.debug(
            { scssPathArgs },
            (this.params.verbose ? 2 : 1) + logLevelBase,
        );
        this.console.verbose(
            'compiling to css at ' + distDir + '...',
            1 + logLevelBase,
        );
        await Promise.all(
            scssPathArgs.map(({ input, output }) => {
                const _level = (this.params.verbose ? 2 : 1) + logLevelBase;
                return this.atry(this.compiler.scss, _level, [
                    input,
                    output,
                    _level,
                ]);
            }),
        );
        if (opts.postCSS) {
            this.console.verbose(
                'processing with postcss...',
                1 + logLevelBase,
            );
            await this.atry(
                this.compiler.postCSS,
                (this.params.verbose ? 2 : 1) + logLevelBase,
                [
                    scssPathArgs.map((_o) => ({ from: _o.output })),
                    (this.params.verbose ? 2 : 1) + logLevelBase,
                ],
            );
        }
        return scssPathArgs.map((_o) => _o.output);
    }
}
/**
 * Utilities for the {@link AbstractStage} class.
 *
 * @since 0.2.0-alpha.2
 */
(function (AbstractStage) {
    /**
     * Utilities for the {@link AbstractStage.runCustomScssDirSubStage} method.
     *
     * @since 0.2.0-alpha.2
     */
    let runCustomScssDirSubStage;
    (function (runCustomScssDirSubStage) {
        /**
         * Default options for the {@link AbstractStage.runCustomScssDirSubStage}
         * method.
         *
         * @see {@link Opts} For property details.
         *
         * @since 0.2.0-alpha.2
         *
         * @source
         */
        runCustomScssDirSubStage.DEFAULT_OPTS = {
            globs: ['**/*.scss', '**/*.sass', '**/*.css'],
            ignoreGlobs: ['**/_*'],
            postCSS: true,
        };
    })(
        (runCustomScssDirSubStage =
            AbstractStage.runCustomScssDirSubStage
            || (AbstractStage.runCustomScssDirSubStage = {})),
    );
})(AbstractStage || (AbstractStage = {}));
//# sourceMappingURL=AbstractStage.js.map

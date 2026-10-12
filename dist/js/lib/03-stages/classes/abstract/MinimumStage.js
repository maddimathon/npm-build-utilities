/**
 * @since 0.3.0-beta.3
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.3
 * @license MIT
 */
import {
    escRegExp,
    escRegExpReplace,
    mergeArgs,
    softWrapText,
    toTitleCase,
    VariableInspector,
} from '@maddimathon/utility-typescript';
import {
    errorHandler,
    writeLog,
    SemVer,
    logError,
    StageError,
    getErrorInfo,
    errorStringify,
} from '../../../@internal/index.js';
import { FileSystem } from '../../../00-universal/index.js';
import { getPackageJson } from '../../../00-universal/getPackageJson.js';
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
 * @since 0.3.0-beta.3 — Is a pared-down version of {@link AbstractStage} (which now extends this class) and relocated many of its methods.
 */
export class MinimumStage {
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
                        class: 'MinimumStage',
                        method: 'get version',
                        file: 'src/ts/lib/03-stages/classes/abstract/MinimumStage.ts',
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
     * the value of {@link MinimumStage.pkg}.version is updated.
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
                    class: 'MinimumStage',
                    method: 'set version',
                    file: 'src/ts/lib/03-stages/classes/abstract/MinimumStage.ts',
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
        this.atry = this.atry.bind(this);
        this.getDistDir = this.getDistDir.bind(this);
        this.getScriptsPath = this.getScriptsPath.bind(this);
        this.getSrcDir = this.getSrcDir.bind(this);
        this.logError = this.logError.bind(this);
        this.replaceInFiles = this.replaceInFiles.bind(this);
        this.run = this.run.bind(this);
        this.startEndNotice = this.startEndNotice.bind(this);
        this.try = this.try.bind(this);
        this.uncaughtErrorListener = this.uncaughtErrorListener.bind(this);
        this.writeLog = this.writeLog.bind(this);
        this.compiler =
            this.args.utils.compiler
            ?? new Stage_Compiler(this, this.handleError);
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
     * Whether the current run is the result of a watched change.
     *
     * @category Config
     *
     * @since 0.3.0-alpha.1
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     */
    get isWatchedUpdate() {
        return Boolean(
            !(this.params?.packaging || this.params?.releasing)
            && (this.params.watchedWatcher
                || this.params.watchedFilename
                || this.params.watchedEvent),
        );
    }
    /**
     * Default scss options according to config & params.
     *
     * @category Sass
     *
     * @since 0.3.0-alpha.1
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     */
    get sassOpts() {
        return {
            isWatchedUpdate: this.isWatchedUpdate,
        };
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
    /* COMPILERS ===================================== */
    /**
     * Takes completed arguments and runs sass functions with proper error
     * handling.
     *
     * @category Sass
     *
     * @since 0.3.0-beta
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     */
    async compileScss(paths, logLevelBase, completeSassOpts, opts = {}) {
        const level_1 = logLevelBase + (this.params.verbose ? 1 : 0);
        const catcher = (error) =>
            this.sassErrorHandler(error, level_1, completeSassOpts);
        this.console.verbose(
            opts.startMsg ?? 'compiling to css...',
            logLevelBase,
        );
        const compile =
            paths.length < 2 && paths[0]?.input && paths[0]?.output ?
                this.compiler
                    .scss(
                        paths[0].input,
                        paths[0].output,
                        level_1,
                        completeSassOpts,
                    )
                    .catch(catcher)
            :   this.compiler
                    .scssBulk(
                        paths,
                        level_1,
                        completeSassOpts,
                        opts.maxConcurrent,
                    )
                    .catch(catcher);
        return compile.then(async (_outputPaths) => {
            const outputPaths =
                typeof _outputPaths == 'string' ? [_outputPaths] : _outputPaths;
            if (opts.replace) {
                this.console.verbose(
                    'replacing in compiled files...',
                    logLevelBase,
                );
                for (const _key of ['current', 'package']) {
                    this.try(this.replaceInFiles, level_1, [
                        outputPaths,
                        _key,
                        level_1,
                    ]);
                }
            }
            if (opts.postCSS) {
                this.console.verbose(
                    'processing with postcss...',
                    logLevelBase,
                );
                let _postCSSpaths = outputPaths;
                const { ignoreGlobs, ...postCssOpts } =
                    typeof opts.postCSS === 'object' ? opts.postCSS : {};
                if (ignoreGlobs?.length) {
                    _postCSSpaths = this.fs.glob(_postCSSpaths, {
                        ignore: ignoreGlobs,
                    });
                }
                await this.atry(this.compiler.postCSS, level_1, [
                    _postCSSpaths.map((from) => ({ from })),
                    level_1,
                    postCssOpts,
                ]);
            }
            if (opts.prettier) {
                this.console.verbose(
                    'formatting with prettier...',
                    logLevelBase,
                );
                await this.atry(this.fs.prettier, level_1, [
                    outputPaths,
                    'scss',
                ]);
            }
            return outputPaths;
        });
    }
    /* CONFIG & ARGS ===================================== */
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
     * Handles uncaught errors in
     *
     * @param error  To handle.
     *
     * @since 0.2.0-alpha
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     */
    uncaughtErrorListener(error) {
        this.handleError(error, 1);
    }
    /**
     * Handles errors thrown during sass compile.
     *
     * @category Sass
     *
     * @since 0.3.0-alpha.3
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     */
    sassErrorHandler(error, level, opts, _args) {
        const { method = 'error', ...args } = _args ?? {};
        const errorArr =
            Array.isArray(error) && error.every((err) => err instanceof Error) ?
                error
            :   [error];
        const regex_clrs = /^\s*(\\x1b\[[\d;:]+m\s*)*/gs;
        const stackFilter = (stack) =>
            stack ?
                this.compiler
                    .sassErrorStackFilter(
                        String(stack).replace(regex_clrs, '').trim(),
                        opts,
                    )
                    .join('\n')
            : typeof stack === 'string' ? stack.replace(regex_clrs, '').trim()
            : stack;
        for (const err of errorArr) {
            const msgs = [];
            const isSassError =
                typeof err == 'object'
                && ('sassStack' in err || 'sassMessage' in err);
            if (isSassError || err instanceof Error) {
                const errArgs = { exitProcess: false };
                const [typedError, errInfo] = getErrorInfo(
                    err,
                    this.console,
                    this.fs,
                    errArgs,
                );
                if (isSassError) {
                    const _typedError = typedError;
                    const shortMessage =
                        _typedError.sassMessage
                            ?.trim()
                            .replace(/^\s*(Error:\s*)+\s+/gs, '') ?? '';
                    const _regexMaker_msgStart = (msg) =>
                        new RegExp(
                            '^\\s*((Error:\\s*)*\\s+)?\\s*('
                                + msg
                                    .split(/\s*\n+\s*/g)
                                    .map((line) => escRegExp(line))
                                    .join('[\\n\\s]*')
                                + ')?',
                            'gs',
                        );
                    if (shortMessage) {
                        const _regex_short_msg =
                            _regexMaker_msgStart(shortMessage);
                        if (errInfo.stack) {
                            errInfo.stack = errInfo.stack.replace(
                                _regex_short_msg,
                                '',
                            );
                        }
                        if (errInfo.message) {
                            errInfo.message = errInfo.message.replace(
                                _regex_short_msg,
                                '',
                            );
                        }
                    }
                    const includeStack = !(errInfo.message && errInfo.stack);
                    errInfo.stack = errInfo.stack?.replace(
                        _regexMaker_msgStart(errInfo.message ?? ''),
                        '    ',
                    );
                    let message =
                        errInfo.message ? [[stackFilter(errInfo.message)]] : [];
                    if (!includeStack && errInfo.stack) {
                        const _msg =
                            errInfo.message ?
                                softWrapText(
                                    errInfo.message,
                                    this.console.nc.msg.args.msg.maxWidth ?? 80,
                                )
                            :   errInfo.message;
                        message = [
                            [
                                (_msg ? stackFilter(_msg) + '\n\n' : '')
                                    + '    '
                                    + stackFilter(errInfo.stack),
                                { bold: false, italic: false, maxWidth: null },
                            ],
                        ];
                    }
                    errInfo.stack = stackFilter(errInfo.stack);
                    msgs.push(
                        [
                            `[Sass: Error] ${stackFilter(shortMessage)}`,
                            { bold: true, italic: false },
                        ],
                        ...message,
                        ...errorStringify.output(
                            err,
                            errInfo,
                            this.console,
                            this.fs,
                            errArgs,
                        ),
                        ...errorStringify.cause(
                            errInfo,
                            level,
                            this.console,
                            this.fs,
                            errArgs,
                        ),
                        ...(errInfo.message && errInfo.stack ?
                            []
                        :   errorStringify.stack(
                                errInfo,
                                this.console,
                                this.fs,
                                errArgs,
                            )),
                    );
                    if (this.params.debug) {
                        msgs.push(
                            ...errorStringify.details(
                                errInfo,
                                this.console,
                                this.fs,
                                errArgs,
                            ),
                            ...errorStringify.dump(
                                err,
                                errInfo,
                                this.console,
                                this.fs,
                                errArgs,
                                {
                                    isSassError,
                                },
                            ),
                        );
                    }
                } else {
                    msgs.push(
                        ...errorStringify.message(errInfo),
                        ...errorStringify.output(
                            err,
                            errInfo,
                            this.console,
                            this.fs,
                            errArgs,
                        ),
                        ...errorStringify.cause(
                            errInfo,
                            level,
                            this.console,
                            this.fs,
                            errArgs,
                        ),
                        ...errorStringify.stack(
                            errInfo,
                            this.console,
                            this.fs,
                            errArgs,
                        ),
                        ...errorStringify.details(
                            errInfo,
                            this.console,
                            this.fs,
                            errArgs,
                        ),
                        ...errorStringify.dump(
                            err,
                            errInfo,
                            this.console,
                            this.fs,
                            errArgs,
                            {
                                isSassError,
                                sassOpts: opts,
                            },
                        ),
                    );
                }
            } else {
                msgs.push([
                    VariableInspector.stringify({ err }),
                    { bold: false, italic: false, maxWidth: null },
                ]);
            }
            this.console[method](msgs, level, {
                linesIn: 1,
                linesOut: 1,
                ...(args ?? {}),
                joiner: '\n\n',
            });
        }
        // exits
        if (this.params.packaging || this.params.releasing) {
            process.exit();
        }
        return [];
    }
    /**
     * Runs a function, with parameters as applicable, and catches (& handles)
     * anything thrown.
     *
     * For the asynchronous method, see {@link MinimumStage.atry}.
     *
     * Overloaded for better function param typing.
     *
     * @category Errors
     *
     * @experimental
     */
    try = (tryer, level, params, handlerArgs, fallbackReturn = 'FAILED') => {
        try {
            return tryer(...(params ?? []));
        } catch (error) {
            this.handleError(error, level, handlerArgs);
            return fallbackReturn;
        }
    };
    /**
     * Runs a function (asynchronously), with parameters as applicable, and
     * catches (& handles) anything thrown.
     *
     * For the synchronous method, see {@link MinimumStage.try}.
     *
     * Overloaded for better function param typing.
     *
     * @category Errors
     *
     * @experimental
     */
    atry = (tryer, level, params, handlerArgs, fallbackReturn = 'FAILED') =>
        Promise.resolve(tryer(...(params ?? []))).catch((error) => {
            this.handleError(error, level, handlerArgs);
            return fallbackReturn ?? 'FAILED';
        });
    /* MESSAGES ===================================== */
    /**
     * {@inheritDoc Stage.startEndNotice}
     *
     * @category Running
     */
    startEndNotice(_which, watcherVersion = false) {
        watcherVersion = watcherVersion && this.isWatchedUpdate;
        const {
            message,
            messageArgs = {},
            watcherMessage,
            which,
        } =
            _which && typeof _which === 'object' ?
                {
                    message: _which.message,
                    messageArgs: _which.args,
                    watcherMessage: _which.watcherMessage,
                    which: _which.flag,
                }
            :   {
                    which: _which,
                };
        const uppercase = {
            name: this.name.toUpperCase(),
            which: which?.toUpperCase() ?? '',
        };
        const watchFileName = () => {
            let msg = '';
            if (this.params.watchedEvent) {
                msg += ` ${this.params.watchedEvent}`;
                if (this.params.watchedFilename) {
                    msg += `: ${this.params.watchedFilename}`;
                }
            } else if (this.params.watchedFilename) {
                msg += ` ${this.params.watchedFilename}`;
            }
            return msg;
        };
        const watchFileNameMsg = watcherVersion && watchFileName();
        const watchChangeNoticeSlug =
            this.params.watchedWatcher ?
                `${this.params.watchedWatcher} - ${which}`
            :   `watched change: ${which}`;
        switch (which) {
            case 'start':
            case 'end':
            case null:
                const messages =
                    watcherVersion ?
                        {
                            default: [
                                ['👀 ', { flag: false }],
                                [
                                    `[${watchChangeNoticeSlug}] ${watchFileNameMsg || ''}`,
                                ],
                            ],
                            start: [
                                ['🚨 ', { flag: false }],
                                [
                                    `[${watchChangeNoticeSlug}] ${watchFileNameMsg || ''}`,
                                ],
                            ],
                            end: [
                                ['✅ ', { flag: false }],
                                [
                                    `[${watchChangeNoticeSlug}] ${watchFileNameMsg || ''}`,
                                ],
                            ],
                        }
                    :   {
                            default: [
                                [`${uppercase.which}ING ${uppercase.name}`],
                            ],
                            start: [
                                [`${uppercase.name} ${uppercase.which}ING...`],
                            ],
                            end: [
                                ['✓ ', { flag: false }],
                                [
                                    `${toTitleCase(this.name)} Complete!`,
                                    { italic: true },
                                ],
                            ],
                        };
                this.console.startOrEnd(messages[which ?? 'default'], which);
                break;
            default:
                const customMessage =
                    watcherVersion ?
                        (watcherMessage ?? message ?? [])
                    :   (message ?? []);
                this.console.log(customMessage, 0, {
                    bold: true,
                    italic: false,
                    joiner: '',
                    ...messageArgs,
                });
                break;
        }
    }
    async run(callback) {
        // returns
        if (!callback) {
            await this.startEndNotice({
                args: { flag: false },
                flag: 'skipped',
                message: [
                    ['⨉ ', { flag: false }],
                    ['Skipped run', { flag: true }],
                    ['No callback param was passed.', { italic: true }],
                ],
                watcherMessage: [
                    ['⛔️ ', { flag: false }],
                    ['Skipped run', { flag: true }],
                    ['No callback param was passed.', { italic: true }],
                ],
            });
            return undefined;
        }
        /* start */
        await this.startEndNotice('start');
        const result = await callback.bind(this)();
        /* end */
        await this.startEndNotice('end');
        return result;
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
     * @since 0.3.0-beta.2 — Renamed from runCustomDirCopySubStage to customCopySubstage.
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     *
     * @experimental
     */
    async customCopySubstage(subpath, _distDir, logLevelBase = 1) {
        this.console.progress(
            'copying ' + subpath + ' to dist...',
            0 + logLevelBase,
        );
        const distDir =
            _distDir ?? this.getDistDir(undefined).replace(/\/$/g, '');
        if (!this.isWatchedUpdate && this.fs.exists(distDir)) {
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
        this.try(this.fs.copy, (this.params.verbose ? 2 : 1) + logLevelBase, [
            subpath,
            (this.params.verbose ? 2 : 1) + logLevelBase,
            distDir,
            srcDir,
            {
                force: true,
                rename: false,
                recursive: true,
            },
        ]);
    }
    /**
     * This runs a custom sub-stage that uses globs to find non-partial
     * scss/sass files and compile them at the given subpath from the source to
     * the dist directories.
     *
     * Deletes any existing, logs update messages, etc.
     *
     * @category Running
     *
     * @since 0.1.4-alpha
     * @since 0.2.0-alpha — Added `postCSS` param and PostCSS compatibility.
     * @since 0.2.0-alpha.1 — Added `logLevelBase` param.
     * @since 0.2.0-alpha.2 — Changed `postCSS` param to `options` object param. Added returning output css filepaths. Improved some issues with the async compiling and sub-file finding.
     * @since 0.3.0-alpha.1 — Added `sassOpts` param and allowed `subpath` to be an array.
     * @since 0.3.0-beta.2 — Changed `sassOpts` param to a property in `options`. Renamed from runCustomScssDirSubStage to customScssSubstage and switched from a method to an object returning dir and demoDir methods.
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     *
     * @experimental
     */
    get customScssSubstage() {
        const _baseMethod = async function (
            _subpaths,
            _distDir,
            _opts,
            logLevelBase = 1,
        ) {
            const subpaths = Array.isArray(_subpaths) ? _subpaths : [_subpaths];
            const { sass: sassOpts, ...opts } = mergeArgs(
                MinimumStage.customScssSubstage.DEFAULT_OPTS,
                _opts,
            );
            const srcDir = (opts.srcDir ?? this.getSrcDir()).replace(
                /\/$/g,
                '',
            );
            const srcSubpaths = subpaths.map((path) =>
                this.fs.pathResolve(srcDir, path),
            );
            const distDir = (_distDir ?? this.getDistDir()).replace(/\/$/g, '');
            this.console.progress(
                'compiling '
                    + srcSubpaths.map(this.fs.pathRelative).join(', ')
                    + ' to css at '
                    + distDir
                    + '...',
                0 + logLevelBase,
            );
            const distSubpaths = subpaths.map((path) =>
                this.fs.pathResolve(distDir, path),
            );
            // if the output dir exists, we should delete the old contents
            if (
                opts.clearOutputDir
                && !this.isWatchedUpdate
                && distSubpaths.filter(this.fs.exists).length
            ) {
                this.console.verbose(
                    'deleting existing dist files...',
                    1 + logLevelBase,
                );
                this.fs.delete(
                    opts.clearOutputDir === 'complete' ?
                        distDir
                    :   [`${distDir}/**/*.css`, `${distDir}/**/*.css.map`],
                    (this.params.verbose ? 2 : 1) + logLevelBase,
                );
            }
            // returns
            if (!srcSubpaths.filter(this.fs.exists).length) {
                this.console.progress(
                    `ⅹ source dir(s) ${subpaths.map(this.fs.pathRelative).join(', ')} do not exist in ${srcDir}, exiting...`,
                    1 + logLevelBase,
                );
                return [];
            }
            // returns
            if (!srcSubpaths.filter(this.fs.isDirectory).length) {
                this.console.progress(
                    `ⅹ source dir(s) ${subpaths.map(this.fs.pathRelative).join(', ')} in ${srcDir} are not directories, exiting...`,
                    1 + logLevelBase,
                );
                return [];
            }
            this.params.debug
                && this.console.verbose(
                    'globbing for scss files...',
                    1 + logLevelBase,
                );
            const scssPaths = this.fs
                .glob(
                    opts.globs
                        .map((_g) =>
                            srcSubpaths.map(
                                (src) => src + '/' + _g.replace(/^\//gi, ''),
                            ),
                        )
                        .flat(),
                    {
                        ignore: [
                            ...FileSystem.globs.SYSTEM,
                            ...opts.ignoreGlobs,
                        ],
                    },
                )
                .filter(this.fs.isFile)
                .map(this.fs.pathRelative);
            // returns
            if (!scssPaths.length) {
                this.console.progress(
                    `ⅹ no css, sass, or scss files found in ${srcDir} subpaths ${subpaths.map(this.fs.pathRelative).join(', ')}, exiting...`,
                    1 + logLevelBase,
                    { italic: true },
                );
                return [];
            }
            const regex = {
                srcDir: new RegExp(escRegExp(srcDir + '/'), 'gi'),
            };
            const regex_replace = {
                distDir: escRegExpReplace(distDir + '/'),
            };
            const scssPaths_mapped = scssPaths.map((input) => ({
                input,
                output: this.fs
                    .pathRelative(input)
                    .replace(regex.srcDir, regex_replace.distDir)
                    .replace(/\.(sass|scss)$/gi, '.css')
                    .replace(/\/_?index\.css$/gi, '.css'),
            }));
            return this.compileScss(
                scssPaths_mapped,
                (this.params.verbose ? 2 : 1) + logLevelBase,
                { ...this.sassOpts, ...sassOpts },
                {
                    startMsg: 'compiling to css at ' + distDir + '...',
                    ...opts,
                },
            );
        }.bind(this);
        return {
            dir: async function (...args) {
                return _baseMethod(...args);
            }.bind(this),
            demoDir: async function (
                subpaths,
                distDir,
                opts = {},
                logLevelBase,
            ) {
                return _baseMethod(
                    subpaths,
                    distDir,
                    {
                        clearOutputDir: false,
                        postCSS: false,
                        replace: true,
                        prettier: true,
                        ...opts,
                    },
                    logLevelBase,
                );
            }.bind(this),
        };
    }
}
/**
 * Utilities for the {@link MinimumStage} class.
 *
 * @category Stages
 *
 * @since 0.3.0-beta.3 — Is a pared-down version of {@link AbstractStage} (which now extends this class) and relocated many of its methods.
 */
(function (MinimumStage) {
    /**
     * Utilities for the {@link MinimumStage.customScssSubstage} methods.
     *
     * @since 0.2.0-alpha.2
     * @since 0.3.0-beta.2 — Renamed from runCustomScssDirSubStage to customScssSubstage.
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     */
    let customScssSubstage;
    (function (customScssSubstage) {
        /**
         * Default options for the {@link MinimumStage.customScssSubstage}
         * methods.
         *
         * @see {@link customScssSubstage.Opts} For property details.
         *
         * @since 0.2.0-alpha.2
         * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
         *
         * @source
         */
        customScssSubstage.DEFAULT_OPTS = {
            clearOutputDir: 'targeted',
            globs: ['**/*.scss', '**/*.sass', '**/*.css'],
            ignoreGlobs: ['**/_*'],
            maxConcurrent: undefined,
            postCSS: true,
            prettier: false,
            replace: false,
            startMsg: undefined,
        };
    })(
        (customScssSubstage =
            MinimumStage.customScssSubstage
            || (MinimumStage.customScssSubstage = {})),
    );
})(MinimumStage || (MinimumStage = {}));

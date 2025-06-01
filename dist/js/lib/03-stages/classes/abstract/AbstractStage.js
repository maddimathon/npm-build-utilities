/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-alpha.draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import {
    mergeArgs,
    toTitleCase,
} from '@maddimathon/utility-typescript/functions';
import {
    errorHandler,
    writeLog,
    SemVer,
    logError,
} from '../../../@internal/index.js';
import { FileSystem } from '../../../00-universal/index.js';
import { getPackageJson } from '../../../00-universal/getPackageJson.js';
// import {
// } from '../../../02-utils/index.js';
import { Stage_Console } from '../../../02-utils/classes/Stage_Console.js';
import { Stage_Compiler } from '../../../02-utils/classes/Stage_Compiler.js';
/**
 * Abstract class for a single build stage, along with a variety of utilities
 * for building projects.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 */
export class AbstractStage {
    _pkg;
    _version;
    /* STATIC
     * ====================================================================== */
    /* Args ===================================== */
    /**
     * Default values for {@link Stage.Args}.
     *
     * @category Args
     */
    static get ARGS_DEFAULT() {
        return {
            objs: {},
        };
    }
    /* PROPERTIES
     * ====================================================================== */
    /**
     * {@inheritDoc Stage.Class.clr}
     *
     * @category Args
     */
    clr;
    /**
     * {@inheritDoc Stage.Class.config}
     *
     * @category Args
     */
    config;
    /**
     * {@inheritDoc Stage.Class.console}
     *
     * @category Utilities
     */
    console;
    /**
     * {@inheritDoc Stage.Class.compiler}
     *
     * @category Utilities
     */
    compiler;
    /** @hidden */
    #fs;
    /**
     * {@inheritDoc Stage.Class.fs}
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
     * {@inheritDoc Stage.Class.fs}
     *
     * @category Utilities
     */
    set fs(fs) {
        this.#fs = fs ?? new FileSystem(this.console, this.config.fs);
    }
    /**
     * {@inheritDoc Stage.Class.name}
     *
     * @category Args
     */
    name;
    /**
     * {@inheritDoc Stage.Class.params}
     *
     * @category Args
     */
    params;
    /**
     * {@inheritDoc Stage.Class.pkg}
     *
     * @category Project
     */
    get pkg() {
        if (typeof this._pkg === 'undefined') {
            this._pkg = this.try(getPackageJson, 1, [this.fs]);
        }
        const repository =
            typeof this._pkg?.repository === 'string'
                ? this._pkg?.repository
                : this._pkg?.repository?.url;
        return {
            name: this._pkg?.name,
            version: this._pkg?.version,
            description: this._pkg?.description,
            homepage: this._pkg?.homepage,
            config: this._pkg?.config,
            license: this._pkg?.license,
            repository,
            engines: this._pkg?.engines,
            files: this._pkg?.files,
            main: this._pkg?.main,
            bin: this._pkg?.bin,
            bugs: this._pkg?.bugs,
        };
    }
    /** @hidden */
    #releasePath;
    /**
     * Path to release directory for building a package for the current version.
     */
    get releasePath() {
        if (this.#releasePath === undefined) {
            const name = this.pkg.name.replace(/^@([^\/]+)\//, '$1_');
            const version = this.version
                .toString(this.isDraftVersion)
                .replace(/\./gi, '-');
            this.#releasePath = this.fs.pathRelative(
                this.fs.pathResolve(
                    this.config.paths.release,
                    `${name}@${version}`,
                ),
            );
        }
        return this.#releasePath;
    }
    /**
     * {@inheritDoc Stage.Class.version}
     *
     * @category Project
     */
    get version() {
        if (typeof this._version === 'undefined') {
            this._version = new SemVer(
                this.pkg.version ?? '0.0.0',
                this.console,
            );
        }
        return this._version;
    }
    set version(input) {
        if (!input) {
            return;
        }
        // returns
        if (input instanceof SemVer) {
            this._version = input;
            return;
        }
        this._version = new SemVer(input, this.console);
        if (this._pkg) {
            this._pkg.version = this._version.toString();
        }
    }
    /* Args ===================================== */
    /**
     * Builds a complete version of this class' args, falling back to defaults
     * as needed.
     *
     * Uses {@link mergeArgs} recursively.
     *
     * @category Args
     */
    buildArgs(args) {
        return mergeArgs(this.ARGS_DEFAULT, args ?? {}, true);
    }
    /**
     * {@inheritDoc Stage.Class.args}
     *
     * @category Args
     */
    args;
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param name    Name for this stage used for notices.
     * @param clr     Colour used for colour-coding this class.
     * @param config  Current project config.
     * @param params  Current CLI params.
     * @param args    Partial overrides for the default stage args.
     */
    constructor(name, clr, config, params, args, _pkg, _version) {
        this._pkg = _pkg;
        this._version = _version;
        this.name = name;
        this.clr = clr;
        this.config = config;
        this.params = params;
        this.version = _version;
        this.console = new Stage_Console(this.clr, this.config, this.params);
        this.args = this.buildArgs(args);
        this.fs = this.args.objs.fs;
        this.compiler =
            this.args.objs.compiler
            ?? new Stage_Compiler(
                this.config,
                this.params,
                this.console,
                this.fs,
                this.config.compiler,
            );
    }
    /* METHODS
     * ====================================================================== */
    /** {@inheritDoc Stage.Class.isDraftVersion} */
    get isDraftVersion() {
        return (
            !(this.params?.packaging || this.params?.releasing)
            || !!this.params?.dryrun
        );
    }
    /**
     * Replaces placeholders in files as defined by {@link Config.replace}.
     *
     * @return  Paths to files where placeholders were replaced.
     */
    replaceInFiles(globs, version, level, ignore = []) {
        const replacements =
            typeof this.config.replace === 'function'
                ? this.config.replace(this)[version]
                : this.config.replace[version];
        // returns
        if (!replacements) {
            return [];
        }
        this.console.verbose(`making ${version} replacements...`, level);
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
     */
    writeLog(msg, filename, subDir = [], date = null) {
        if (!msg.length) {
            return;
        }
        return writeLog(msg, filename, {
            config: this.config,
            date: date ?? new Date(),
            fs: this.fs,
            subDir,
        });
    }
    /* CONFIG & ARGS ===================================== */
    /** {@inheritDoc Stage.Class.isSubStageIncluded} */
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
    /** {@inheritDoc Stage.Class.getDistDir} */
    getDistDir(subDir, ...subpaths) {
        return this.config.getDistDir(this.fs, subDir, ...subpaths);
    }
    /** {@inheritDoc Stage.Class.getScriptsPath} */
    getScriptsPath(subDir, ...subpaths) {
        return this.config.getScriptsPath(this.fs, subDir, ...subpaths);
    }
    /** {@inheritDoc Stage.Class.getSrcDir} */
    getSrcDir(subDir, ...subpaths) {
        return this.config.getSrcDir(this.fs, subDir, ...subpaths);
    }
    /* ERRORS ===================================== */
    /**
     * Alias for {@link errorHandler}.
     */
    handleError(error, level, args, exitProcess) {
        return errorHandler(
            error,
            level,
            this.console,
            this.fs,
            args,
            exitProcess,
        );
    }
    /**
     * Alias for {@link internal.logError}.
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
     * Runs a function, with parameters as applicable, and catches (& handles)
     * anything thrown.
     *
     * Overloaded for better function param typing.
     *
     * @category Errors
     *
     * @experimental
     */
    try(tryer, level, params, handlerArgs, exitProcess) {
        try {
            return tryer(...(params ?? []));
        } catch (error) {
            this.handleError(error, level, handlerArgs, exitProcess);
            return 'FAILED';
        }
    }
    /**
     * Runs a function, with parameters as applicable, and catches (& handles)
     * anything thrown.
     *
     * Overloaded for better function param typing.
     *
     * @category Errors
     *
     * @experimental
     */
    async atry(tryer, level, params, handlerArgs, exitProcess) {
        try {
            return await tryer(...(params ?? []));
        } catch (error) {
            this.handleError(error, level, handlerArgs, exitProcess);
            return 'FAILED';
        }
    }
    /* MESSAGES ===================================== */
    /** {@inheritDoc Stage.Class.startEndNotice} */
    startEndNotice(which, watcherVersion = false) {
        if (!this.params.notice) {
            return;
        }
        const uppercase = {
            name: this.name.toUpperCase(),
            which: which?.toUpperCase() ?? '',
        };
        const messages =
            watcherVersion
            && (this.params.watchedWatcher
                || this.params.watchedFilename
                || this.params.watchedEvent)
                ? {
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
                : {
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
     * @param stage   Stage to run as a substage.
     * @param level   Depth level to add to {@link CLI.Params.log-base-level | this.params['log-base-level']}.
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
        this.params.debug && this.console.vi.verbose({ _subParams }, level);
        return new stageClass(
            this.config,
            _subParams,
            stageArgs,
            this._pkg,
            this._version,
        ).run();
    }
}
//# sourceMappingURL=AbstractStage.js.map

/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.3
 * @license MIT
 */
import { arrayUnique } from '@maddimathon/utility-typescript';
import { SemVer } from '../../../@internal/index.js';
import {} from '../../../00-universal/index.js';
import { Stage_Console } from '../../../02-utils/classes/Stage_Console.js';
import { MinimumStage } from './MinimumStage.js';
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
export class AbstractStage extends MinimumStage {
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
        super(name, clr, config, params, args, pkg, version);
        this.isSubStageIncluded = this.isSubStageIncluded.bind(this);
        this.writeTsConfig = this.writeTsConfig.bind(this);
    }
    /* METHODS
     * ====================================================================== */
    /**
     * Takes an input tsconfig object and attempts to resolve and
     * include the values from any configs in its "extends".
     *
     * @category Typescript
     *
     * @since 0.3.0-beta
     * @since 0.3.0-beta.3 — Moved from {@link AbstractStage} to this class.
     */
    async writeTsConfig(
        outputPath,
        level,
        tsconfig,
        { appendToLib = 'if-exists', errorIfNotFound = true, ...args } = {},
    ) {
        const { path, ...resolvedConfig } = await this.compiler.resolveTsConfig(
            {
                ...tsconfig,
                path: outputPath,
            },
            level,
            errorIfNotFound,
        );
        // add the target and module to lib
        if (
            appendToLib === true
            || (appendToLib === 'if-exists'
                && resolvedConfig.compilerOptions.lib?.length)
        ) {
            const lib =
                resolvedConfig.compilerOptions.lib ?
                    Array.isArray(resolvedConfig.compilerOptions.lib) ?
                        resolvedConfig.compilerOptions.lib.map((str) =>
                            str.toLowerCase(),
                        )
                    :   [resolvedConfig.compilerOptions.lib.toLowerCase()]
                :   [];
            [
                resolvedConfig.compilerOptions.module,
                resolvedConfig.compilerOptions.target,
            ].forEach((value) => {
                // returns
                if (!value) {
                    return;
                }
                const lc_value = value?.toLowerCase();
                // returns
                if (lib.includes(lc_value)) {
                    return;
                }
                switch (lc_value) {
                    case 'es5':
                    case 'es2015':
                    case 'es6':
                    case 'es2016':
                    case 'es7':
                    case 'es2017':
                    case 'es2018':
                    case 'es2019':
                    case 'es2020':
                    case 'es2021':
                    case 'es2022':
                    case 'esnext':
                    case 'dom':
                    case 'webworker':
                    case 'scripthost':
                        lib.push(lc_value);
                        break;
                    default:
                        if (lc_value.match(/^(es)(\d+|next)$/i) !== null) {
                            lib.push(lc_value);
                        }
                        break;
                }
            });
            if (lib.length) {
                resolvedConfig.compilerOptions.lib = arrayUnique(lib);
            }
        }
        return this.try(this.fs.write, 1 + level, [
            outputPath,
            JSON.stringify(resolvedConfig, null, 4),
            {
                force: true,
                rename: false,
                ...args,
            },
        ]);
    }
    /* COMPILERS ===================================== */
    /* CONFIG & ARGS ===================================== */
    /**
     * {@inheritDoc Stage.isSubStageIncluded}
     *
     * @category Config
     *
     * @since 0.3.0-alpha.11 — Added args param.
     */
    isSubStageIncluded(subStage, level, args = {}) {
        this.params.debug
            && this.console.verbose(
                `isSubStageIncluded( '${subStage}' )`,
                level,
                { italic: true },
            );
        // returns conditionally
        if (args.checkIfSubStageIsMethod ?? true) {
            // returns
            if (!(subStage in this) || typeof this[subStage] !== 'function') {
                return false;
            }
        }
        // returns conditionally
        if (args.checkIfSubStageIsDefaultIncluded ?? true) {
            // returns
            if (!this.subStages.includes(subStage)) {
                return false;
            }
        }
        this.params.debug
            && this.console.vi.verbose(
                { 'this.params.only': this.params.only },
                1 + level,
                { msg: { italic: true } },
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
                msg: { italic: true },
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
                { msg: { italic: true } },
            );
        }
        this.params.debug
            && this.console.vi.verbose(
                { 'this.params.without': this.params.without },
                1 + level,
                { msg: { italic: true } },
            );
        const without = {
            isDefined: this.params.without || this.params.without.length,
        };
        const exclude = Boolean(
            without.isDefined
            && (this.params.without == subStage
                || this.params.without.includes(subStage)),
        );
        this.params.debug
            && this.console.vi.verbose({ exclude }, 1 + level, {
                msg: { italic: true },
            });
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
                { msg: { italic: true } },
            );
        }
        const result = Boolean(include && !exclude);
        this.console.vi.debug(
            { 'isSubStageIncluded() return': result },
            level + (this.params.verbose ? 1 : 0),
            { msg: { italic: true } },
        );
        if (this.params.debug && this.params.verbose && !result) {
            this.console.vi.verbose(
                {
                    result: {
                        include,
                        exclude,
                        'this[ subStage ]': Boolean(this[subStage]),
                    },
                },
                2 + level,
                { msg: { italic: true } },
            );
        }
        return result;
    }
    /* ERRORS ===================================== */
    /* MESSAGES ===================================== */
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
        await super.run(async function () {
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
        });
    }
    /**
     * Runs the given stage as a sub-stage to the current one.
     *
     * **This method should probably not be overwritten.**
     *
     * @param stageInput  Stage to run as a substage.
     * @param level       Depth level for output to the console.
     *
     * @category Running
     *
     * @since 0.3.0-alpha.10 — Added option to run a custom stage class.
     */
    async runStage(stageInput, level) {
        const [stage, stageClassCustom] =
            typeof stageInput === 'string' ? [stageInput] : stageInput;
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
            stageClassCustom ?
                [stageClassCustom]
            :   ((await this.config.getStage(stage, _subConsole)) ?? []);
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
        await new stageClass(
            this.config,
            _subParams,
            stageArgs,
            this.pkg,
            this.version,
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
     * @deprecated 0.3.0-beta.2 — Use {@link AbstractStage.customCopySubstage} instead.
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
     * @param subpath       The subdirectory, relative to src path.
     * @param distDir       Force a diffrent output directory than the auto-generated one.
     * @param opts          Additional options. See {@link AbstractStage.runCustomScssDirSubStage.DEFAULT_OPTS} for defaults.
     * @param logLevelBase  Base output level for log messages. Default 1.
     *
     * @since 0.1.4-alpha
     * @since 0.2.0-alpha — Added `postCSS` param and PostCSS compatibility.
     * @since 0.2.0-alpha.1 — Added `logLevelBase` param.
     * @since 0.2.0-alpha.2 — Changed `postCSS` param to `options` object param. Added returning output css filepaths. Improved some issues with the async compiling and sub-file finding.
     * @since 0.3.0-alpha.1 — Added `sassOpts` param and allowed `subpath` to be an array.
     * @since 0.3.0-beta.2 — Changed `sassOpts` param to a property in `options`. Renamed from runCustomScssDirSubStage to customScssSubstage and switched from a method to an object returning dir and demoDir methods.
     *
     * @deprecated 0.3.0-beta.2 — Use {@link AbstractStage.customScssSubstage.dir} instead.
     *
     * @experimental
     */
    async runCustomScssDirSubStage(subpath, distDir, opts, logLevelBase = 1) {
        return this.customScssSubstage.dir(
            subpath,
            distDir,
            opts,
            logLevelBase,
        );
    }
}
/**
 * Utilities for the {@link AbstractStage} class.
 *
 * @category Stages
 *
 * @since 0.2.0-alpha.2
 */
(function (AbstractStage) {
    /**
     * Utilities for the {@link AbstractStage.customScssSubstage} methods.
     *
     * @since 0.2.0-alpha.2
     * @since 0.3.0-beta.2 — Renamed from runCustomScssDirSubStage to customScssSubstage.
     */
    let customScssSubstage;
    (function (customScssSubstage) {
        /**
         * Default options for the {@link AbstractStage.customScssSubstage}
         * methods.
         *
         * @see {@link customScssSubstage.Opts} For property details.
         *
         * @since 0.2.0-alpha.2
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
            AbstractStage.customScssSubstage
            || (AbstractStage.customScssSubstage = {})),
    );
    /**
     * Utilities for the {@link AbstractStage.runCustomScssDirSubStage} method.
     *
     * @since 0.2.0-alpha.2
     * @deprecated 0.3.0-beta.2 — Use {@link customScssSubstage} namespace instead.
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
         * @deprecated 0.3.0-beta.2 — Use {@link customScssSubstage} namespace instead.
         *
         * @source
         */
        runCustomScssDirSubStage.DEFAULT_OPTS = {
            ...customScssSubstage.DEFAULT_OPTS,
        };
    })(
        (runCustomScssDirSubStage =
            AbstractStage.runCustomScssDirSubStage
            || (AbstractStage.runCustomScssDirSubStage = {})),
    );
})(AbstractStage || (AbstractStage = {}));

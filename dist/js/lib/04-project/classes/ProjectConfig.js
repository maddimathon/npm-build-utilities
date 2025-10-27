/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.1
 * @license MIT
 */
var _a;
import { typeOf } from '@maddimathon/utility-typescript/functions';
import { DummyConsole, isObjectEmpty } from '../../@internal/index.js';
import { FileSystem } from '../../00-universal/index.js';
// import {
// } from '../../01-config/index.js';
// import {
// } from '../../02-utils/index.js';
import { defaultConfig } from '../../03-stages/index.js';
/**
 * A super-simple class just for the configuration of the project.
 *
 * @category Config
 *
 * @since 0.1.0-alpha
 * @since 0.1.0-alpha.1 — Now implements {@link Config.Class} instead of
 *                            {@link Config.Internal}.
 */
export class ProjectConfig {
    /* STATIC
     * ====================================================================== */
    /** @hidden */
    static #default;
    /**
     * A “local” “cache” of default config values, used primarily for
     * {@link ProjectConfig.export}.
     *
     * @since 0.1.0-alpha.1
     */
    static get default() {
        if (typeof _a.#default === 'undefined') {
            this.#default = defaultConfig(new DummyConsole());
        }
        return this.#default;
    }
    /* LOCAL PROPERTIES
     * ====================================================================== */
    /** {@inheritDoc Config.clr} */
    clr;
    /** {@inheritDoc Config.compiler} */
    compiler;
    /** {@inheritDoc Config.console} */
    console;
    /** {@inheritDoc Config.fs} */
    fs;
    /** {@inheritDoc Config.launchYear} */
    launchYear;
    /** {@inheritDoc Config.paths} */
    paths;
    /** {@inheritDoc Config.replace} */
    replace;
    /** {@inheritDoc Config.stages} */
    stages;
    /** {@inheritDoc Config.title} */
    title;
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * To convert a {@link Config} type to a {@link Config.Internal} type, use
     * the {@link internal.internalConfig} function.
     */
    constructor(config) {
        this.clr = config.clr;
        this.compiler = config.compiler;
        this.console = config.console;
        this.fs = config.fs;
        this.launchYear = config.launchYear;
        this.paths = config.paths;
        this.replace = config.replace;
        this.stages = config.stages;
        this.title = config.title;
        if (this.stages.compile && Array.isArray(this.stages.compile)) {
            if (!this.stages.compile[1]) {
                this.stages.compile[1] = {};
            }
            if (
                this.stages.compile[1].files
                && typeof this.stages.compile[1].files === 'object'
            ) {
                const totalPathCount = Object.values(
                    this.stages.compile[1].files,
                )
                    .map((arr) => arr.length)
                    .reduce(
                        (runningTotal = 0, current = 0) =>
                            runningTotal + current,
                    );
                if (totalPathCount < 1) {
                    this.stages.compile[1].files = false;
                }
            }
        }
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /** @hidden */
    #export_path(key) {
        const defaults = _a.default;
        // returns
        switch (key) {
            case 'dist':
                let _dist = {};
                for (const t_subkey in this.paths.dist) {
                    const _subkey = t_subkey;
                    if (
                        this.paths.dist[_subkey]
                        !== defaults.paths.dist[_subkey]
                    ) {
                        _dist[_subkey] = this.paths.dist[_subkey];
                    }
                }
                // returns
                if (isObjectEmpty(_dist)) {
                    return undefined;
                }
                return _dist;
            case 'notes':
                let _notes = {};
                for (const t_subkey in this.paths.notes) {
                    const _subkey = t_subkey;
                    if (
                        this.paths.notes[_subkey]
                        !== defaults.paths.notes[_subkey]
                    ) {
                        _notes[_subkey] = this.paths.notes[_subkey];
                    }
                }
                // returns
                if (isObjectEmpty(_notes)) {
                    return undefined;
                }
                return _notes;
            case 'scripts':
                let _scripts = {};
                for (const t_subkey in this.paths.scripts) {
                    const _subkey = t_subkey;
                    if (
                        this.paths.scripts[_subkey]
                        !== defaults.paths.scripts[_subkey]
                    ) {
                        _scripts[_subkey] = this.paths.scripts[_subkey];
                    }
                }
                // returns
                if (isObjectEmpty(_scripts)) {
                    return undefined;
                }
                return _scripts;
            case 'src':
                let _src = {};
                for (const t_subkey in this.paths.src) {
                    const _subkey = t_subkey;
                    if (
                        this.paths.src[_subkey] !== defaults.paths.src[_subkey]
                    ) {
                        // @ts-expect-error - idk
                        _src[_subkey] = this.paths.src[_subkey];
                    }
                }
                // returns
                if (isObjectEmpty(_src)) {
                    return undefined;
                }
                return _src;
            // can only be a string, so should be gone already
            case 'changelog':
            case 'readme':
            case 'release':
            case 'snapshot':
                const _value_str = this.paths[key];
                // returns
                if (typeof _value_str === 'string') {
                    if (_value_str !== defaults.paths[key]) {
                        return _value_str;
                    }
                    return undefined;
                }
                // just type-checking
                const _test2 = _value_str;
                _test2;
                return undefined;
            default:
                // just type-checking
                const _test3 = key;
                _test3;
                break;
        }
        return undefined;
    }
    export() {
        const defaults = _a.default;
        const exportObj = {
            title: this.title,
            launchYear: this.launchYear,
            clr: undefined,
            compiler: undefined,
            console: undefined,
            fs: undefined,
            paths: undefined,
            stages: undefined,
        };
        // simple keys to compare to default
        for (const _key of ['clr']) {
            if (this[_key] !== defaults[_key]) {
                exportObj[_key] = this[_key];
            }
        }
        // checks that objects are NOT empty
        for (const _key of ['compiler', 'console', 'fs']) {
            if (this[_key] && !isObjectEmpty(this[_key])) {
                exportObj[_key] = this[_key];
            }
        }
        let stages = {};
        for (const t_stage in this.stages) {
            const _stage = t_stage;
            const _stageValue = this.stages[_stage];
            // continues
            if (typeof _stageValue === 'boolean') {
                if (_stageValue != !!defaults.stages[_stage]) {
                    stages[_stage] = _stageValue;
                }
                continue;
            }
            // continues - args are defined
            if (_stageValue[1]) {
                stages[_stage] =
                    isObjectEmpty(_stageValue[1]) ?
                        !!_stageValue != !!defaults.stages[_stage] ?
                            true
                        :   undefined
                    :   _stageValue[1];
                continue;
            }
            if (!!_stageValue != !!defaults.stages[_stage]) {
                stages[_stage] = !!_stageValue;
            }
        }
        // checks that objects are NOT empty
        if (!isObjectEmpty(stages)) {
            exportObj.stages = stages;
        }
        let paths = {};
        for (const t_key in this.paths) {
            const _key = t_key;
            const _value = this.#export_path(_key);
            if (!isObjectEmpty(_value)) {
                // @ts-expect-error - no clue
                paths[_key] = _value;
            }
        }
        // checks that objects are NOT empty
        if (!isObjectEmpty(paths)) {
            exportObj.paths = paths;
        }
        return exportObj;
    }
    getDistDir(fs, subDir, ...subpaths) {
        return fs.pathRelative(
            fs.pathResolve(this.paths.dist[subDir ?? '_'] ?? './', ...subpaths),
        );
    }
    getScriptsPath(fs, subDir, ...subpaths) {
        return fs.pathRelative(
            fs.pathResolve(
                this.paths.scripts[subDir ?? '_'] ?? './',
                ...subpaths,
            ),
        );
    }
    getSrcDir(fs, subDir, ...subpaths) {
        if (!subDir) {
            return fs.pathRelative(
                fs.pathResolve(this.paths.src._ ?? './', ...subpaths),
            );
        }
        const result = this.paths.src[subDir ?? '_'] ?? [];
        return (Array.isArray(result) ? result : [result]).map((_path) =>
            fs.pathRelative(fs.pathResolve(_path, ...subpaths)),
        );
    }
    async getStage(stage, console) {
        const stageConfig = this.stages[stage];
        // returns
        if (!stageConfig) {
            console.debug(`no ${stage} stage config found, skipping...`, 0, {
                italic: true,
            });
            return undefined;
        }
        let stageClass;
        let stageArgs;
        if (Array.isArray(stageConfig)) {
            const [_stageClass, _stageArgs] = stageConfig;
            if (_stageClass && typeOf(_stageClass) === 'class') {
                stageClass = _stageClass;
            }
            if (_stageArgs && typeof _stageArgs === 'object') {
                stageArgs = _stageArgs;
            }
        } else if (stageConfig) {
            stageClass = stageConfig;
        }
        // returns
        if (!stageClass) {
            console.progress(
                `no valid ${stage} stage class found, skipping...`,
                0,
                { italic: true },
            );
            return undefined;
        }
        return [stageClass, stageArgs ?? {}];
    }
    minimum() {
        return {
            title: this.title,
            launchYear: this.launchYear,
        };
    }
    /* DEFAULT METHODS
     * ====================================================================== */
    toJSON() {
        return {
            clr: this.clr,
            compiler: this.compiler,
            console: this.console,
            fs: this.fs,
            launchYear: this.launchYear,
            paths: this.paths,
            replace: this.replace,
            stages: this.stages,
            title: this.title,
        };
    }
    toString() {
        return JSON.stringify(this, null, 4);
    }
}
_a = ProjectConfig;
//# sourceMappingURL=ProjectConfig.js.map

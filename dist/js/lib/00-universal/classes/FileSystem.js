/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.2.0-alpha.3
 * @license MIT
 */
import { globSync } from 'glob';
// import { minify } from 'minify';
import * as prettier from 'prettier';
import {
    escRegExp,
    escRegExpReplace,
    mergeArgs,
} from '@maddimathon/utility-typescript/functions';
import { node } from '@maddimathon/utility-typescript/classes';
import {
    AbstractError,
    isObjectEmpty,
    logError,
} from '../../@internal/index.js';
/**
 * Extends the {@link node.NodeFiles} class with some custom logic useful to this package.
 *
 * @category Utilities
 *
 * @since 0.1.0-alpha
 */
export class FileSystem extends node.NodeFiles {
    /* STATIC
     * ====================================================================== */
    /**
     * Default {@link prettier} configuration object.
     *
     * @category Args
     *
     * @since 0.2.0-alpha.2
     */
    static get prettierConfig() {
        /**
         * @param format  If defined, the override for the given format is
         *                merged into the object. If undefined, all
         *                overrides are formatted for a JSON config file.
         */
        function toJSON(format) {
            const overrides = this.overrides;
            const json = {
                ...this,
                overrides: [],
            };
            delete json.toJSON;
            // returns
            if (format) {
                return mergeArgs(json, overrides[format], true);
            }
            for (const _t_format in overrides) {
                const _format = _t_format;
                // continues
                if (!overrides[_format]) {
                    continue;
                }
                // continues
                if (isObjectEmpty(overrides[_format])) {
                    continue;
                }
                switch (_format) {
                    case 'css':
                    case 'html':
                    case 'js':
                    case 'json':
                    case 'md':
                    case 'mdx':
                    case 'scss':
                    case 'ts':
                        json.overrides.push({
                            files: '*.' + _format,
                            options: overrides[_format],
                        });
                        break;
                    case 'yaml':
                        json.overrides.push({
                            files: ['*.yaml', '*.yml'],
                            options: overrides[_format],
                        });
                        break;
                    default:
                        true;
                        break;
                }
            }
            return json;
        }
        const config = {
            // checkIgnorePragma: false, // default
            // insertPragma: false, // default
            // objectWrap: 'preserve', // default
            // rangeEnd: Number.POSITIVE_INFINITY, // default
            // rangeStart: 0, // default
            // requirePragma: false, // default
            bracketSameLine: false, // default
            bracketSpacing: true, // default
            experimentalOperatorPosition: 'start',
            experimentalTernaries: true,
            htmlWhitespaceSensitivity: 'strict',
            jsxSingleQuote: true, // default
            printWidth: 80, // default
            proseWrap: 'preserve', // default
            semi: true, // default
            singleAttributePerLine: true,
            singleQuote: true,
            tabWidth: 4,
            trailingComma: 'all', // default
            useTabs: false,
            overrides: {
                css: {
                    singleQuote: false,
                },
                html: {
                    printWidth: 10000,
                    singleQuote: false,
                },
                md: {
                    printWidth: 10000,
                },
                mdx: {
                    printWidth: 10000,
                },
                js: undefined,
                json: undefined,
                scss: undefined,
                ts: undefined,
                yaml: undefined,
            },
            toJSON,
        };
        config.toJSON = config.toJSON.bind(config);
        config.valueOf = config.toJSON;
        return config;
    }
    /* LOCAL PROPERTIES
     * ====================================================================== */
    /**
     * Instance used to log messages within the class.
     *
     * @category Classes
     */
    console;
    /* Args ===================================== */
    args;
    get ARGS_DEFAULT() {
        const copy = {
            force: true,
            recursive: true,
            rename: true,
            glob: {
                absolute: false,
                dot: true,
                filesOnly: false,
            },
        };
        const glob = {
            absolute: true,
            dot: true,
            ignore: [...FileSystem.globs.SYSTEM],
        };
        const prettier = {
            _: FileSystem.prettierConfig,
            css: FileSystem.prettierConfig.overrides.css,
            html: FileSystem.prettierConfig.overrides.html,
            js: FileSystem.prettierConfig.overrides.js,
            json: FileSystem.prettierConfig.overrides.json,
            md: FileSystem.prettierConfig.overrides.md,
            mdx: FileSystem.prettierConfig.overrides.mdx,
            scss: FileSystem.prettierConfig.overrides.scss,
            ts: FileSystem.prettierConfig.overrides.ts,
            yaml: FileSystem.prettierConfig.overrides.yaml,
        };
        return {
            ...node.NodeFiles.prototype.ARGS_DEFAULT,
            argsRecursive: true,
            copy,
            glob,
            minify: FileSystem.minify.ARGS_DEFAULT,
            prettier,
        };
    }
    buildArgs(args) {
        const merged = mergeArgs(this.ARGS_DEFAULT, args, true);
        let prettier;
        if (typeof merged.prettier === 'function') {
            prettier = {
                css: merged.prettier('css'),
                html: merged.prettier('html'),
                js: merged.prettier('js'),
                json: merged.prettier('json'),
                md: merged.prettier('md'),
                mdx: merged.prettier('mdx'),
                scss: merged.prettier('scss'),
                ts: merged.prettier('ts'),
                yaml: merged.prettier('yaml'),
            };
        } else if (!('_' in merged.prettier) || !merged.prettier._) {
            const _mergedPrettier = merged.prettier;
            prettier = {
                css: _mergedPrettier,
                html: _mergedPrettier,
                js: _mergedPrettier,
                json: _mergedPrettier,
                md: _mergedPrettier,
                mdx: _mergedPrettier,
                scss: _mergedPrettier,
                ts: _mergedPrettier,
                yaml: _mergedPrettier,
            };
        } else {
            const _mergedPrettier = merged.prettier;
            prettier = {
                css: mergeArgs(_mergedPrettier._, _mergedPrettier.css, true),
                html: mergeArgs(_mergedPrettier._, _mergedPrettier.html, true),
                js: mergeArgs(_mergedPrettier._, _mergedPrettier.js, true),
                json: mergeArgs(_mergedPrettier._, _mergedPrettier.json, true),
                md: mergeArgs(_mergedPrettier._, _mergedPrettier.md, true),
                mdx: mergeArgs(_mergedPrettier._, _mergedPrettier.mdx, true),
                scss: mergeArgs(_mergedPrettier._, _mergedPrettier.scss, true),
                ts: mergeArgs(_mergedPrettier._, _mergedPrettier.ts, true),
                yaml: mergeArgs(_mergedPrettier._, _mergedPrettier.yaml, true),
            };
        }
        return {
            ...merged,
            prettier,
        };
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @category Constructor
     *
     * @param console  Instance used to log messages and debugging info.
     * @param args     Override arguments.
     */
    constructor(console, args = {}) {
        super(args, {
            nc: console.nc,
        });
        this.console = console;
        this.args =
            // @ts-expect-error - it is initialized in the super constructor
            this.args ?? this.buildArgs(args);
    }
    /* METHODS
     * ====================================================================== */
    /**
     * {@inheritDoc internal.FileSystemType.copy}
     *
     * @category Filers
     *
     * @throws {@link FileSystem.Error} — If copying a file fails.
     */
    copy(globs, level, outputDir, sourceDir, args) {
        args = mergeArgs(this.args.copy, args, true);
        outputDir = './' + outputDir.replace(/(^\.\/|\/$)/g, '') + '/';
        if (sourceDir) {
            sourceDir = './' + sourceDir.replace(/(^\.\/|\/$)/g, '') + '/';
        }
        if (!Array.isArray(globs)) {
            globs = [globs];
        }
        const copyPaths = this.glob(
            sourceDir ?
                globs.map((glob) => this.pathResolve(sourceDir, glob))
            :   globs,
            args.glob,
        );
        const sourceDirRegex =
            sourceDir
            && new RegExp(
                '^' + escRegExp(this.pathRelative(sourceDir) + '/'),
                'gi',
            );
        const output = [];
        for (const source of copyPaths) {
            const source_relative = this.pathRelative(source);
            const destination = this.pathResolve(
                outputDir,
                sourceDirRegex ?
                    source_relative.replace(sourceDirRegex, '')
                :   source_relative,
            );
            this.console.debug(
                `(TESTING) ${source_relative} → ${this.pathRelative(destination)}`,
                level,
                { linesIn: 0, linesOut: 0, maxWidth: null },
            );
            const t_output = this.copyFile(source, destination, args);
            // throws
            if (!t_output) {
                throw new FileSystem.Error(
                    [
                        'this.copyFile returned falsey',
                        'source = ' + source,
                        'destination = ' + this.pathRelative(destination),
                    ].join('\n'),
                    'copy',
                );
            }
            output.push(t_output);
        }
        return output;
    }
    /**
     * Deletes given globs (via {@link node.NodeFiles}.delete).
     *
     * This catches any errors from {@link node.NodeFiles}.delete, ignores
     * ENOTEMPTY errors, and re-throws the rest.
     *
     * @category Filers
     *
     * @param globs   Glob patterns for paths to delete.
     * @param level   Depth level for output to the console.
     * @param dryRun  If true, files that would be deleted are printed to the
     *                console and not deleted.
     * @param args    Optional glob configuration.
     */
    delete(globs, level, dryRun, args) {
        try {
            return super.delete(this.glob(globs, args), level, dryRun);
        } catch (error) {
            if (
                error
                && typeof error === 'object'
                && 'message' in error
                && String(error.message)?.match(/^\s*ENOTEMPTY\b/g)
            ) {
                logError(
                    'Error (ENOTEMPTY) caught and ignored during FileSystem.delete()',
                    error,
                    level,
                    {
                        console: this.console,
                        fs: this,
                    },
                );
            } else {
                throw error;
            }
        }
    }
    /**
     * {@inheritDoc internal.FileSystemType.glob}
     *
     * @category Path-makers
     */
    glob(globs, args = {}) {
        if (!Array.isArray(globs)) {
            globs = [globs];
        }
        args = mergeArgs(this.args.glob, args, false);
        const globResult = globSync(globs, args)
            .map((res) => (typeof res === 'object' ? res.fullpath() : res))
            .filter((_path) => _path.match(/(^|\/)\._/g) === null);
        if (args.filesOnly) {
            return globResult.filter(this.isFile);
        }
        return globResult;
    }
    /**
     * {@inheritDoc internal.FileSystemType.minify}
     *
     * @category Transformers
     */
    async minify(globs, format, level, args, renamer) {
        args = mergeArgs(
            typeof this.args.minify === 'function' ?
                this.args.minify(format)
            :   this.args.minify,
            args ?? {},
            true,
        );
        let minimizerFn;
        // returns if no match for minimizer function
        switch (format) {
            case 'css':
            case 'html':
            case 'js':
                // minimizerFn = async ( _p ) => minify[ format ]( _p.content, args[ format ] );
                // minimizerFn = async ( _p ) => minify( _p.path, args );
                this.console.log(
                    `minimizing for ${format} is not yet implemented`,
                    level,
                    { italic: true },
                );
                return [];
            case 'json':
                minimizerFn = (_p) =>
                    JSON.stringify(JSON.parse(_p.content), null, 0);
                break;
            default:
                this.console.warn(
                    [[`minimizing for ${format} is not yet supported`]],
                    level,
                    { italic: true },
                );
                return [];
        }
        const files = this.glob(globs, args.glob).filter(
            (_inputPath) => this.exists(_inputPath) && this.isFile(_inputPath),
        );
        // returns
        if (!files.length) {
            return [];
        }
        const minimized = [];
        for (const _inputPath of files) {
            let _content = this.readFile(_inputPath);
            // continues
            if (!_content) {
                continue;
            }
            this.console.params.debug
                && this.console.verbose(
                    'minimizing ' + this.pathRelative(_inputPath) + ' ...',
                    level,
                    { maxWidth: null },
                );
            try {
                _content = await minimizerFn({
                    path: _inputPath,
                    content: _content,
                });
            } catch (_error) {
                // throws
                if (!(_error instanceof TypeError)) {
                    throw _error;
                }
                logError(
                    'TypeError caught and ignored during FileSystem.minify() with '
                        + this.pathRelative(_inputPath),
                    _error,
                    1 + level,
                    {
                        console: this.console,
                        fs: this,
                    },
                );
            }
            if (_content) {
                const _outputPath = renamer?.(_inputPath) ?? _inputPath;
                if (
                    this.write(_outputPath, _content, {
                        force: true,
                        rename: false,
                    })
                ) {
                    minimized.push({
                        source: _inputPath,
                        output: _outputPath,
                    });
                }
            }
        }
        return minimized;
    }
    /**
     * {@inheritDoc internal.FileSystemType.prettier}
     *
     * @category Transformers
     *
     * @throws {@link FileSystem.Error} — If no parser was given or could be
     *         automatically assigned based on the format (this is unlikely if
     *         you respect the {@link FileSystemType.Prettier.Format} type).
     */
    async prettier(globs, format, args) {
        args = mergeArgs(this.args.prettier[format], args ?? {}, true);
        // throws if no parser can be set
        if (!args.parser) {
            switch (format) {
                case 'css':
                case 'html':
                case 'mdx':
                case 'json':
                case 'scss':
                case 'yaml':
                    args.parser = format;
                    break;
                case 'js':
                    args.parser = 'babel';
                    break;
                case 'md':
                    args.parser = 'markdown';
                    break;
                case 'ts':
                    args.parser = 'typescript';
                    break;
                default:
                    throw new FileSystem.Error(
                        'No parser was given or assigned for format "'
                            + format
                            + '"',
                        'prettify',
                    );
                    return [];
            }
        }
        const files = this.glob(globs, args.glob).filter(
            (_path) => this.exists(_path) && this.isFile(_path),
        );
        // returns
        if (!files.length) {
            return [];
        }
        const prettified = [];
        for (const _path of files) {
            let _content = this.readFile(_path);
            // continues
            if (!_content) {
                continue;
            }
            _content = await prettier.format(_content, args);
            if (_content) {
                if (
                    this.write(_path, _content, { force: true, rename: false })
                ) {
                    prettified.push(_path);
                }
            }
        }
        return prettified;
    }
    /**
     * {@inheritDoc internal.FileSystemType.replaceInFiles}
     *
     * @category Transformers
     */
    replaceInFiles(globs, replace, level, args) {
        // returns
        if (!replace.length) {
            this.console.verbose(
                'FileSystem.replaceInFiles() - no replacements passed',
                level,
            );
            this.console.vi.debug(
                { replace },
                (this.console.params.verbose ? 1 : 0) + level,
            );
            return [];
        }
        const replacements = (
            Array.isArray(replace[0]) ? replace : [replace]).filter(
            ([find, repl]) => find && typeof repl !== 'undefined',
        );
        // returns
        if (!replacements.length) {
            this.console.verbose(
                'FileSystem.replaceInFiles() - no valid replacement args passed',
                level,
            );
            this.console.vi.debug(
                { replace },
                (this.console.params.verbose ? 1 : 0) + level,
            );
            this.console.vi.debug(
                { replacements },
                (this.console.params.verbose ? 1 : 0) + level,
            );
            return [];
        }
        const files = this.glob(globs, args).filter((path) => {
            const _stats = this.getStats(path);
            // returns
            if (!_stats || !_stats.isFile() || _stats.isSymbolicLink()) {
                return false;
            }
            return true;
        });
        // returns
        if (!files.length) {
            this.console.vi.debug(
                { globs },
                (this.console.params.verbose ? 1 : 0) + level,
            );
            return [];
        }
        if (this.console.params.debug && this.console.params.verbose) {
            const _level = (this.console.params.verbose ? 1 : 0) + level;
            let i = 1;
            for (const [find, repl] of replacements) {
                this.console.verbose('set of replacements #' + i, _level);
                this.console.vi.verbose({ find }, 1 + _level);
                this.console.vi.verbose({ repl }, 1 + _level);
                i++;
            }
        }
        const replaced = [];
        for (const _path of files) {
            let _content = this.readFile(_path);
            let _write = false;
            // continues
            if (!_content) {
                continue;
            }
            for (const [find, repl] of replacements) {
                const _regex =
                    find instanceof RegExp ? find : (
                        new RegExp(escRegExp(find), 'g')
                    );
                if (!!_content.match(_regex)) {
                    _content = _content.replace(
                        _regex,
                        escRegExpReplace(String(repl)),
                    );
                    _write = true;
                }
            }
            if (_write) {
                if (
                    this.write(_path, _content, { force: true, rename: false })
                ) {
                    replaced.push(_path);
                }
            }
        }
        return replaced;
    }
}
/**
 * Used only for {@link FileSystem}.
 *
 * @category Utilities
 *
 * @since 0.1.0-alpha
 */
(function (FileSystem) {
    /**
     * An extension of the utilities error used by the {@link FileSystem} class.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha
     */
    class Error extends AbstractError {
        name = 'FileSystem Error';
        constructor(message, method, args) {
            super(message, { class: 'FileSystem', method }, args);
        }
    }
    FileSystem.Error = Error;
    /**
     * Arrays of utility globs used within the library.
     *
     * @category Utilities
     *
     * @since 0.1.0-alpha
     */
    let globs;
    (function (globs) {
        /**
         * Files that are copied into subdirectories (e.g., releases and
         * snapshots).
         *
         * @since 0.1.0-alpha
         *
         * @source
         */
        globs.IGNORE_COPIED = (stage) => [
            stage.config.paths.release.replace(/\/$/g, '') + '/**',
            stage.config.paths.snapshot.replace(/\/$/g, '') + '/**',
        ];
        /**
         * Compiled files to ignore.
         *
         * @since 0.1.0-alpha
         *
         * @source
         */
        globs.IGNORE_COMPILED = (stage) => [
            stage.getDistDir().replace(/\/$/g, '') + '/**',
            stage.getDistDir('docs').replace(/\/$/g, '') + '/**',
            stage.getDistDir('scss').replace(/\/$/g, '') + '/**',
        ];
        /**
         * Files that we probably want to ignore within an npm project.
         *
         * @since 0.1.0-alpha
         */
        globs.IGNORE_PROJECT = [
            '.git/**',
            '**/.git/**',
            '.scripts/**',
            '**/.scripts/**',
            '.vscode/**/*.code-snippets',
            '.vscode/**/settings.json',
            'node_modules/**',
            '**/node_modules/**',
        ];
        /**
         * System files that we *never, ever* want to include.
         *
         * @since 0.1.0-alpha
         */
        globs.SYSTEM = [
            '._*',
            '._*/**',
            '**/._*',
            '**/._*/**',
            '**/.DS_Store',
            '**/.smbdelete**',
        ];
    })((globs = FileSystem.globs || (FileSystem.globs = {})));
    /**
     * Utility functions and constants for the {@link FileSystem.minify} method.
     *
     * @category Transformers
     *
     * @since 0.1.0-alpha
     */
    let minify;
    (function (minify) {
        /**
         * Default args for the {@link FileSystem.minify} method
         *
         * @since 0.1.0-alpha
         */
        minify.ARGS_DEFAULT = {
            css: {
                // type: "clean-css",
                // 'clean-css': {
                //     compatibility: "*",
                // },
            },
            html: {
                // collapseBooleanAttributes: false,
                // collapseWhitespace: true,
                // minifyCSS: true,
                // minifyJS: true,
                // removeAttributeQuotes: true,
                // removeCDATASectionsFromCDATA: true,
                // removeComments: true,
                // removeCommentsFromCDATA: true,
                // removeEmptyAttributes: false,
                // removeEmptyElements: false,
                // removeOptionalTags: false,
                // removeRedundantAttributes: false,
                // removeScriptTypeAttributes: false,
                // removeStyleLinkTypeAttributes: false,
                // useShortDoctype: true,
            },
            js: {
                // type: 'putout',
                // putout: {
                //     quote: "'",
                //     mangle: false,
                //     mangleClassNames: false,
                //     removeUnusedVariables: false,
                //     removeConsole: false,
                //     removeUselessSpread: false,
                // },
            },
            json: {},
            glob: {},
        };
    })((minify = FileSystem.minify || (FileSystem.minify = {})));
    /**
     * Utility functions for the {@link FileSystem.prettier} method.
     *
     * @category Transformers
     *
     * @since 0.1.0-alpha
     */
    let prettier;
    (function (prettier) {
        /**
         * Default args for the {@link FileSystem.prettier} method
         *
         * @since 0.1.0-alpha
         *
         * @deprecated 0.2.0-alpha.2 — Replaced by static accessor {@link FileSystem.prettierConfig}.
         */
        prettier.ARGS_DEFAULT = {
            _: FileSystem.prettierConfig,
            css: FileSystem.prettierConfig.overrides.css,
            html: FileSystem.prettierConfig.overrides.html,
            js: FileSystem.prettierConfig.overrides.js,
            json: FileSystem.prettierConfig.overrides.json,
            md: FileSystem.prettierConfig.overrides.md,
            mdx: FileSystem.prettierConfig.overrides.mdx,
            scss: FileSystem.prettierConfig.overrides.scss,
            ts: FileSystem.prettierConfig.overrides.ts,
            yaml: FileSystem.prettierConfig.overrides.yaml,
        };
    })((prettier = FileSystem.prettier || (FileSystem.prettier = {})));
})(FileSystem || (FileSystem = {}));
//# sourceMappingURL=FileSystem.js.map

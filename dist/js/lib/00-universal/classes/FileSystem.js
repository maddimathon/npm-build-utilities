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
import { globSync } from 'glob';
// import { minify } from 'minify';
import * as prettier from 'prettier';
import {
    escRegExp,
    escRegExpReplace,
    mergeArgs,
} from '@maddimathon/utility-typescript/functions';
import { node } from '@maddimathon/utility-typescript/classes';
import { AbstractError, logError } from '../../@internal/index.js';
/**
 * Extends the {@link node.NodeFiles} class with some custom logic useful to this package.
 *
 * @category Utilities
 *
 * @since 0.1.0-alpha.draft
 */
export class FileSystem extends node.NodeFiles {
    console;
    /* LOCAL PROPERTIES
     * ====================================================================== */
    /* Args ===================================== */
    /**
     * A completed args object.
     *
     * @category Args
     */
    args;
    /**
     * Default args for this class.
     *
     * @category Args
     */
    get ARGS_DEFAULT() {
        const copy = {
            force: true,
            recursive: true,
            rename: true,
            glob: {
                absolute: false,
                dot: true,
            },
        };
        const glob = {
            absolute: true,
            dot: true,
            ignore: [...FileSystem.globs.SYSTEM],
        };
        return {
            ...node.NodeFiles.prototype.ARGS_DEFAULT,
            copy,
            glob,
            minify: FileSystem.minify.argsDefault,
            prettier: FileSystem.prettier.argsDefault,
        };
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param console   Used to output messages within the class.
     * @param args
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
     * @throws {@link FileSystem.Error}
     */
    copy(globs, level, outputDir, sourceDir = null, args = {}) {
        args = mergeArgs(this.args.copy, args, true);
        outputDir = './' + outputDir.replace(/(^\.\/|\/$)/g, '') + '/';
        if (sourceDir) {
            sourceDir = './' + sourceDir.replace(/(^\.\/|\/$)/g, '') + '/';
        }
        if (!Array.isArray(globs)) {
            globs = [globs];
        }
        const copyPaths = this.glob(
            sourceDir
                ? globs.map((glob) => this.pathResolve(sourceDir, glob))
                : globs,
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
                sourceDirRegex
                    ? source_relative.replace(sourceDirRegex, '')
                    : source_relative,
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
    /** {@inheritDoc internal.FileSystemType.delete} */
    delete(globs, level, dryRun, args = {}) {
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
    /** {@inheritDoc internal.FileSystemType.glob} */
    glob(globs, args = {}) {
        args = mergeArgs(this.args.glob, args, false);
        const globResult = globSync(globs, args).map((res) =>
            typeof res === 'object' ? res.fullpath() : res,
        );
        return globResult.filter((path) => !path.match(/(^|\/)\._/g));
    }
    /** {@inheritDoc internal.FileSystemType.minify} */
    async minify(globs, format, level, args, renamer) {
        args = mergeArgs(
            typeof this.args.minify === 'function'
                ? this.args.minify(format)
                : this.args.minify,
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
    /** {@inheritDoc internal.FileSystemType.prettier} */
    async prettier(globs, format, args) {
        args = mergeArgs(
            typeof this.args.prettier === 'function'
                ? this.args.prettier(format)
                : this.args.prettier,
            args ?? {},
            true,
        );
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
    /** {@inheritDoc internal.FileSystemType.replaceInFiles} */
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
            Array.isArray(replace[0]) ? replace : [replace]
        ).filter(([find, repl]) => find && typeof repl !== 'undefined');
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
            // this.console.verbose( 'FileSystem.replaceInFiles() - no files matched by globs', level );
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
                    find instanceof RegExp
                        ? find
                        : new RegExp(escRegExp(find), 'g');
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
 * @category Class-Helpers
 *
 * @since 0.1.0-alpha.draft
 */
(function (FileSystem) {
    /**
     * An extension of the utilities error used by the {@link FileSystem} class.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha.draft
     */
    class Error extends AbstractError {
        name = 'FileSystem Error';
        get ARGS_DEFAULT() {
            return {
                ...AbstractError.prototype.ARGS_DEFAULT,
            };
        }
        constructor(message, method, args) {
            super(message, { class: 'FileSystem', method }, args);
        }
    }
    FileSystem.Error = Error;
    /**
     * Arrays of utility globs used within the library.
     *
     * @since 0.1.0-alpha.draft
     */
    let globs;
    (function (globs) {
        /**
         * Files that are copied into subdirectories (e.g., releases and
         * snapshots).
         */
        globs.IGNORE_COPIED = (stage) => [
            `${stage.config.paths.release.replace(/\/$/g, '')}/**`,
            `${stage.config.paths.snapshot.replace(/\/$/g, '')}/**`,
        ];
        /**
         * Compiled files to ignore.
         */
        globs.IGNORE_COMPILED = [`./docs/**`, `./dist/**`];
        /**
         * Files that we probably want to ignore within an npm project.
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
     * Utilities for the {@link FileSystem.minify} method.
     *
     * @since 0.1.0-alpha.draft
     */
    let minify;
    (function (minify) {
        minify.argsDefault = {
            css: {
                type: 'clean-css',
                'clean-css': {
                    compatibility: '*',
                },
            },
            html: {
                collapseBooleanAttributes: false,
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
                removeAttributeQuotes: true,
                removeCDATASectionsFromCDATA: true,
                removeComments: true,
                removeCommentsFromCDATA: true,
                removeEmptyAttributes: false,
                removeEmptyElements: false,
                removeOptionalTags: false,
                removeRedundantAttributes: false,
                removeScriptTypeAttributes: false,
                removeStyleLinkTypeAttributes: false,
                useShortDoctype: true,
            },
            js: {
                type: 'putout',
                putout: {
                    quote: "'",
                    mangle: false,
                    mangleClassNames: false,
                    removeUnusedVariables: false,
                    removeConsole: false,
                    removeUselessSpread: false,
                },
            },
            glob: {
                ignore: [...FileSystem.globs.SYSTEM],
            },
        };
    })((minify = FileSystem.minify || (FileSystem.minify = {})));
    /**
     * Utility functions for the {@link FileSystem.prettier} method.
     *
     * @since 0.1.0-alpha.draft
     */
    let prettier;
    (function (prettier) {
        function argsDefault(format) {
            const universal = {
                bracketSameLine: false,
                bracketSpacing: true,
                experimentalOperatorPosition: 'start',
                experimentalTernaries: false,
                htmlWhitespaceSensitivity: 'strict',
                jsxSingleQuote: false,
                printWidth: 80,
                proseWrap: 'preserve',
                semi: true,
                singleAttributePerLine: true,
                singleQuote: true,
                tabWidth: 4,
                trailingComma: 'all',
                useTabs: false,
                glob: {},
            };
            // returns on match
            switch (format) {
                case 'css':
                    return {
                        ...universal,
                        singleQuote: false,
                    };
                case 'html':
                    return {
                        ...universal,
                        printWidth: 10000,
                    };
            }
            return universal;
        }
        prettier.argsDefault = argsDefault;
    })((prettier = FileSystem.prettier || (FileSystem.prettier = {})));
})(FileSystem || (FileSystem = {}));
//# sourceMappingURL=FileSystem.js.map

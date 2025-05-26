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
import { escRegExp, escRegExpReplace, mergeArgs, } from '@maddimathon/utility-typescript/functions';
import { node } from '@maddimathon/utility-typescript/classes';
import { AbstractError, } from '../../@internal/index.js';
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
            ignore: [
                ...FileSystem.globs.SYSTEM,
            ],
        };
        return {
            ...node.NodeFiles.prototype.ARGS_DEFAULT,
            copy,
            glob,
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
        this.args = (
        // @ts-expect-error - it is initialized in the super constructor
        this.args) ?? this.buildArgs(args);
        this.copy = this.copy.bind(this);
        this.delete = this.delete.bind(this);
        this.glob = this.glob.bind(this);
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
        const copyPaths = this.glob(sourceDir ? globs.map(glob => this.pathResolve(sourceDir, glob)) : globs, args.glob);
        const sourceDirRegex = sourceDir && new RegExp('^' + escRegExp(this.pathRelative(sourceDir) + '/'), 'gi');
        const output = [];
        for (const source of copyPaths) {
            const source_relative = this.pathRelative(source);
            const destination = this.pathResolve(outputDir, sourceDirRegex ? source_relative.replace(sourceDirRegex, '') : source_relative);
            this.console.debug(`(TESTING) ${source_relative} → ${this.pathRelative(destination)}`, level, { linesIn: 0, linesOut: 0, maxWidth: null });
            const t_output = this.copyFile(source, destination, args);
            // throws
            if (!t_output) {
                throw new FileSystem.Error([
                    'this.copyFile returned falsey',
                    'source = ' + source,
                    'destination = ' + this.pathRelative(destination),
                ].join('\n'), {
                    class: 'FileSystem',
                    method: 'copy',
                });
            }
            output.push(t_output);
        }
        return output;
    }
    /** {@inheritDoc internal.FileSystemType.delete} */
    delete(globs, level, dryRun, args = {}) {
        try {
            return super.delete(this.glob(globs, args), level, dryRun);
        }
        catch (error) {
            if (error
                && typeof error === 'object'
                && 'message' in error
                && String(error.message)?.match(/^\s*ENOTEMPTY\b/g)) {
            }
            else {
                throw error;
            }
        }
    }
    /** {@inheritDoc internal.FileSystemType.glob} */
    glob(globs, args = {}) {
        args = mergeArgs(this.args.glob, args, false);
        const globResult = globSync(globs, args)
            .map(res => typeof res === 'object' ? res.fullpath() : res);
        return globResult.filter(path => !path.match(/(^|\/)\._/g));
    }
    /** {@inheritDoc internal.FileSystemType.minify} */
    minify(globs, format, level, args, renamer) {
        this.console.log('(NOT IMPLEMENTED) FileSystem.minify()', level);
        this.console.vi.log({ globs }, 1 + level);
        this.console.vi.log({ format }, 1 + level);
        this.console.vi.log({ args }, 1 + level);
        this.console.vi.log({ renamer }, 1 + level);
        return [];
    }
    /** {@inheritDoc internal.FileSystemType.prettier} */
    prettier(globs, format, level, args) {
        this.console.log('(NOT IMPLEMENTED) FileSystem.prettier()', level);
        this.console.vi.log({ globs }, 1 + level);
        this.console.vi.log({ format }, 1 + level);
        this.console.vi.log({ args }, 1 + level);
        return [];
    }
    /** {@inheritDoc internal.FileSystemType.replaceInFiles} */
    replaceInFiles(globs, replace, level, args) {
        // returns
        if (!replace.length) {
            this.console.verbose('FileSystem.replaceInFiles() - no replacements passed', level);
            this.console.vi.debug({ replace }, (this.console.params.verbose ? 1 : 0) + level);
            return [];
        }
        const replaced = [];
        const replacements = (Array.isArray(replace[0])
            ? replace
            : [replace]).filter(([find, repl]) => find && typeof repl !== 'undefined');
        // returns
        if (!replacements.length) {
            this.console.verbose('FileSystem.replaceInFiles() - no valid replacement args passed', level);
            this.console.vi.debug({ replace }, (this.console.params.verbose ? 1 : 0) + level);
            this.console.vi.debug({ replacements }, (this.console.params.verbose ? 1 : 0) + level);
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
            this.console.verbose('FileSystem.replaceInFiles() - no files matched by globs', level);
            this.console.vi.debug({ globs }, (this.console.params.verbose ? 1 : 0) + level);
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
        for (const path of files) {
            let _content = this.readFile(path);
            let _write = false;
            // continues
            if (!_content) {
                continue;
            }
            // this.console.verbose( 'rewriting ' + this.pathRelative( path ), 1 + level );
            // const _level = ( this.console.params.verbose ? 1 : 0 ) + level;
            // let i = 1;
            for (const [find, repl] of replacements) {
                const _regex = find instanceof RegExp
                    ? find
                    : new RegExp(escRegExp(find), 'g');
                if (!!_content.match(_regex)) {
                    // this.console.verbose(
                    //     'replacements # ' + i + ' — ' + this.console.vi.stringify( { find }, { includePrefix: false } ) + ' → ' + this.console.vi.stringify( { repl }, { includePrefix: false } ),
                    //     1 + _level,
                    //     { joiner: '\n', maxWidth: null },
                    // );
                    _content = _content.replace(_regex, escRegExpReplace(String(repl)));
                    _write = true;
                }
                // i++;
            }
            if (_write) {
                this.write(path, _content, { force: true, rename: false });
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
     * Arrays of utility globs used within the library.
     */
    let globs;
    (function (globs) {
        /**
         *
         */
        globs.IGNORE_COPIED = (stage) => [
            `${stage.config.paths.release.replace(/\/$/g, '')}/**`,
            `${stage.config.paths.snapshot.replace(/\/$/g, '')}/**`,
        ];
        /**
         * Files to ignore
         */
        globs.IGNORE_COMPILED = [
            `./docs/**`,
            `./dist/**`,
        ];
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
    })(globs = FileSystem.globs || (FileSystem.globs = {}));
    ;
    ;
    /**
     * An extension of the utilities error used by the {@link FileSystem} class.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha.draft
     */
    class Error extends AbstractError {
        /* LOCAL PROPERTIES
         * ================================================================== */
        // public readonly code: Error.Code;
        /* Args ===================================== */
        name = 'FileSystem Error';
        get ARGS_DEFAULT() {
            return {
                ...AbstractError.prototype.ARGS_DEFAULT,
            };
        }
    }
    FileSystem.Error = Error;
    /**
     * Used only for {@link FileSystem.Error}.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha.draft
     */
    (function (Error) {
        ;
    })(Error = FileSystem.Error || (FileSystem.Error = {}));
    ;
    ;
})(FileSystem || (FileSystem = {}));
//# sourceMappingURL=FileSystem.js.map
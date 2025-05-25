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
import { escRegExp, mergeArgs, } from '@maddimathon/utility-typescript/functions';
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
                '._*',
                '._**/**',
                '**/._*',
                '**/._**/**',
                '**/.DS_Store',
                '**/.smbdelete**',
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
     * {@inheritDoc FileSystemType.copy}
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
    /** {@inheritDoc FileSystemType.delete} */
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
    /** {@inheritDoc FileSystemType.glob} */
    glob(globs, args = {}) {
        args = mergeArgs(this.args.glob, args, false);
        const globResult = globSync(globs, args)
            .map(res => typeof res === 'object' ? res.fullpath() : res);
        return globResult.filter(path => !path.match(/(^|\/)\._/g));
    }
}
/**
 * Used only for {@link FileSystem}.
 *
 * @category Utilities
 *
 * @since 0.1.0-alpha.draft
 */
(function (FileSystem) {
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
        /* CONSTRUCTOR
         * ================================================================== */
        constructor(message, 
        // code: Error.Code,
        context, args) {
            super(message, context, args);
            // this.code = code;
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
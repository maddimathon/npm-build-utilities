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
import { node } from '@maddimathon/utility-typescript/classes';
import { escRegExp, mergeArgs } from '@maddimathon/utility-typescript/functions/index';
import { globSync } from 'glob';
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
            glob: {},
        };
        const glob = {
            absolute: true,
            dot: true,
            ignore: [
                '**/._*',
                '**/._**/*',
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
    }
    /* METHODS
     * ====================================================================== */
    /** {@inheritDoc FileSystemType.copy} */
    copy(globs, level, outputDir, sourceDir = null, opts = {}) {
        outputDir = './' + outputDir.replace(/(^\.\/|\/$)/g, '') + '/';
        if (sourceDir) {
            sourceDir = './' + sourceDir.replace(/(^\.\/|\/$)/g, '') + '/';
        }
        // this.console.vi.progress( { globs }, level );
        // this.console.vi.progress( { outputDir }, level );
        // this.console.vi.progress( { sourceDir }, level );
        if (!Array.isArray(globs)) {
            globs = [globs];
        }
        const copyPaths = this.glob(sourceDir ? globs.map(glob => this.pathResolve(sourceDir, glob)) : globs, opts.glob);
        const sourceDirRegex = sourceDir && new RegExp('^' + escRegExp(this.pathRelative(sourceDir) + '/'), 'gi');
        // this.console.vi.log( { sourceDirRegex }, level );
        for (const source of copyPaths) {
            const source_relative = this.pathRelative(source);
            const destination = this.pathResolve(outputDir, sourceDirRegex ? source_relative.replace(sourceDirRegex, '') : source_relative);
            this.console.verbose(`(TESTING) ${source_relative} → ${this.pathRelative(destination)}`, level, { linesIn: 0, linesOut: 0, maxWidth: null });
        }
        return [];
    }
    /** {@inheritDoc FileSystemType.glob} */
    glob(globs, opts = {}) {
        opts = mergeArgs(this.args.glob, opts, false);
        const globResult = globSync(globs, opts)
            .map(res => typeof res === 'object' ? res.fullpath() : res);
        return globResult;
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
    ;
})(FileSystem || (FileSystem = {}));
//# sourceMappingURL=FileSystem.js.map
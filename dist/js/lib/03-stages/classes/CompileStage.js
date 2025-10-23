/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.1.draft
 * @license MIT
 */
import {
    escRegExp,
    escRegExpReplace,
    mergeArgs,
} from '@maddimathon/utility-typescript/functions';
import { SemVer } from '../../@internal/index.js';
import { FileSystem } from '../../00-universal/index.js';
// import {
// } from '../../01-config/index.js';
// import {
// } from '../../02-utils/index.js';
import { Stage_Compiler } from '../../02-utils/classes/Stage_Compiler.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default compile stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 */
export class CompileStage extends AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
    /**
     * {@inheritDoc AbstractStage.subStages}
     *
     * @category Running
     *
     * @source
     */
    subStages = ['scss', 'ts', 'files'];
    /* Args ===================================== */
    get ARGS_DEFAULT() {
        const scss = {
            postCSS: true,
        };
        return {
            files: false,
            scss,
            ts: true,
            utils: {},
        };
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @category Constructor
     *
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param args     Partial overrides for the default args.
     * @param pkg      Parsed contents of the project’s package.json file.
     * @param version  Version object for the project’s version.
     */
    constructor(config, params, args, pkg, version) {
        super('compile', 'green', config, params, args, pkg, version);
    }
    /* LOCAL METHODS
     * ====================================================================== */
    startEndNotice(which) {
        return super.startEndNotice(which, !this.params.building);
    }
    /* RUNNING METHODS
     * ====================================================================== */
    async runSubStage(subStage) {
        await this[subStage]();
    }
    /**
     * Compiles scss files to css.
     *
     * @category Sub-Stages
     *
     * @since 0.2.0-alpha — Runs PostCSS if {@link Stage.Args.Compile.postCSS} is truthy.
     */
    async scss() {
        if (!this.args.scss) {
            return;
        }
        const subStageArgs =
            typeof this.args.scss === 'object' ?
                mergeArgs(this.ARGS_DEFAULT.scss, this.args.scss)
            : this.args.scss ? this.ARGS_DEFAULT.scss
            : false;
        if (!subStageArgs) {
            return;
        } // here for extra type-safety
        this.console.progress('compiling scss files...', 1);
        const scssSrcDir = this.getSrcDir('scss');
        const globArgs = {
            ignore: [...FileSystem.globs.SYSTEM, '**/_*'],
        };
        const scssPaths = this.fs
            .glob(scssSrcDir, globArgs)
            .map((_path) => {
                const _stats = this.fs.getStats(_path);
                // returns
                if (!_stats || _stats.isSymbolicLink()) {
                    return [];
                }
                // returns
                if (_stats.isFile()) {
                    _path = this.fs.pathRelative(_path);
                    this.console.verbose(
                        '✓ configured scss source _path found: ' + _path,
                        2,
                        { italic: true },
                    );
                    return _path;
                }
                this.console.verbose(
                    'configured scss source _path is a directory: '
                        + this.fs.pathRelative(_path),
                    2,
                    { italic: true },
                );
                const _indexFileNames = [
                    'index.scss',
                    'index.sass',
                    'index.css',
                    '_index.scss',
                    '_index.sass',
                    '_index.css',
                ];
                // returns on existing file found
                for (const _filename of _indexFileNames) {
                    const _indexPath = this.fs.pathResolve(_path, _filename);
                    // returns
                    if (
                        this.fs.exists(_indexPath)
                        && this.fs.isFile(_indexPath)
                    ) {
                        const _relativePath = this.fs.pathRelative(_indexPath);
                        this.console.verbose(
                            '✓ default sub-file found: ' + _relativePath,
                            3,
                            { italic: true },
                        );
                        return _relativePath;
                    }
                }
                const _globResults = this.fs
                    .glob(
                        ['./**/*.css', './**/*.sass', './**/*.scss'].map((_p) =>
                            this.fs.pathRelative(
                                this.fs.pathResolve(_path, _p),
                            ),
                        ),
                        globArgs,
                    )
                    .filter((_p) => this.fs.isFile(_p));
                // returns
                if (_globResults.length) {
                    const _relativePaths = _globResults.map(
                        this.fs.pathRelative,
                    );
                    this.console.verbose(
                        '✓ globbed sub-file(s) found: '
                            + _relativePaths
                                .map((_p) => '\n    ' + _p)
                                .join(''),
                        3,
                        { italic: true },
                    );
                    return _relativePaths;
                }
                this.console.verbose('ⅹ no default files found', 3);
                return [];
            })
            .flat();
        // returns
        if (!scssPaths.length) {
            this.console.progress(
                'no valid scss input files found, exiting...',
                2,
                { italic: true },
            );
            return;
        }
        const scssDistDir = this.fs.pathRelative(this.getDistDir('scss'));
        this.console.verbose('deleting existing files...', 2);
        this.fs.delete([scssDistDir], 3);
        this.console.verbose('building path arguments...', 2);
        const scssPathArgs = scssPaths.map((_path) => {
            const _srcDirRegex = new RegExp(
                escRegExp(
                    this.fs
                        .pathRelative(
                            this.fs.isFile(_path) ?
                                this.fs.dirname(_path)
                            :   _path,
                        )
                        .replace(/\/$/g, '') + '/',
                ),
                'g',
            );
            const _output = this.fs
                .pathRelative(_path)
                .replace(
                    _srcDirRegex,
                    escRegExpReplace(scssDistDir.replace(/\/$/g, '') + '/'),
                )
                .replace(/\.scss$/gi, '.css');
            return {
                input: _path,
                output: _output,
            };
        });
        this.console.vi.debug({ scssPathArgs }, this.params.verbose ? 3 : 2);
        this.console.verbose('compiling to css...', 2);
        await Promise.all(
            scssPathArgs.map(({ input, output }) =>
                this.atry(this.compiler.scss, this.params.verbose ? 3 : 2, [
                    input,
                    output,
                    this.params.verbose ? 3 : 2,
                    this.sassOpts,
                ]),
            ),
        );
        if (subStageArgs.postCSS) {
            this.console.verbose('processing with postcss...', 2);
            await this.atry(
                this.compiler.postCSS,
                this.params.verbose ? 3 : 2,
                [
                    scssPathArgs.map((_o) => ({ from: _o.output })),
                    this.params.verbose ? 3 : 2,
                ],
            );
        }
    }
    /**
     * Compiles typescript to javascript.
     *
     * @category Sub-Stages
     */
    async ts() {
        if (!this.args.ts) {
            return;
        }
        this.console.progress('compiling typescript...', 1);
        this.console.verbose('getting tsconfig paths...', 2);
        const tsPaths = await Stage_Compiler.getTsConfigPaths(
            this,
            this.params.verbose ? 3 : 2,
        );
        this.console.vi.debug({ tsPaths }, this.params.verbose ? 3 : 2);
        this.console.verbose('running typescript...', 2);
        for (const _path of tsPaths) {
            this.console.verbose('compiling project: ' + _path, 3);
            await this.atry(
                this.compiler.typescript,
                this.params.verbose ? 4 : 2,
                [_path, this.params.verbose ? 4 : 2, this.params.packaging],
            );
        }
    }
    /**
     * Copies files to the dist directory.
     *
     * @category Sub-Stages
     */
    async files() {
        if (!this.args.files) {
            return;
        }
        this.console.progress(`copying files project files...`, 1);
        const distDir =
            './'
            + this.getDistDir()
                .trim()
                .replace(/(^\.\/|\/$)/g, '')
            + '/';
        const srcDir = this.getSrcDir().trim().replace(/\/$/g, '');
        const filePathNormalizer = (srcDir, _input) => {
            srcDir = srcDir && './' + srcDir.replace(/(^\.\/|\/$)/g, '') + '/';
            let input = typeof _input === 'string' ? { from: _input } : _input;
            const source_relative = this.fs.pathRelative(input.from);
            const from =
                srcDir ?
                    this.fs.pathResolve(srcDir, input.from)
                :   this.fs.pathResolve(input.from);
            const sourceDirRegex =
                srcDir
                && new RegExp(
                    '^' + escRegExp(this.fs.pathRelative(srcDir) + '/'),
                    'gi',
                );
            const to = this.fs.pathResolve(
                distDir,
                input.to
                    ?? (sourceDirRegex ?
                        source_relative.replace(sourceDirRegex, '')
                    :   source_relative),
            );
            return { from, to };
        };
        this.console.verbose(`normalizing paths...`, 2);
        const rootPaths = this.args.files.root?.map((path) =>
            filePathNormalizer(null, path),
        );
        const srcPaths = this.args.files.src?.map((path) =>
            filePathNormalizer(srcDir, path),
        );
        this.console.verbose(`copying files...`, 2);
        const copyFileArgs = mergeArgs(this.fs.args.copy, {}, true);
        const fileCopier = async (srcDir, paths) => {
            // returns
            if (!paths || !paths.length) {
                this.console.verbose(
                    `no files to copy from ${srcDir ?? 'the root directory'}`,
                    3,
                    { italic: true },
                );
                return;
            }
            return Promise.all(
                paths.map(async ({ from, to }) =>
                    this.atry(this.fs.copyFile, this.params.verbose ? 3 : 2, [
                        from,
                        to,
                        copyFileArgs,
                    ]),
                ),
            );
        };
        return Promise.all(
            [fileCopier(null, rootPaths), fileCopier(srcDir, srcPaths)].flat(),
        );
    }
}
//# sourceMappingURL=CompileStage.js.map

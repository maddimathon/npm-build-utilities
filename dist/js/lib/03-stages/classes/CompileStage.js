/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.3
 * @license MIT
 */
import {
    escRegExp,
    escRegExpReplace,
} from '@maddimathon/utility-typescript/functions';
import { FileSystem } from '../../00-universal/index.js';
// import {
// } from '../../01-config/index.js';
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
        return {
            files: false,
            scss: true,
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
     */
    async scss() {
        if (!this.args.scss) {
            return;
        }
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
        // this.console.vi.verbose( { scssDistDir }, this.params.verbose ? 3 : 2 );
        this.console.verbose('deleting existing files...', 2);
        this.fs.delete([scssDistDir], 3);
        this.console.verbose('building path arguments...', 2);
        const scssPathArgs = scssPaths.map((_path) => {
            const _srcDirRegex = new RegExp(
                escRegExp(
                    this.fs
                        .pathRelative(
                            this.fs.isFile(_path)
                                ? this.fs.dirname(_path)
                                : _path,
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
                ]),
            ),
        );
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
        this.console.progress('compiling typescript files...', 1);
        const tsSrcDir = this.getSrcDir('ts');
        const tsPaths = tsSrcDir
            .map((path) => {
                // returns
                if (!this.fs.exists(path)) {
                    this.console.verbose(
                        'ⅹ configured ts source path not found: ' + path,
                        2,
                        { italic: true },
                    );
                    return [];
                }
                // returns
                if (!this.fs.isDirectory(path)) {
                    this.console.verbose(
                        '✓ configured ts source path found: ' + path,
                        2,
                        { italic: true },
                    );
                    return path;
                }
                this.console.verbose(
                    'configured ts source path is a directory: '
                        + this.fs.pathRelative(path),
                    2,
                    { italic: true },
                );
                const testSubPaths = [
                    'tsconfig.json',
                    'tsConfig.json',
                    '../tsconfig.json',
                    '../tsConfig.json',
                ];
                for (const subPath of testSubPaths) {
                    const fullPath = this.fs.pathResolve(path, subPath);
                    // returns
                    if (this.fs.exists(fullPath) && this.fs.isFile(fullPath)) {
                        const relativePath = this.fs.pathRelative(fullPath);
                        this.console.verbose(
                            '✓ default sub-file found: ' + relativePath,
                            3,
                            { italic: true },
                        );
                        return relativePath;
                    }
                }
                this.console.verbose('ⅹ no default files found', 3);
                return [];
            })
            .flat();
        // returns if no tsconfig.json is created
        if (!tsPaths.length) {
            const msgArgs = {
                depth: 2 + this.params['log-base-level'],
            };
            // returns
            if (
                !(await this.console.nc.prompt.bool({
                    message:
                        'No tsconfig.json files found, do you want to create one?',
                    default: true,
                    msgArgs: {
                        ...msgArgs,
                        linesIn: 1,
                    },
                }))
            ) {
                return;
            }
            const tsSrcDir = this.getSrcDir('ts')[0];
            const _tsConfigDefaultPath = this.fs.pathRelative(
                this.fs.pathResolve(tsSrcDir, './tsconfig.json'),
            );
            const tsConfigFile = await this.console.nc.prompt.input({
                message: 'Where should the tsconfig.json be written?',
                default: _tsConfigDefaultPath,
                msgArgs: {
                    ...msgArgs,
                    linesOut: 1,
                },
                required: true,
            });
            this.console.vi.debug({ tsConfigFile }, 3);
            // returns
            if (!tsConfigFile) {
                return;
            }
            const baseUrl = tsSrcDir.replace(/(?<=^|\/)[^\/]+(\/|$)/g, '..\/');
            this.console.vi.debug({ baseUrl }, 2);
            const outDir = this.fs.pathRelative(
                this.fs.pathResolve(baseUrl, this.getDistDir(), 'js'),
            );
            this.console.vi.debug({ outDir }, 2);
            this.fs.write(
                this.fs.pathResolve(tsConfigFile),
                JSON.stringify(this.compiler.tsConfig, null, 4),
                { force: true },
            );
            tsPaths.push(tsConfigFile);
        }
        this.console.vi.debug({ tsPaths }, this.params.verbose ? 3 : 2);
        this.console.verbose('compiling to javascript...', 2);
        await Promise.all(
            tsPaths.map((tsc) => {
                this.console.verbose('compiling project: ' + tsc, 3);
                return this.compiler.typescript(
                    tsc,
                    this.params.verbose ? 4 : 2,
                );
            }),
        );
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
        const distDir = this.getDistDir().trim().replace(/\/$/g, '');
        this.console.progress(`copying files to ${distDir}...`, 1);
        const rootPaths = this.args.files.root;
        if (!rootPaths?.length) {
            this.console.verbose(`no files to copy from the root directory`, 2);
        } else {
            this.fs.copy(rootPaths, 2, distDir, null, {
                force: true,
                rename: true,
            });
        }
        const srcPaths = this.args.files.src;
        if (!srcPaths?.length) {
            this.console.verbose(
                `no files to copy from the source directory`,
                2,
            );
        } else {
            const srcDir = this.getSrcDir().trim().replace(/\/$/g, '');
            this.fs.copy(srcPaths, 2, distDir, srcDir, {
                force: true,
                rename: true,
            });
        }
    }
}
//# sourceMappingURL=CompileStage.js.map

/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.1
 * @license MIT
 */
import { mergeArgs } from '@maddimathon/utility-typescript/functions';
import { FileSystem } from '../../00-universal/index.js';
// import {
// } from '../../01-config/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default build stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 */
export class BuildStage extends AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
    /**
     * {@inheritDoc AbstractStage.subStages}
     *
     * @category Running
     *
     * @source
     */
    subStages = [
        'compile',
        'replace',
        'prettify',
        'minimize',
        'test',
        'document',
    ];
    /* Args ===================================== */
    get ARGS_DEFAULT() {
        const minimize = (_stage) => {
            const _distDir = {
                _: _stage.getDistDir().replace(/\/$/, ''),
                scss: _stage.getDistDir('scss').replace(/\/$/, ''),
                docs: _stage.getDistDir('docs').replace(/\/$/, ''),
            };
            // const _renamer = ( _path: string ) => _stage.fs.uniquePath(
            //     _stage.fs.changeBaseName(
            //         _path,
            //         _stage.fs.basename( _path ) + '.min',
            //     )
            // );
            return {
                // css: {
                //     globs: [
                //         `${ _distDir._ }/**/*.css`,
                //         `${ _distDir.scss }/**/*.css`,
                //     ],
                //     ignore: [
                //         `${ _distDir._ }/**/*.min.css`,
                //         `${ _distDir.scss }/**/*.min.css`,
                //         `${ _distDir._ }/**/*.css.map`,
                //         `${ _distDir.scss }/**/*.css.map`,
                //     ],
                //     renamer: _renamer,
                // },
                // html: {
                //     globs: [ `${ _distDir._ }/**/*.html`, ],
                // },
                // js: {
                //     globs: [
                //         `${ _distDir._ }/**/*.js`,
                //         `${ _distDir._ }/**/*.jsx`,
                //     ],
                //     ignore: [
                //         `${ _distDir._ }/**/*.min.js`,
                //         `${ _distDir._ }/**/*.min.jsx`,
                //         `${ _distDir._ }/**/*.test.js`,
                //         `${ _distDir._ }/**/*.test.jsx`,
                //         `${ _distDir._ }/**/*.js.map`,
                //         `${ _distDir._ }/**/*.jsx.map`,
                //     ],
                //     renamer: _renamer,
                // },
                css: false,
                html: false,
                js: false,
                json: {
                    globs: [`${_distDir._}/**/*.json`],
                },
            };
        };
        const prettify = (_stage) => {
            const _distDir = {
                _: _stage.getDistDir().replace(/\/$/, ''),
                scss: _stage.getDistDir('scss').replace(/\/$/, ''),
                docs: _stage.getDistDir('docs').replace(/\/$/, ''),
            };
            return {
                css: [[`${_distDir._}/**/*.css`, `${_distDir.scss}/**/*.css`]],
                html: [[`${_distDir._}/**/*.html`]],
                js: [
                    [
                        `${_distDir._}/**/*.js`,
                        `${_distDir._}/**/*.jsx`,
                        `${_distDir.docs}/**/*.js`,
                        `${_distDir.docs}/**/*.jsx`,
                    ],
                ],
                json: [[`${_distDir._}/**/*.json`]],
                md: undefined,
                mdx: undefined,
                scss: [
                    [`${_distDir._}/**/*.scss`, `${_distDir.scss}/**/*.scss`],
                ],
                ts: [
                    [
                        `${_distDir._}/**/*.ts`,
                        `${_distDir._}/**/*.tsx`,
                        `${_distDir.docs}/**/*.ts`,
                        `${_distDir.docs}/**/*.tsx`,
                    ],
                ],
                yaml: [[`${_distDir._}/**/*.yaml`]],
            };
        };
        const replace = (_stage) => {
            const _distGlob =
                _stage.getDistDir().replace(/\/$/gi, '') + '/**/*';
            return {
                current: [_distGlob],
                ignore: [
                    ...FileSystem.globs.IGNORE_COPIED(_stage),
                    ...FileSystem.globs.IGNORE_PROJECT,
                    ...FileSystem.globs.SYSTEM,
                    '**/.vscode/**',
                ],
                package: [_distGlob],
            };
        };
        return {
            compile: true,
            document: false,
            minimize,
            prettify,
            replace,
            test: false,
            utils: {},
        };
    }
    buildArgs(args = {}) {
        const _defaults = this.ARGS_DEFAULT;
        const merged = mergeArgs(_defaults, args, true);
        if (
            typeof _defaults.minimize === 'function'
            && merged.minimize
            && typeof merged.minimize !== 'function'
        ) {
            merged.minimize = mergeArgs(
                _defaults.minimize(this),
                merged.minimize,
                false,
            );
        }
        if (
            typeof _defaults.prettify === 'function'
            && merged.prettify
            && typeof merged.prettify !== 'function'
        ) {
            merged.prettify = mergeArgs(
                _defaults.prettify(this),
                merged.prettify,
                false,
            );
        }
        return merged;
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
        super('build', 'blue', config, params, args, pkg, version);
    }
    /* LOCAL METHODS
     * ====================================================================== */
    startEndNotice(which) {
        return super.startEndNotice(which, !this.params.packaging);
    }
    /* RUNNING METHODS
     * ====================================================================== */
    async runSubStage(subStage) {
        await this[subStage]();
    }
    /**
     * Runs the project's compile class.
     *
     * @category Sub-Stages
     */
    async compile() {
        await this.runStage('compile', 1);
    }
    /**
     * Runs the project's document class.
     *
     * @category Sub-Stages
     */
    async document() {
        await this.runStage('document', 1);
    }
    /**
     * Minimizes files.
     *
     * @category Sub-Stages
     */
    async minimize() {
        if (!this.args.minimize) {
            return;
        }
        this.console.progress('minimizing built files...', 1);
        const args =
            typeof this.args.minimize === 'function'
                ? this.args.minimize(this)
                : this.args.minimize;
        // returns
        if (!Object.keys(args).length) {
            this.console.verbose(
                'empty minimize config, no files to format',
                2,
            );
            return;
        }
        for (const t_format in args) {
            const _format = t_format;
            // continues
            if (
                typeof args[_format] === 'undefined'
                || args[_format] === false
            ) {
                continue;
            }
            const _formatArgs = Array.isArray(args[_format])
                ? { globs: args[_format] }
                : args[_format];
            // continues
            if (
                !Array.isArray(_formatArgs.globs)
                || !_formatArgs.globs.length
            ) {
                this.console.verbose(
                    `no globs present to minimize ${_format} files`,
                    2,
                    { italic: true },
                );
                continue;
            }
            this.console.verbose(`minimizing ${_format} files...`, 2);
            const _minimized = await this.atry(
                this.fs.minify,
                this.params.verbose ? 3 : 2,
                [
                    _formatArgs.globs,
                    _format,
                    this.params.verbose ? 3 : 2,
                    {
                        ..._formatArgs.args,
                        glob: {
                            ignore: _formatArgs.ignore,
                            ...(_formatArgs.args?.glob ?? {}),
                        },
                    },
                    _formatArgs.renamer,
                ],
            );
            this.console.verbose(
                `minimized ${_minimized.length} ${_format} files`,
                3,
                { italic: true },
            );
        }
    }
    /**
     * Runs prettier to format files.
     *
     * @category Sub-Stages
     */
    async prettify() {
        if (!this.args.prettify) {
            return;
        }
        this.console.progress('prettifying built files...', 1);
        const args =
            typeof this.args.prettify === 'function'
                ? this.args.prettify(this)
                : this.args.prettify;
        // returns
        if (!Object.keys(args).length) {
            this.console.verbose(
                'empty prettify config, no files to format',
                2,
            );
            return;
        }
        for (const t_format in args) {
            const _format = t_format;
            // continues
            if (typeof args[_format] === 'undefined') {
                continue;
            }
            // continues
            if (!args[_format] || !Array.isArray(args[_format][0])) {
                this.console.verbose(
                    `no globs present to prettify ${_format} files`,
                    2,
                    { italic: true },
                );
                continue;
            }
            this.console.verbose(`prettifying ${_format} files...`, 2);
            const [_globs, _args = {}] = args[_format];
            const _prettified = await this.atry(this.fs.prettier, 3, [
                _globs,
                _format,
                _args,
            ]);
            this.console.verbose(
                `prettified ${_prettified.length} ${_format} files`,
                3,
                { italic: true },
            );
        }
    }
    /**
     * Replaces placeholders in the built files and directories.
     *
     * @category Sub-Stages
     */
    async replace() {
        if (!this.args.replace) {
            return;
        }
        this.console.progress('replacing placeholders...', 1);
        const paths = this.args.replace(this);
        for (const _key of ['current', 'package']) {
            // continues
            if (!paths[_key]) {
                continue;
            }
            this.replaceInFiles(paths[_key], _key, 2, paths.ignore);
        }
    }
    /**
     * Runs the project's test class.
     *
     * @category Sub-Stages
     */
    async test() {
        await this.runStage('test', 1);
    }
}
//# sourceMappingURL=BuildStage.js.map

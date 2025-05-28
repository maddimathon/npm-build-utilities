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
import { FileSystem, } from '../../00-universal/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default build stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 */
export class BuildStage extends AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
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
            const _renamer = (_path) => _stage.fs.uniquePath(_stage.fs.changeBaseName(_path, _stage.fs.basename(_path) + '.min'));
            return {
                css: {
                    globs: [
                        `${_distDir._}/**/*.css`,
                        `${_distDir.scss}/**/*.css`,
                    ],
                    ignore: [
                        `${_distDir._}/**/*.min.css`,
                        `${_distDir.scss}/**/*.min.css`,
                        `${_distDir._}/**/*.css.map`,
                        `${_distDir.scss}/**/*.css.map`,
                    ],
                    renamer: _renamer,
                },
                html: {
                    globs: [`${_distDir._}/**/*.html`,],
                },
                js: {
                    globs: [
                        `${_distDir._}/**/*.js`,
                        `${_distDir._}/**/*.jsx`,
                    ],
                    ignore: [
                        `${_distDir._}/**/*.min.js`,
                        `${_distDir._}/**/*.min.jsx`,
                        `${_distDir._}/**/*.test.js`,
                        `${_distDir._}/**/*.test.jsx`,
                        `${_distDir._}/**/*.js.map`,
                        `${_distDir._}/**/*.jsx.map`,
                    ],
                    renamer: _renamer,
                },
                json: {
                    globs: [`${_distDir._}/**/*.json`,],
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
                css: [
                    [
                        `${_distDir._}/**/*.css`,
                        `${_distDir.scss}/**/*.css`,
                    ],
                ],
                html: [
                    [`${_distDir._}/**/*.html`,],
                ],
                js: [
                    [
                        `${_distDir._}/**/*.js`,
                        `${_distDir._}/**/*.jsx`,
                        `${_distDir.docs}/**/*.js`,
                        `${_distDir.docs}/**/*.jsx`,
                    ],
                ],
                json: [
                    [`${_distDir._}/**/*.json`,],
                ],
                md: undefined,
                mdx: undefined,
                scss: [
                    [
                        `${_distDir._}/**/*.scss`,
                        `${_distDir.scss}/**/*.scss`,
                    ],
                ],
                ts: [
                    [
                        `${_distDir._}/**/*.ts`,
                        `${_distDir._}/**/*.tsx`,
                        `${_distDir.docs}/**/*.ts`,
                        `${_distDir.docs}/**/*.tsx`,
                    ],
                ],
                yaml: [
                    [`${_distDir._}/**/*.yaml`,],
                ],
            };
        };
        const replace = (_stage) => ({
            current: [
                'dist/**/*',
            ],
            ignore: [
                ...FileSystem.globs.IGNORE_COPIED(_stage),
                ...FileSystem.globs.IGNORE_PROJECT,
                ...FileSystem.globs.SYSTEM,
                '**/.new-scripts/**',
                '**/.vscode/**',
            ],
            package: [
                'dist/**/*',
            ],
        });
        return {
            ...AbstractStage.ARGS_DEFAULT,
            compile: true,
            document: false,
            minimize,
            prettify,
            replace,
            test: false,
        };
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param config    Current project config.
     * @param params    Current CLI params.
     * @param args      Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor(config, params, args, _pkg, _version) {
        super('build', 'blue', config, params, args, _pkg, _version);
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /**
     * Prints a message to the console signalling the start or end of this
     * build stage.
     *
     * @param which  Whether we are starting or ending.
     */
    startEndNotice(which) {
        return super.startEndNotice(which, !this.params.packaging);
    }
    /* RUNNING METHODS
     * ====================================================================== */
    async runSubStage(subStage) {
        if (!this.args[subStage]) {
            return;
        }
        await this[subStage]();
    }
    /**
     * Runs the project's compile class.
     */
    async compile() {
        await this.runStage('compile', 1);
    }
    /**
     * Runs the project's document class.
     */
    async document() {
        await this.runStage('document', 1);
    }
    async minimize() {
        if (!this.args.minimize) {
            return;
        } // here for typing backup
        this.console.progress('minimizing built files...', 1);
        const args = typeof this.args.minimize === 'function'
            ? this.args.minimize(this)
            : this.args.minimize;
        // returns
        if (!Object.keys(args).length) {
            this.console.verbose('empty minimize config, no files to format', 2);
            return;
        }
        for (const t_format in args) {
            const _format = t_format;
            // continues
            if (typeof args[_format] === 'undefined') {
                continue;
            }
            const _formatArgs = Array.isArray(args[_format])
                ? { globs: args[_format] }
                : args[_format];
            // continues
            if (!Array.isArray(_formatArgs.globs)
                || !_formatArgs.globs.length) {
                this.console.verbose(`no globs present to minimize ${_format} files`, 2, { italic: true });
                continue;
            }
            this.console.verbose(`minimizing ${_format} files...`, 2);
            const _minimized = await this.try(this.fs.minify, (this.params.verbose ? 3 : 2), [
                _formatArgs.globs,
                _format,
                (this.params.verbose ? 3 : 2),
                {
                    ..._formatArgs.args,
                    glob: {
                        ignore: _formatArgs.ignore,
                        ..._formatArgs.args?.glob ?? {},
                    },
                },
                _formatArgs.renamer,
            ]);
            this.console.verbose(`minimized ${_minimized.length} ${_format} files`, 3, { italic: true });
        }
    }
    async prettify() {
        if (!this.args.prettify) {
            return;
        } // here for typing backup
        this.console.progress('prettifying built files...', 1);
        const args = typeof this.args.prettify === 'function'
            ? this.args.prettify(this)
            : this.args.prettify;
        // returns
        if (!Object.keys(args).length) {
            this.console.verbose('empty prettify config, no files to format', 2);
            return;
        }
        for (const t_format in args) {
            const _format = t_format;
            // continues
            if (typeof args[_format] === 'undefined') {
                continue;
            }
            // continues
            if (!args[_format]
                || !Array.isArray(args[_format][0])) {
                this.console.verbose(`no globs present to prettify ${_format} files`, 2, { italic: true });
                continue;
            }
            this.console.verbose(`prettifying ${_format} files...`, 2);
            const [_globs, _args = {},] = args[_format];
            const _prettified = await this.try(this.fs.prettier, 3, [
                _globs,
                _format,
                _args,
            ]);
            this.console.verbose(`prettified ${_prettified.length} ${_format} files`, 3, { italic: true });
        }
    }
    async replace() {
        if (!this.args.replace) {
            return;
        } // here for typing backup
        this.console.progress('replacing placeholders...', 1);
        const paths = this.args.replace(this);
        const replacements = typeof this.config.replace === 'function'
            ? this.config.replace(this)
            : this.config.replace;
        for (const _key of ['current', 'package']) {
            if (paths[_key] && replacements[_key]) {
                this.console.verbose(`making ${_key} replacements...`, 2);
                const _currentReplaced = this.fs.replaceInFiles(paths[_key], replacements[_key], (this.params.verbose ? 3 : 2), {
                    ignore: paths.ignore ?? FileSystem.globs.SYSTEM,
                });
                this.console.verbose(`replaced ${_key} placeholders in ${_currentReplaced.length} files`, 3, { italic: true });
            }
        }
    }
    /**
     * Runs the project's test class.
     */
    async test() {
        await this.runStage('test', 1);
    }
}
//# sourceMappingURL=BuildStage.js.map
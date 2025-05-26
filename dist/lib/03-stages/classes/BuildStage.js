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
        const replace = (stage) => ({
            current: [
                'dist/**/*',
            ],
            ignore: [
                ...FileSystem.globs.IGNORE_COPIED(stage),
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
            minimize: true,
            prettify,
            replace,
            test: false,
        };
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param config    Complete project configuration.
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
        // if ( !this.args.minimize ) { return; } // here for typing backup
        this.console.progress('(NOT IMPLEMENTED) running minimize sub-stage...', 1);
    }
    async prettify() {
        if (!this.args.prettify) {
            return;
        } // here for typing backup
        this.console.progress('running prettify sub-stage...', 1);
        const args = typeof this.args.prettify === 'function'
            ? this.args.prettify(this)
            : this.args.prettify;
        // returns
        if (!Object.keys(args).length) {
            this.console.verbose('empty prettier args, no files to format', 2);
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
            const _prettified = await this.fs.prettier(_globs, _format, _args);
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
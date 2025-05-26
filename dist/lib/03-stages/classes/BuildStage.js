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
            prettify: true,
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
        this.console.progress('(NOT IMPLEMENTED) running minimize sub-stage...', 1);
    }
    async prettify() {
        this.console.progress('(NOT IMPLEMENTED) running prettify sub-stage...', 1);
    }
    async replace() {
        if (!this.args.replace) {
            return;
        }
        this.console.progress('replacing placeholders...', 1);
        const paths = this.args.replace(this);
        const replacements = typeof this.config.replace === 'function'
            ? this.config.replace(this)
            : this.config.replace;
        if (paths.current && replacements.current) {
            this.fs.replaceInFiles(paths.current, replacements.current, 2, {
                ignore: paths.ignore ?? FileSystem.globs.SYSTEM,
            });
        }
        if (paths.package && replacements.package) {
            this.fs.replaceInFiles(paths.package, replacements.package, 2, {
                ignore: paths.ignore ?? FileSystem.globs.SYSTEM,
            });
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
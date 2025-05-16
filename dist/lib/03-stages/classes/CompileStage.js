/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/npm-build-utilities@0.1.0-draft
 * @license MIT
 */
import { escRegExp, escRegExpReplace } from '@maddimathon/utility-typescript/functions';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default compile stage.
 *
 * @category Stages
 *
 * @since 0.1.0-draft
 */
export class CompileStage extends AbstractStage {
    /* Args ===================================== */
    get ARGS_DEFAULT() {
        return {
            ...AbstractStage.ARGS_DEFAULT,
        };
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     */
    constructor(config, params, args) {
        super('compile', 'green', config, params, args);
        /* PROPERTIES
         * ====================================================================== */
        this.subStages = [
            'scss',
            'ts',
            'files',
        ];
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
        super.startEndNotice(which, !this.params.building);
    }
    /* RUNNING METHODS
     * ====================================================================== */
    async runSubStage(stage) {
        await this[stage]();
    }
    async scss() {
        this.log.progress('compiling scss files...', 1);
        const scssSrcDir = this.getSrcDir('scss');
        const scssPaths = scssSrcDir.map((path) => {
            // returns
            if (!this.fs.exists(path)) {
                this.log.verbose('ⅹ configured scss source path not found: ' + path, 2);
                return [];
            }
            // returns
            if (!this.fs.isDirectory(path)) {
                this.log.verbose('✓ configured scss source path found: ' + path, 2, { italic: true });
                return path;
            }
            this.log.verbose('configured scss source path is a directory: ' + path, 2);
            const testSubPaths = [
                'index.scss',
                'main.scss',
                'style.scss',
                'styles.scss',
                'index.css',
                'main.css',
                'style.css',
                'styles.css',
            ];
            for (const subPath of testSubPaths) {
                const fullPath = this.fs.pathResolve(path, subPath);
                // returns
                if (this.fs.exists(fullPath) && this.fs.isFile(fullPath)) {
                    const relativePath = this.fs.pathRelative(fullPath);
                    this.log.verbose('✓ default sub-file found: ' + relativePath, 3, { italic: true });
                    return relativePath;
                }
            }
            this.log.verbose('ⅹ no default files found', 3);
            return [];
        }).flat();
        // returns
        if (!scssPaths.length) {
            this.log.progress('no valid scss input files found, exiting...', 2, { italic: true });
            return;
        }
        const scssDistDir = this.getDistDir('scss');
        this.log.verbose('deleting existing files...', 2);
        this.fs.deleteFiles([scssDistDir]);
        this.log.verbose('building path arguments...', 2);
        const scssPathArgs = scssPaths.map((path) => {
            const srcDirRegex = new RegExp(escRegExp(this.fs.pathRelative(this.fs.pathResolve(path, '../')).replace(/\/$/g, '') + '/'), 'g');
            const out = path.replace(srcDirRegex, escRegExpReplace(scssDistDir.replace(/\/$/g, '') + '/')).replace(/\.scss$/gi, '.css');
            return {
                in: path,
                out: out,
            };
        });
        this.params.debug && this.log.varDump.progress({ scssPathArgs }, (this.params.verbose ? 3 : 2));
        this.log.verbose('compiling to css...', 2);
        for await (const { in: input, out: output } of scssPathArgs) {
            this.cpl.scss(input, output, (this.params.verbose ? 3 : 2));
        }
    }
    async ts() {
        this.log.progress('(NOT IMPLEMENTED) running ts sub-stage...', 1);
    }
    async files() {
        this.log.progress('(NOT IMPLEMENTED) running files sub-stage...', 1);
    }
}
const typeTest = CompileStage;
// only so that these are used
true;
typeTest;
//# sourceMappingURL=CompileStage.js.map
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
 */ import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default package stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 */
export class PackageStage extends AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
    subStages = ['snapshot', 'build', 'copy', 'zip'];
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
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor(config, params, args, _pkg, _version) {
        super(
            'package',
            params?.releasing ? 'orange' : 'purple',
            config,
            params,
            args,
            _pkg,
            _version,
        );
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
        const version = this.version.toString(this.isDraftVersion);
        // returns
        switch (which) {
            case 'start':
                this.console.startOrEnd(
                    [
                        ['PACKAGING...'],
                        [`${this.pkg.name}@${version}`, { flag: 'reverse' }],
                    ],
                    which,
                );
                return;
            case 'end':
                this.console.startOrEnd(
                    [
                        ['✓ ', { flag: false }],
                        ['Packaged!', { italic: true }],
                        [`${this.pkg.name}@${version}`, { flag: 'reverse' }],
                    ],
                    which,
                );
                return;
        }
        return super.startEndNotice(which, false);
    }
    /* RUNNING METHODS
     * ====================================================================== */
    async runSubStage(subStage) {
        await this[subStage]();
    }
    /**
     * Runs the project's build class.
     */
    async build() {
        await this.runStage('build', 1);
    }
    async copy() {
        this.console.progress('(NOT IMPLEMENTED) running copy sub-stage...', 1);
    }
    /**
     * Runs the project's snapshot class.
     */
    async snapshot() {
        await this.runStage('snapshot', 1);
    }
    async zip() {
        this.console.progress('(NOT IMPLEMENTED) running zip sub-stage...', 1);
    }
}
//# sourceMappingURL=PackageStage.js.map

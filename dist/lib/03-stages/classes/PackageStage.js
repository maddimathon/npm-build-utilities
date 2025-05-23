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
 */ ;
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default package stage.
 *
 * @category Stages
 *
 * @since 0.1.0-draft
 */
export class PackageStage extends AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
    subStages = [
        'snapshot',
        'build',
        'copy',
        'zip',
    ];
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
        super('package', params?.releasing ? 'orange' : 'purple', config, params, args);
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
        super.startEndNotice(which, !this.params.building, this.params.dryrun ? 'dryrun' : 'package');
    }
    /* RUNNING METHODS
     * ====================================================================== */
    async runSubStage(stage) {
        await this[stage]();
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
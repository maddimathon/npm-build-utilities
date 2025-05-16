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
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default release stage.
 *
 * @category Stages
 *
 * @since 0.1.0-draft
 */
export class ReleaseStage extends AbstractStage {
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
        super('release', 'purple', config, params, args);
        /* PROPERTIES
         * ====================================================================== */
        this.subStages = [
            'changelog',
            'package',
            'replace',
            'commit',
            'github',
            'tidy',
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
    async changelog() {
        this.log.progress('(NOT IMPLEMENTED) running changelog sub-stage...', 1);
    }
    async commit() {
        this.log.progress('(NOT IMPLEMENTED) running commit sub-stage...', 1);
    }
    async github() {
        this.log.progress('(NOT IMPLEMENTED) running github sub-stage...', 1);
    }
    /**
     * Runs the project's package class.
     */
    async package() {
        await this.runStage('package', 1);
    }
    async replace() {
        this.log.progress('(NOT IMPLEMENTED) running replace sub-stage...', 1);
    }
    async tidy() {
        this.log.progress('(NOT IMPLEMENTED) running tidy sub-stage...', 1);
    }
}
const typeTest = ReleaseStage;
// only so that these are used
true;
typeTest;
//# sourceMappingURL=ReleaseStage.js.map
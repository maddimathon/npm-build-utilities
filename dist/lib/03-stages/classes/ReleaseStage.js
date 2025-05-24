/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-draft
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
    /* PROPERTIES
     * ====================================================================== */
    subStages = [
        'changelog',
        'package',
        'replace',
        'commit',
        'github',
        'tidy',
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
        super('release', 'purple', config, params, args);
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
    async runSubStage(subStage) {
        await this[subStage]();
    }
    async changelog() {
        this.console.progress('(NOT IMPLEMENTED) running changelog sub-stage...', 1);
    }
    async commit() {
        this.console.progress('(NOT IMPLEMENTED) running commit sub-stage...', 1);
    }
    async github() {
        this.console.progress('(NOT IMPLEMENTED) running github sub-stage...', 1);
    }
    /**
     * Runs the project's package class.
     */
    async package() {
        await this.runStage('package', 1);
    }
    async replace() {
        this.console.progress('(NOT IMPLEMENTED) running replace sub-stage...', 1);
    }
    async tidy() {
        this.console.progress('(NOT IMPLEMENTED) running tidy sub-stage...', 1);
    }
}
//# sourceMappingURL=ReleaseStage.js.map
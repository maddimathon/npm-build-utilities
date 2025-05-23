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
 * Default snapshot stage.
 *
 * @category Stages
 *
 * @since 0.1.0-draft
 */
export class SnapshotStage extends AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
    subStages = [
        'snap',
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
        super('snapshot', 'pink', config, params, args);
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
    async snap() {
        this.console.progress('(NOT IMPLEMENTED) running snap sub-stage...', 1);
    }
}
//# sourceMappingURL=SnapshotStage.js.map
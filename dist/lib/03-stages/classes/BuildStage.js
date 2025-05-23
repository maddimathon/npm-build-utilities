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
 * Default build stage.
 *
 * @category Stages
 *
 * @since 0.1.0-draft
 */
export class BuildStage extends AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
    subStages = [
        'compile',
        'minimize',
        'replace',
        'prettify',
        'test',
        'document',
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
        super('build', 'blue', config, params, args);
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
        this.console.progress('(NOT IMPLEMENTED) running replace sub-stage...', 1);
    }
    /**
     * Runs the project's test class.
     */
    async test() {
        await this.runStage('test', 1);
    }
}
//# sourceMappingURL=BuildStage.js.map
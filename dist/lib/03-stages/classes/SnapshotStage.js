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
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default snapshot stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
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
     * @param _pkg    The current package.json value, if any.
     */
    constructor(config, params, args, _pkg) {
        super('snapshot', 'pink', config, params, args, _pkg);
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /* RUNNING METHODS
     * ====================================================================== */
    async runSubStage(subStage) {
        await this[subStage]();
    }
    async snap() {
        this.console.progress('running snap sub-stage...', 1);
        await this._copy();
        await this._zip();
        await this._tidy();
    }
    async _copy() {
        this.console.progress('(NOT IMPLEMENTED) copying files...', 2);
    }
    async _zip() {
        this.console.progress('(NOT IMPLEMENTED) zipping folder...', 2);
    }
    async _tidy() {
        this.console.progress('(NOT IMPLEMENTED) deleting snapshot folder...', 2);
    }
}
//# sourceMappingURL=SnapshotStage.js.map
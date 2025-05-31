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
export class TestStage extends AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
    subStages = ['js', 'scss'];
    /* Args ===================================== */
    get ARGS_DEFAULT() {
        return {
            ...AbstractStage.ARGS_DEFAULT,
            js: {
                tidy: [
                    'dist/js/**/*.test.d.ts',
                    'dist/js/**/*.test.d.ts.map',
                    'dist/js/**/*.test.js',
                    'dist/js/**/*.test.js.map',
                ],
            },
            scss: false,
        };
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    testStatus = false;
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor(config, params, args, _pkg, _version) {
        super('tests', 'red', config, params, args, _pkg, _version);
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
        // returns
        switch (which) {
            case 'end':
                this.console.startOrEnd(
                    [
                        [`${this.testStatus ? '✓' : '❌'} `, { flag: false }],
                        [
                            `Tests ${this.testStatus ? 'Complete' : 'FAILED'}!`,
                            { italic: true },
                        ],
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
    async scss() {
        if (!this.args.scss) {
            return;
        }
        this.console.progress('(NOT IMPLEMENTED) running scss sub-stage...', 1);
    }
    async js() {
        if (!this.args.js) {
            return;
        }
        this.console.progress('running jest...', 1);
        const result = this.try(
            this.console.nc.cmd,
            2,
            [
                'node --experimental-vm-modules --no-warnings node_modules/jest/bin/jest.js',
            ],
            {},
            this.params.packaging && !this.params.dryrun,
        );
        this.testStatus = result !== 'FAILED';
        if (this.params.releasing || this.params.packaging) {
            this.console.verbose('removing test files from dist...', 2);
            this.fs.delete(this.args.js.tidy, this.params.verbose ? 3 : 2);
        }
    }
}
//# sourceMappingURL=TestStage.js.map

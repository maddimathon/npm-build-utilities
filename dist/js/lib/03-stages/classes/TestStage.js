/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.3
 * @license MIT
 */ // import {
// } from '../../01-config/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default package stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 */
export class TestStage extends AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
    subStages = ['js', 'scss'];
    /* Args ===================================== */
    get ARGS_DEFAULT() {
        return {
            utils: {},
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
    /**
     * Whether any tests being run have passed.
     *
     * Reset to `false` in {@link TestStage.startEndNotice}.
     *
     * @category Sub-Stages
     */
    testStatus = false;
    /**
     * @category Constructor
     *
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param args     Partial overrides for the default args.
     * @param pkg      Parsed contents of the project’s package.json file.
     * @param version  Version object for the project’s version.
     */
    constructor(config, params, args, pkg, version) {
        super('tests', 'red', config, params, args, pkg, version);
    }
    /* LOCAL METHODS
     * ====================================================================== */
    startEndNotice(which) {
        // returns for end
        switch (which) {
            case 'start':
                this.testStatus = false;
                break;
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
    /**
     * Not implemented.
     *
     * @category Sub-Stages
     */
    async scss() {
        if (!this.args.scss) {
            return;
        }
        this.console.progress('(NOT IMPLEMENTED) running scss sub-stage...', 1);
    }
    /**
     * Runs jest for javascript testing.
     *
     * @category Sub-Stages
     */
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
            {
                exitProcess: this.params.packaging && !this.params.dryrun,
            },
        );
        this.testStatus = result !== 'FAILED';
        if (this.params.releasing || this.params.packaging) {
            this.console.verbose('removing test files from dist...', 2);
            this.fs.delete(this.args.js.tidy, this.params.verbose ? 3 : 2);
        }
    }
}
//# sourceMappingURL=TestStage.js.map

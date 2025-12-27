/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.13
 * @license MIT
 */ import { SemVer } from '../../@internal/index.js';
// import {
// } from '../../01-config/index.js';
// import {
// } from '../../02-utils/index.js';
import { Stage_Compiler } from '../../02-utils/classes/Stage_Compiler.js';
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
    /**
     * Default values for {@link Stage.Args.Test | Stage.Args.Test.js.tidy}.
     *
     * These default values are made using
     * {@link Stage_Compiler.getTsConfigPaths} and
     * {@link Stage_Compiler.getTsConfigOutDir}.  Assumes that tests match the
     * glob `**\/*.test.js` and should be deleted with any maps and type
     * definitions.
     *
     * @category Config
     *
     * @param level  Depth level for output to the console.
     *
     * @since 0.2.0-alpha
     */
    async tsConfigTidyPaths(level) {
        const tsconfigPaths = await Stage_Compiler.getTsConfigPaths(
            this,
            level,
            false,
        );
        return tsconfigPaths
            .map((_tsconfig) => {
                const _outDir = this.compiler.getTsConfigOutDir(
                    _tsconfig,
                    level,
                    false,
                );
                // returns
                if (!_outDir) {
                    return [];
                }
                return [
                    this.fs.pathResolve(_outDir, '**/*.test.d.ts'),
                    this.fs.pathResolve(_outDir, '**/*.test.d.ts.map'),
                    this.fs.pathResolve(_outDir, '**/*.test.js'),
                    this.fs.pathResolve(_outDir, '**/*.test.js.map'),
                ];
            })
            .flat();
    }
    get ARGS_DEFAULT() {
        return {
            js: {
                warnWhenNoConfigFile: true,
            },
            scss: false,
            utils: {},
        };
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * Whether any tests being run have passed.
     *
     * Reset to empty array in {@link TestStage.startEndNotice}.
     *
     * @category Sub-Stages
     *
     * @since 0.2.0-alpha — Converted from boolean to boolean[].
     */
    testResults = [];
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
                this.testResults = [];
                break;
            case 'end':
                const _allTestsSucceeded =
                    !this.testResults.length
                    || this.testResults.every((_val) => _val);
                this.console.startOrEnd(
                    [
                        [
                            `${_allTestsSucceeded ? '✓' : '❌'} `,
                            { flag: false },
                        ],
                        [
                            `Tests ${_allTestsSucceeded ? 'Complete' : 'FAILED'}!`,
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
        if (this.args.js.warnWhenNoConfigFile) {
            const configGlobs = [
                'jest.config.js',
                'jest.config.ts',
                'jest.config.mjs',
                'jest.config.cjs',
                'jest.config.cts',
                'jest.config.json',
            ];
            const configFileExists = await Promise.any(
                configGlobs.map(
                    async (path) =>
                        new Promise((res, rjct) =>
                            this.fs.exists(path) ?
                                res(this.fs.isFile(path))
                            :   rjct(false),
                        ),
                ),
            ).catch(() => false);
            if (!configFileExists) {
                const msgArgs = {
                    bold: false,
                    linesIn: 0,
                    linesOut: 0,
                };
                if (
                    await this.console.prompt.bool(
                        'No default jest config files were found, do you want to create one?',
                        2,
                        {
                            default: true,
                            msgArgs,
                            timeout: 300000,
                        },
                    )
                ) {
                    const configPath =
                        (await this.console.prompt.input(
                            'Where should the jest config file be written?',
                            2,
                            {
                                default: configGlobs[0],
                                required: true,
                                msgArgs,
                            },
                        )) ?? configGlobs[0];
                    this.fs.write(
                        configPath,
                        [
                            '// @ts-check',
                            "import { jestConfig } from '@maddimathon/build-utilities';",
                            'export default jestConfig();',
                        ].join('\n\n'),
                        { force: true },
                    );
                }
            }
        }
        const cmd =
            this.args.js.jestCmd ?
                this.args.js.jestCmd({
                    params: this.params,
                    config: this.config,
                })
            :   'NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules --no-warnings" npx jest';
        this.params.debug
            && this.console.vi.verbose({ 'jest cli cmd': cmd }, 2);
        const result = this.try(this.console.nc.cmd, 2, [cmd], {
            exitProcess: this.params.packaging && !this.params.dryrun,
        });
        this.testResults.push(result !== 'FAILED');
        this.console.verbose('tidying up...', 2);
        const tidyFiles =
            this.args.js.tidy
            ?? (await this.tsConfigTidyPaths(this.params.verbose ? 3 : 2));
        if (
            (this.params.releasing || this.params.packaging)
            && tidyFiles.length
        ) {
            this.console.verbose('deleting...', 3);
            this.fs.delete(tidyFiles, this.params.verbose ? 4 : 3);
        }
    }
}
//# sourceMappingURL=TestStage.js.map

/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import * as sass from 'sass';
import { StageError } from '../../@internal/index.js';
import { catchOrReturn } from '../../00-universal/index.js';
/**
 * To be used by {@link AbstractStage} and those that inherit from it.
 *
 * Includes a variety of utilities for compiling files (like scss and
 * typescript).
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 *
 * @internal
 */
export class Stage_Compiler {
    config;
    params;
    console;
    fs;
    /* LOCAL PROPERTIES
     * ====================================================================== */
    get tsConfig() {
        const tsSrcDir = this.config.getSrcDir(this.fs, 'ts')[0];
        const baseUrl = tsSrcDir.replace(/(?<=^|\/)[^\/]+(\/|$)/g, '..\/');
        const outDir = this.fs.pathRelative(
            this.fs.pathResolve(baseUrl, this.config.getDistDir(this.fs), 'ts'),
        );
        return {
            extends: '@maddimathon/build-utilities/tsconfig',
            exclude: ['**/node_modules/**/*'],
            compilerOptions: {
                exactOptionalPropertyTypes: false,
                outDir,
                baseUrl,
            },
        };
    }
    /* Args ===================================== */
    get ARGS_DEFAULT() {
        return {
            sass: {
                charset: true,
                sourceMap: true,
                sourceMapIncludeSources: true,
                style: 'expanded',
            },
            ts: {},
        };
    }
    args;
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param console  Instance used to log messages and debugging info.
     * @param fs       Instance used to work with paths and files.
     */
    constructor(config, params, console, fs) {
        this.config = config;
        this.params = params;
        this.console = console;
        this.fs = fs;
        this.args = {
            ...this.ARGS_DEFAULT,
            ...config.compiler,
        };
    }
    /* LOCAL METHODS
     * ====================================================================== */
    async scss(input, output, level, sassOpts) {
        this.console.vi.debug(
            {
                'Stage_Compiler.scss() params': {
                    input,
                    output,
                    level,
                    sassOpts,
                },
            },
            level,
            { bold: true },
        );
        const compiled = sass.compile(input, {
            ...this.args,
            ...sassOpts,
        });
        this.params.debug && this.console.vi.verbose({ compiled }, level);
        if (compiled.css) {
            this.console.verbose(
                'writing css to path: ' + this.fs.pathRelative(output),
                level,
                { maxWidth: null },
            );
            this.fs.write(output, compiled.css, { force: true });
        }
        if (compiled.sourceMap) {
            const sourceMap = output.replace(/\.(s?css)$/g, '.$1.map');
            this.params.debug
                && this.console.verbose(
                    'writing sourceMap to path: '
                        + this.fs.pathRelative(sourceMap),
                    1 + level,
                );
            this.fs.write(
                sourceMap,
                JSON.stringify(
                    compiled.sourceMap,
                    null,
                    this.params.packaging ? 0 : 4,
                ),
                { force: true },
            );
        }
    }
    async typescript(tsConfig, level) {
        this.console.verbose('running tsc...', 0 + level);
        // throws
        if (!this.fs.exists(tsConfig)) {
            throw new StageError('tsConfig path does not exist: ' + tsConfig, {
                class: 'Stage_Compiler',
                method: 'typescript',
            });
        }
        // throws
        if (!this.fs.isFile(tsConfig)) {
            throw new StageError('tsConfig path was not a file: ' + tsConfig, {
                class: 'Stage_Compiler',
                method: 'typescript',
            });
        }
        let config_obj = JSON.parse(this.fs.readFile(tsConfig));
        if (
            typeof config_obj === 'object'
            && config_obj?.compilerOptions?.noEmit !== true
            && config_obj?.compilerOptions?.outDir
        ) {
            const _output = this.fs.pathResolve(
                this.fs.dirname(tsConfig),
                config_obj.compilerOptions.outDir,
                '*',
            );
            this.console.debug(
                'deleting existing files from '
                    + this.fs.pathRelative(_output).replace(' ', '%20')
                    + ' ...',
                (this.params.verbose ? 1 : 0) + level,
            );
            this.fs.delete(
                [_output],
                (this.params.verbose ? 2 : 0)
                    + level
                    + this.console.params['log-base-level'],
            );
        }
        catchOrReturn(this.console.nc.cmd, 1 + level, this.console, this.fs, [
            `tsc --project "${this.fs.pathRelative(tsConfig).replace(/"/g, '\\"')}"`,
        ]);
    }
}
//# sourceMappingURL=Stage_Compiler.js.map

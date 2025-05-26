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
// import type typescript from 'typescript';
import * as sass from 'sass';
import { ProjectError, } from '../../@internal/index.js';
import { catchOrReturn, } from '../../00-universal/index.js';
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
    /* Args ===================================== */
    /**
     * Default values for the args property.
     *
     * @category Args
     */
    get ARGS_DEFAULT() {
        return {};
    }
    /**
     * A completed args object.
     *
     * @category Args
     */
    args;
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param console  Instance used to send messages to the console.
     * @param fs       Instance used to work with paths and files.
     * @param args     Partial overrides for the default args.
     */
    constructor(config, params, console, fs, args = {}) {
        this.config = config;
        this.params = params;
        this.console = console;
        this.fs = fs;
        this.args = {
            ...this.ARGS_DEFAULT,
            ...args,
        };
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /**
     * Compiles scss using the
     * {@link https://www.npmjs.com/package/sass | sass npm package}.
     *
     * @param input   Scss input path.
     * @param output  Scss output path.
     * @param level   Depth level for this message (above the value of
     *                {@link CLI.Params.log-base-level}).
     */
    async scss(input, output, level, sassOpts) {
        this.console.vi.debug({ 'Stage_Compiler.scss() params': { input, output, level, sassOpts } }, level, { bold: true });
        const compiled = sass.compile(input, {
            ...this.config.compiler?.sass,
            ...sassOpts,
        });
        this.params.debug && this.console.vi.verbose({ compiled }, level);
        if (compiled.css) {
            this.console.verbose('writing css to path: ' + output, level);
            this.fs.write(output, compiled.css, { force: true });
        }
        if (compiled.sourceMap) {
            const sourceMap = output.replace(/\.(s?css)$/g, '.$1.map');
            this.console.verbose('writing sourceMap to path: ' + sourceMap, level);
            this.fs.write(sourceMap, JSON.stringify(compiled.sourceMap, null, this.params.packaging ? 0 : 4), { force: true });
        }
    }
    /**
     * Compiles typescript using the
     * {@link https://www.npmjs.com/package/sass | sass npm package}.
     *
     * @throws {@link ProjectError}  If the tsconfig file doesn’t exist.
     *
     * @param tsConfig  Path to TS config json used to compile the project.
     * @param level     Depth level for this message (above the value of
     *                  {@link (root).CLI.Params.log-base-level}).
     */
    async typescript(tsConfig, level) {
        this.console.verbose('running tsc...', 0 + level);
        // throws
        if (!this.fs.exists(tsConfig)) {
            throw new ProjectError('tsConfig path does not exist: ' + tsConfig, {
                class: 'Stage_Compiler',
                method: 'typescript',
            });
        }
        // throws
        if (!this.fs.isFile(tsConfig)) {
            throw new ProjectError('tsConfig path was not a file: ' + tsConfig, {
                class: 'Stage_Compiler',
                method: 'typescript',
            });
        }
        let config_obj = JSON.parse(this.fs.readFile(tsConfig));
        if (typeof config_obj === 'object'
            && config_obj?.compilerOptions?.noEmit !== true
            && config_obj?.compilerOptions?.outDir) {
            const _output = this.fs.pathResolve(this.fs.dirname(tsConfig), config_obj.compilerOptions.outDir, '*');
            this.console.debug('deleting existing files from ' + this.fs.pathRelative(_output).replace(' ', '%20') + ' ...', (this.params.verbose ? 1 : 0) + level);
            this.fs.delete([_output], (this.params.verbose ? 2 : 0) + level + this.console.params['log-base-level']);
        }
        catchOrReturn(this.console.nc.cmd, 1 + level, this.console, this.fs, [`tsc --project "${this.fs.pathRelative(tsConfig).replace(/"/g, '\\"')}"`]);
    }
}
/**
 * Used only for {@link Stage_Compiler}.
 *
 * @category Class-Helpers
 */
(function (Stage_Compiler) {
    ;
})(Stage_Compiler || (Stage_Compiler = {}));
//# sourceMappingURL=Stage_Compiler.js.map
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
import * as sass from 'sass';
/**
 * To be used by {@link AbstractStage} and those that inherit from it.
 *
 * Includes a variety of utilities for compiling files (like scss and
 * typescript).
 *
 * @category Utilities
 *
 * @since 0.1.0-draft
 *
 * @internal
 */
export class Stage_Compiler {
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
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param config  Current project config.
     * @param params  Current CLI params.
     * @param log     Instance used to send messages to the console.
     * @param fs
     * @param args    Partial overrides for the default args.
     */
    constructor(config, params, log, fs, args = {}) {
        this.config = config;
        this.params = params;
        this.log = log;
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
     *                {@link Stage.Args['log-base-level']}).
     */
    async scss(input, output, level, sassOpts) {
        this.params.debug && this.log.varDump.progress({ 'Stage_Compiler.scss() params': { input, output, level } }, level, { bold: true });
        const compiled = sass.compile(input, {
            ...this.config.compiler.sass,
            ...sassOpts,
        });
        this.params.debug && this.log.varDump.verbose({ compiled }, level);
        if (compiled.css) {
            this.log.verbose('writing css to path: ' + output, level);
            this.fs.writeFile(output, compiled.css, { force: true });
        }
        if (compiled.sourceMap) {
            const sourceMap = output.replace(/\.(s?css)$/g, '.$1.map');
            this.log.verbose('writing sourceMap to path: ' + sourceMap, 1 + level);
            this.fs.writeFile(sourceMap, JSON.stringify(compiled.sourceMap, null, this.params.packaging ? 0 : 4), { force: true });
        }
        // TODO add replacement step
        // for ( const o of currentReplacements( this ).concat( pkgReplacements( this ) ) ) {
        //     this.replaceInFiles(
        //         output,
        //         o.find,
        //         o.replace,
        //         1 + logBaseLevel,
        //     );
        // }
    }
}
/**
 * Used only for {@link Stage_Compiler}.
 *
 * @category Utilities
 */
(function (Stage_Compiler) {
    ;
})(Stage_Compiler || (Stage_Compiler = {}));
//# sourceMappingURL=Stage_Compiler.js.map
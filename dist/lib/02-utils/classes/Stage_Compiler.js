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
// import type typescript from 'typescript';
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
        this.params.debug && this.log.varDump.progress({ 'Stage_Compiler.scss() params': { input, output, level, sassOpts } }, level, { bold: true });
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
            this.log.verbose('writing sourceMap to path: ' + sourceMap, level);
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
    /**
     * Compiles typescript using the
     * {@link https://www.npmjs.com/package/sass | sass npm package}.
     *
     * @param tsConfig  TS config json file path.
     * @param level     Depth level for this message (above the value of
     *                  {@link Stage.Args['log-base-level']}).
     */
    async typescript(tsConfig, level) {
        // this.log.varDump.progress( { 'Stage_Compiler.typescript() params': { input, level } }, level, { bold: true } );
        // const rootNames: string[] = Array.isArray( input )
        //     ? input
        //     : [ input ];
        this.log.verbose('running tsc...', level);
        this.log.nc.cmd(`tsc --project "${this.fs.pathRelative(tsConfig).replace(/"/g, '\\"')}"`);
        // this.log.varDump.progress( { rootNames }, 1 + level );
        // const options: typescript.CompilerOptions = {
        //     ...( this.config.compiler.tsConfig ?? {} ) as typescript.CompilerOptions,
        //     target: undefined,
        //     ...this.config.compiler.ts,
        //     ...tsOpts,
        // };
        // this.log.varDump.progress( { options }, 1 + level );
        // const tsConfig = typescript.parseJsonConfigFileContent( 'src/ts/tsconfig.json' );
        // this.log.varDump.progress( { tsConfig }, 1 + level );
        // const program = typescript.createProgram( {
        //     rootNames: rootNames.map( path => this.fs.pathResolve( path ) ),
        //     options,
        // } );
        // const sourceFiles: typescript.SourceFile[] = program.getRootFileNames().map( path => program.getSourceFile( path ) ?? [] ).flat();
        // this.log.varDump.progress( { sourceFiles: sourceFiles.map( file => this.fs.pathRelative( file.fileName ) ) }, 1 + level );
        // const emitResult = sourceFiles.map( file => program.emit( file ) );
        // this.log.varDump.progress( { emitResult }, 1 + level );
        // const varDump_program = {
        //     'getRootFileNames()': program.getRootFileNames().map(
        //         ( file ) => {
        //             return this.fs.pathRelative( file );
        //         }
        //     ),
        //     'getSourceFiles()': arrayUnique( program.getSourceFiles().map(
        //         ( file ) => {
        //             const path = this.fs.pathRelative( file.fileName );
        //             const nodeModulesRegExp = /^(\.\.\/)*node_modules\//g;
        //             if ( path.match( nodeModulesRegExp ) === null ) {
        //                 return path.replace( nodeModulesRegExp, '' );
        //             }
        //             return path;
        //         }
        //     ) ),
        //     getOptionsDiagnostics: program.getOptionsDiagnostics,
        //     'getCompilerOptions()': program.getCompilerOptions(),
        //     'getOptionsDiagnostics()': program.getOptionsDiagnostics(),
        //     'getNodeCount()': program.getNodeCount(),
        // };
        // for ( const _key in varDump_program ) {
        //     const key = _key as keyof typeof varDump_program;
        //     this.log.varDump.progress( { [ `program.${ key }` ]: varDump_program[ key ] }, 1 + level );
        // }
        // const allDiagnostics = typescript
        //     .getPreEmitDiagnostics( program )
        //     .concat( emitResult.diagnostics );
        // this.log.varDump.progress( { allDiagnostics }, 1 + level );
        // for ( const diagnostic of allDiagnostics ) {
        //     if ( diagnostic.file ) {
        //         const {
        //             character,
        //             line,
        //         } = typescript.getLineAndCharacterOfPosition( diagnostic.file, diagnostic.start! );
        //         const message = typescript.flattenDiagnosticMessageText( diagnostic.messageText, "\n" );
        //         this.log.notice( `${ diagnostic.file.fileName } (${ line + 1 },${ character + 1 }): ${ message }`, 1 + level );
        //     } else {
        //         this.log.notice( typescript.flattenDiagnosticMessageText( diagnostic.messageText, "\n" ), 1 + level );
        //     }
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
/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type { Node } from '@maddimathon/utility-typescript/types';

import type {
    CLI,
    Stage,
} from '../../../types/index.js';

import {
    SemVer,
} from '../../@internal/index.js';

import {
    FileSystem,
} from '../../00-universal/index.js';

import {
    ProjectConfig,
} from '../../01-config/index.js';

import { AbstractStage } from './abstract/AbstractStage.js';



/**
 * Default build stage.
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 */
export class BuildStage extends AbstractStage<
    Stage.SubStage.Build,
    Stage.Args.Build
> {



    /* PROPERTIES
     * ====================================================================== */

    public readonly subStages: Stage.SubStage.Build[] = [
        'compile',
        'replace',
        'prettify',
        'minimize',
        'test',
        'document',
    ];


    /* Args ===================================== */

    public get ARGS_DEFAULT() {

        const replace = ( stage: Stage.Class ) => ( {

            current: [
                'dist/**/*',
            ],

            ignore: [
                ...FileSystem.globs.IGNORE_COPIED( stage ),
                ...FileSystem.globs.IGNORE_PROJECT,
                ...FileSystem.globs.SYSTEM,

                '**/.new-scripts/**',
                '**/.vscode/**',
            ],

            package: [
                'dist/**/*',
            ],
        } );

        return {
            ...AbstractStage.ARGS_DEFAULT,

            compile: true,
            document: false,
            minimize: true,
            prettify: true,
            replace,
            test: false,

        } as const satisfies Stage.Args.Build;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @param config    Complete project configuration.
     * @param params    Current CLI params.
     * @param args      Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor (
        config: ProjectConfig,
        params: CLI.Params,
        args: Partial<Stage.Args.Build>,
        _pkg?: Node.PackageJson,
        _version?: SemVer,
    ) {
        super( 'build', 'blue', config, params, args, _pkg, _version );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /**
     * Prints a message to the console signalling the start or end of this
     * build stage.
     *
     * @param which  Whether we are starting or ending.
     */
    public override startEndNotice( which: "start" | "end" | null ) {
        return super.startEndNotice( which, !this.params.packaging );
    }



    /* RUNNING METHODS
     * ====================================================================== */

    protected async runSubStage( subStage: Stage.SubStage.Build ) {
        if ( !this.args[ subStage ] ) { return; }
        await this[ subStage ]();
    }

    /**
     * Runs the project's compile class.
     */
    protected async compile() {
        await this.runStage( 'compile', 1 );
    }

    /**
     * Runs the project's document class.
     */
    protected async document() {
        await this.runStage( 'document', 1 );
    }

    protected async minimize() {
        this.console.progress( '(NOT IMPLEMENTED) running minimize sub-stage...', 1 );
    }

    protected async prettify() {
        this.console.progress( '(NOT IMPLEMENTED) running prettify sub-stage...', 1 );
    }

    protected async replace() {
        if ( !this.args.replace ) { return; }
        this.console.progress( 'replacing placeholders...', 1 );

        const paths = this.args.replace( this );

        const replacements = typeof this.config.replace === 'function'
            ? this.config.replace( this )
            : this.config.replace;

        if ( paths.current && replacements.current ) {

            this.fs.replaceInFiles( paths.current, replacements.current, 2, {
                ignore: paths.ignore ?? FileSystem.globs.SYSTEM,
            } );
        }

        if ( paths.package && replacements.package ) {

            this.fs.replaceInFiles( paths.package, replacements.package, 2, {
                ignore: paths.ignore ?? FileSystem.globs.SYSTEM,
            } );
        }
    }

    /**
     * Runs the project's test class.
     */
    protected async test() {
        await this.runStage( 'test', 1 );
    }
}
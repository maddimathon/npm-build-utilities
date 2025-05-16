/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type { Test } from '@maddimathon/utility-typescript/types';

import { escRegExp, escRegExpReplace } from '@maddimathon/utility-typescript/functions';

import type {
    CLI,
    Stage,
} from '../../../types/index.js';

import { ProjectConfig } from '../../01-config/index.js';

import { AbstractStage } from './abstract/AbstractStage.js';



/**
 * Default compile stage.
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 */
export class CompileStage extends AbstractStage<
    Stage.SubStage.Compile,
    Stage.Args.Compile
> {



    /* PROPERTIES
     * ====================================================================== */

    public readonly subStages: Stage.SubStage.Compile[] = [
        'scss',
        'ts',
        'files',
    ];


    /* Args ===================================== */

    public get ARGS_DEFAULT(): Stage.Args.Compile {

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
    constructor (
        config: ProjectConfig,
        params: CLI.Params,
        args?: Partial<Stage.Args.Compile>,
    ) {
        super( 'compile', 'green', config, params, args );
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
        super.startEndNotice( which, !this.params.building );
    }



    /* RUNNING METHODS
     * ====================================================================== */

    protected async runSubStage( stage: Stage.SubStage.Compile ) {
        await this[ stage ]();
    }

    protected async scss() {
        this.log.progress( 'compiling scss files...', 1 );

        const scssSrcDir = this.getSrcDir( 'scss' );

        const scssPaths = scssSrcDir.map( ( path ) => {
            // returns
            if ( !this.fs.exists( path ) ) {
                this.log.verbose( 'ⅹ configured scss source path not found: ' + path, 2, { italic: true } );
                return [];
            }

            // returns
            if ( !this.fs.isDirectory( path ) ) {
                this.log.verbose( '✓ configured scss source path found: ' + path, 2, { italic: true } );
                return path;
            }

            this.log.verbose( 'configured scss source path is a directory: ' + path, 2, { italic: true } );

            const testSubPaths = [
                'index.scss',
                'main.scss',
                'style.scss',
                'styles.scss',
                'index.css',
                'main.css',
                'style.css',
                'styles.css',
            ];

            for ( const subPath of testSubPaths ) {

                const fullPath = this.fs.pathResolve( path, subPath );

                // returns
                if ( this.fs.exists( fullPath ) && this.fs.isFile( fullPath ) ) {
                    const relativePath = this.fs.pathRelative( fullPath );
                    this.log.verbose( '✓ default sub-file found: ' + relativePath, 3, { italic: true } );
                    return relativePath;
                }
            }

            this.log.verbose( 'ⅹ no default files found', 3 );
            return [];
        } ).flat();

        // returns
        if ( !scssPaths.length ) {
            this.log.progress( 'no valid scss input files found, exiting...', 2, { italic: true } );
            return;
        }

        const scssDistDir = this.getDistDir( 'scss' );

        this.log.verbose( 'deleting existing files...', 2 );
        this.fs.deleteFiles( [ scssDistDir ] );

        this.log.verbose( 'building path arguments...', 2 );

        const scssPathArgs = scssPaths.map( ( path ) => {

            const srcDirRegex = new RegExp( escRegExp(
                this.fs.pathRelative(
                    this.fs.pathResolve( path, '../' )
                ).replace( /\/$/g, '' ) + '/'
            ), 'g' );

            const out = path.replace(
                srcDirRegex,
                escRegExpReplace( scssDistDir.replace( /\/$/g, '' ) + '/' )
            ).replace(
                /\.scss$/gi,
                '.css'
            );

            return {
                in: path,
                out: out,
            };
        } );

        this.params.debug && this.log.varDump.progress( { scssPathArgs }, ( this.params.verbose ? 3 : 2 ) );

        this.log.verbose( 'compiling to css...', 2 );
        return Promise.all( scssPathArgs.map(
            ( { in: input, out: output } ) => this.cpl.scss( input, output, ( this.params.verbose ? 3 : 2 ) )
        ) );
    }

    protected async ts() {
        this.log.progress( 'compiling typescript files...', 1 );

        const tsSrcDir = this.getSrcDir( 'ts' );

        const tsPaths = tsSrcDir.map( ( path ) => {
            // returns
            if ( !this.fs.exists( path ) ) {
                this.log.verbose( 'ⅹ configured ts source path not found: ' + path, 2, { italic: true } );
                return [];
            }

            // returns
            if ( !this.fs.isDirectory( path ) ) {
                this.log.verbose( '✓ configured ts source path found: ' + path, 2, { italic: true } );
                return path;
            }

            this.log.verbose( 'configured ts source path is a directory: ' + path, 2, { italic: true } );

            const testSubPaths = [
                'tsConfig.json',
                'tsconfig.json',
                '../tsConfig.json',
                '../tsconfig.json',
            ];

            for ( const subPath of testSubPaths ) {

                const fullPath = this.fs.pathResolve( path, subPath );

                // returns
                if ( this.fs.exists( fullPath ) && this.fs.isFile( fullPath ) ) {
                    const relativePath = this.fs.pathRelative( fullPath );
                    this.log.verbose( '✓ default sub-file found: ' + relativePath, 3, { italic: true } );
                    return relativePath;
                }
            }

            this.log.verbose( 'ⅹ no default files found', 3 );
            return [];
        } ).flat();

        const tsDistDir = this.getDistDir( 'ts' );

        // returns if no tsconfig.json is created
        if ( !tsPaths.length ) {

            const msgArgs = {
                depth: 2 + this.params[ 'log-base-level' ],
            };

            // returns
            if ( !await this.log.nc.prompt.bool( {
                message: 'No tsconfig.json files found, do you want to create one?',

                default: true,
                msgArgs: {
                    ...msgArgs,
                    linesIn: 1,
                },
            } ) ) {
                return;
            }

            const tsSrcDir = this.getSrcDir( 'ts' )[ 0 ];

            const _tsConfigDefault = this.fs.pathRelative( this.fs.pathResolve(
                tsSrcDir,
                './tsconfig.json'
            ) );

            const tsConfigFile = await this.log.nc.prompt.input( {
                message: 'Where should the tsconfig.json be written?',

                default: _tsConfigDefault,
                msgArgs: {
                    ...msgArgs,
                    linesOut: 1,
                },
                required: true,
            } );

            this.params.debug && this.log.varDump.progress( { tsConfigFile }, 3 );

            // returns
            if ( !tsConfigFile ) {
                return;
            }

            const baseUrl = tsSrcDir.replace( /(?<=^|\/)[^\/]+(\/|$)/g, '..\/' );

            this.params.debug && this.log.varDump.progress( { baseUrl }, 2 );

            const outDir = this.fs.pathRelative( this.fs.pathResolve( baseUrl, tsDistDir ) );

            this.params.debug && this.log.varDump.progress( { outDir }, 2 );

            this.fs.writeFile( this.fs.pathResolve( tsConfigFile ), JSON.stringify( {
                extends: '@maddimathon/npm-build-utilities/tsconfig',
                include: [
                    './**/*',
                ],

                ...this.config.compiler.tsConfig ?? {},

                compilerOptions: {
                    ...this.config.compiler.tsConfig?.compilerOptions ?? {},
                    outDir,
                    baseUrl,
                }
            }, null, 4 ), { force: true } );

            tsPaths.push( tsConfigFile );
        }

        this.log.verbose( 'deleting existing files...', 2 );
        this.fs.deleteFiles( [ tsDistDir ] );

        this.params.debug && this.log.varDump.progress( { tsPaths }, ( this.params.verbose ? 3 : 2 ) );

        this.log.verbose( 'compiling to javascript...', 2 );
        return Promise.all( tsPaths.map(
            tsc => {
                this.log.verbose( 'compiling project: ' + tsc, ( this.params.verbose ? 3 : 2 ) );
                return this.cpl.typescript( tsc, ( this.params.verbose ? 4 : 2 ) );
            }
        ) );
    }

    protected async files() {
        this.log.progress( '(NOT IMPLEMENTED) running files sub-stage...', 1 );
    }
}


/*
 * TYPE TESTING 
 */

type CompileClassType = Stage.ClassType.All[ 'compile' ];

const typeTest: CompileClassType = CompileStage;

type TypeTest = Test.Expect<Test.Satisfies<typeof CompileStage, CompileClassType>>;

// only so that these are used
true as TypeTest;
typeTest;
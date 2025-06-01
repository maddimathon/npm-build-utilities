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
 */;

import type { Node } from '@maddimathon/utility-typescript/types';

import {
    arrayUnique,
    escRegExp,
    timestamp,
} from '@maddimathon/utility-typescript/functions';

import {
    node,
} from '@maddimathon/utility-typescript/classes';

import type {
    CLI,
    Stage,
} from '../../../types/index.js';

import {
    ProjectError,
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
 * Default package stage.
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 */
export class PackageStage extends AbstractStage<
    Stage.SubStage.Package,
    Stage.Args.Package
> {



    /* PROPERTIES
     * ====================================================================== */

    public readonly subStages: Stage.SubStage.Package[] = [
        'snapshot',
        'build',
        'copy',
        'zip',
    ];


    /* Args ===================================== */

    public get ARGS_DEFAULT() {

        return {
            ...AbstractStage.ARGS_DEFAULT,
        } as const satisfies Stage.Args.Package;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor (
        config: ProjectConfig,
        params: CLI.Params,
        args: Partial<Stage.Args.Package>,
        _pkg?: Node.PackageJson,
        _version?: SemVer,
    ) {
        super( 'package', params?.releasing ? 'orange' : 'purple', config, params, args, _pkg, _version );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /**
     * Runs the prompters to confirm before starting the substages.
     */
    protected async startPrompters() {

        const promptArgs: Omit<node.NodeConsole_Prompt.Config, "message"> = {

            default: false,

            msgArgs: {
                clr: this.clr,
                depth: 1,
                maxWidth: null,
            },

            styleClrs: {
                highlight: this.clr,
            },
        };

        this.params.dryrun = await this.console.nc.prompt.bool( {
            ...promptArgs,

            message: `Is this a dry run?`,
            default: !!this.params.dryrun,

            msgArgs: {
                ...promptArgs.msgArgs,
                linesIn: 1 + ( promptArgs.msgArgs?.linesIn ?? 0 ),
            },

        } ) ?? !!this.params.dryrun;
    }

    /**
     * Prints a message to the console signalling the start or end of this
     * build stage.
     *
     * @param which  Whether we are starting or ending.
     */
    public override async startEndNotice( which: "start" | "end" | null ) {

        const version = this.version.toString( this.isDraftVersion );

        // returns
        switch ( which ) {

            case 'start':
                this.console.startOrEnd( [
                    [ 'PACKAGING...' ],
                    [ `${ this.pkg.name }@${ version }`, { flag: 'reverse' } ],
                ], which );

                if ( !this.params.releasing ) {
                    await this.startPrompters();
                }
                return;

            case 'end':
                this.console.startOrEnd( [
                    [ '✓ ', { flag: false } ],
                    [ 'Packaged!', { italic: true } ],
                    [ `${ this.pkg.name }@${ version }`, { flag: 'reverse' } ],
                ], which );
                return;
        }

        return super.startEndNotice( which, false );
    }



    /* RUNNING METHODS
     * ====================================================================== */

    protected async runSubStage( subStage: Stage.SubStage.Package ) {
        await this[ subStage ]();
    }

    /**
     * Runs the project's build class.
     */
    protected async build() {
        await this.runStage( 'build', 1 );
    }

    protected async copy() {
        this.console.progress( 'copying files to package directory...', 1 );

        // throws & returns
        if ( !this.pkg.files?.length ) {

            this.handleError( new ProjectError(
                'No files defined in package.json for export',
                { class: 'PackageStage', method: 'copy' },
            ), 2 );
            return;
        }

        const releaseDir = this.releaseDir;

        let t_ignore = [
            ...FileSystem.globs.SYSTEM,

            '**/.archive/**',
            '**/.cache/**',
            '**/.snapshots/**',
            '**/composer.phar',

            '**/*.css.map',
            '**/*.js.map',

            '**/*.test.d.ts',
            '**/*.test.d.ts.map',
            '**/*.test.js',
        ];

        for ( const _path of [ '.gitignore', '.npmignore' ] ) {

            const _ignoreFile = this.fs.readFile( _path );

            // continues
            if ( !_ignoreFile ) {
                continue;
            }

            for ( const _line of _ignoreFile.split( /\n/i ) ) {
                // continues
                if ( _line.match( /^(#+\s|!)/gi ) !== null ) {
                    continue;
                }

                if ( _line ) {
                    t_ignore.push( _line );
                }
            }
        }

        const ignore = arrayUnique( t_ignore );


        if ( this.fs.exists( releaseDir ) ) {
            this.console.verbose( 'deleting current package folder...', 2 );

            this.try(
                this.fs.delete,
                ( this.params.verbose ? 4 : 3 ),
                [ [ releaseDir ], ( this.params.verbose ? 3 : 2 ) ],
            );
        }


        this.console.verbose( 'copying files to package...', 2 );
        this.fs.copy(
            this.pkg.files,
            ( this.params.verbose ? 3 : 2 ),
            releaseDir,
            './',
            {
                glob: {
                    filesOnly: true,
                    ignore,
                },
            }
        );


        this.console.verbose( 'replacing placeholders in package...', 2 );

        const replaceGlobs = [ releaseDir.replace( /\/$/gi, '' ) + '/**/*' ];

        for ( const _key of ( [ 'current', 'package' ] as const ) ) {

            this.replaceInFiles(
                replaceGlobs,
                _key,
                ( this.params.verbose ? 3 : 2 ),
            );
        }
    }

    /**
     * Runs the project's snapshot class.
     */
    protected async snapshot() {
        await this.runStage( 'snapshot', 1 );
    }

    protected async zip() {
        this.console.progress( 'zipping package...', 1 );

        let zipPath = this.releaseDir.replace( /\/*$/g, '' ) + '.zip';

        /**
         * Directory to use as working dir when zipping the project.
         * With a trailing slash.
         */
        const zippingPWD = this.fs.pathResolve( this.releaseDir, '..' ).replace( /\/*$/g, '' ) + '/';

        /**
         * Regex that matches the path to the working directory to zip from.
         */
        const zippingPWD_regex = new RegExp( '^' + escRegExp( zippingPWD ), 'g' );

        /*
         * Correcting and formatting the output zip path. 
         */
        zipPath = this.fs.pathResolve( zipPath ).replace( /(\/*|\.zip)?$/g, '' ) + '.zip';

        if ( this.fs.exists( zipPath ) ) {

            const _timeStr = timestamp( null, {
                date: true,
                separator: '@',
                time: true,
            } ).replace( /[^a-z|0-9|\@]+/gi, '' ).replace( /@/g, '-' );

            zipPath = this.fs.uniquePath(
                zipPath.replace( /(\/*|\.zip)?$/g, '' ) + `-${ _timeStr }.zip`
            );
        }

        /**
         * All files to include in the zip file.
         */
        const files = this.fs.glob(
            this.releaseDir.replace( /\/*$/g, '/**' ),
            { filesOnly: true },
        ).map( p => p.replace( zippingPWD_regex, '' ) );

        /*
         * Running the command. 
         */
        const zipCMD = `cd "${ this.fs.pathRelative( zippingPWD ) }" && zip "${ zipPath.replace( zippingPWD_regex, '' ) }" '${ files.join( "' '" ) }'`;
        this.try(
            this.console.nc.cmd,
            ( this.params.verbose ? 3 : 2 ),
            [ zipCMD ],
        );
    }
}
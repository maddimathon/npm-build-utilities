/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type {
    Json,
} from '@maddimathon/utility-typescript/types';

import {
    slugify,
    timestamp,
} from '@maddimathon/utility-typescript/functions';

import {
    MessageMaker,
} from '@maddimathon/utility-typescript/classes';

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
 * Default snapshot stage.
 * 
 * @category Stages
 * 
 * @since 0.1.0-alpha
 */
export class SnapshotStage extends AbstractStage<
    Stage.Args.Snapshot,
    Stage.SubStage.Snapshot
> {



    /* PROPERTIES
     * ====================================================================== */

    /**
     * Output name for the snapshot zip.
     * 
     * @category Config
     */
    public readonly filename: string;

    /**
     * Output directory for the snapshot.
     * 
     * @category Config
     */
    public readonly path: string;

    public readonly subStages: Stage.SubStage.Snapshot[] = [
        'snap',
    ];


    /* Args ===================================== */

    public get ARGS_DEFAULT() {

        return {
            utils: {},

            ignoreGlobs: ( _stage: Stage ) => [
                ...FileSystem.globs.IGNORE_COPIED( _stage ),
                ...FileSystem.globs.IGNORE_COMPILED( _stage ),
                ...FileSystem.globs.IGNORE_PROJECT,
                ...FileSystem.globs.SYSTEM,
            ],
        } as const satisfies Stage.Args.Snapshot;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @category Constructor
     * 
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param args     Partial overrides for the default args.
     * @param pkg      Parsed contents of the project’s package.json file.
     * @param version  Version object for the project’s version.
     */
    constructor (
        config: ProjectConfig,
        params: CLI.Params,
        args: Partial<Stage.Args.Snapshot>,
        pkg?: Json.PackageJson,
        version?: SemVer,
    ) {
        super( 'snapshot', 'pink', config, params, args, pkg, version );

        this.filename = [
            this.pkg.name.replace( /\//g, '_' ).replace( /[^a-z0-9\-_]+/gi, '-' ).replace( /(^\-+|\-+$)/g, '' ),
            slugify( this.version.toString( this.isDraftVersion ).replace( /[\.\+]/g, '-' ) ),
            timestamp( null, { date: true, time: true } ).replace( /[\-:]/g, '' ).replace( /[^\d]+/g, '-' ),
        ].join( '_' );

        this.path = this.fs.pathRelative(
            this.fs.pathResolve( this.config.paths.snapshot, this.filename )
        );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    public override async startEndNotice( which: "start" | "end" | null ) {

        // returns
        if ( which !== 'end' ) {
            return super.startEndNotice( which, false );
        }

        const _endMsg: MessageMaker.BulkMsgs = [
            [ '✓ ', { flag: false } ],
            [ 'Snapshot Complete!', { italic: true } ],
            [
                this.path + '.zip',
                { bold: false, flag: false, indent: '  ', italic: true }
            ],
        ];

        this.console.startOrEnd( _endMsg, which, { maxWidth: null } );
        return;
    }



    /* RUNNING METHODS
     * ====================================================================== */

    protected async runSubStage( subStage: Stage.SubStage.Snapshot ) {
        await this[ subStage ]();
    }

    /**
     * Runs the whole snapshot.
     * 
     * @category Sub-Stages
     */
    protected async snap() {

        await this._tidy();

        this.console.verbose( 'copying files...', 1 );
        const copyPaths = this.try(
            this.fs.glob,
            2,
            [
                '**/*',
                {
                    follow: false,
                    ignore: (
                        typeof this.args.ignoreGlobs === 'function'
                            ? this.args.ignoreGlobs( this )
                            : this.args.ignoreGlobs
                    ),
                },
            ]
        ).filter( _p => !this.fs.isSymLink( _p ) );

        this.fs.mkdir( this.path );

        this.try(
            this.fs.copy,
            ( this.params.verbose ? 2 : 1 ),
            [
                copyPaths,
                ( this.params.verbose ? 2 : 1 ),
                this.path,
                null,
                {
                    recursive: false,
                },
            ],
        );

        await this._zip();

        this.console.verbose( 'removing the snapshot folder...', 1 );
        this.try(
            this.fs.delete,
            ( this.params.verbose ? 2 : 1 ),
            [ this.path, ( this.params.verbose ? 2 : 1 ), false ],
        );
    }

    /**
     * Deletes any existing snapshot folders.
     * 
     * @category Utilities
     */
    protected async _tidy() {
        this.console.verbose( 'removing any current folders...', 1 );

        const snapDir = this.config.paths.snapshot.replace( /\/$/g, '' ) + '/';

        // returns
        if ( !this.fs.exists( snapDir ) ) {
            return;
        }

        const currentFolders = this.fs.readDir( snapDir )
            .map( p => snapDir + p )
            .filter( path => this.fs.isDirectory( path ) );

        this.try(
            this.fs.delete,
            this.params.verbose ? 2 : 1,
            [ currentFolders, this.params.verbose ? 2 : 1, false ],
        );
    }

    /**
     * Zips the snapshot folder.
     * 
     * @category Utilities
     */
    protected async _zip() {
        this.console.verbose( 'zipping folder...', 1 );

        this.try(
            this.console.nc.cmd,
            this.params.verbose ? 2 : 1,
            [ `cd ${ this.config.paths.snapshot } && zip -r ${ this.filename }.zip ${ this.filename }` ],
        );
    }
}
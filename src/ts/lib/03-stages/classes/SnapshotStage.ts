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
import { slugify, timestamp } from '@maddimathon/utility-typescript/functions';

import type {
    CLI,
    Stage,
} from '../../../types/index.js';

import { SemVer } from '../../@internal.js';

import { ProjectConfig } from '../../01-config/index.js';

import { AbstractStage } from './abstract/AbstractStage.js';



/**
 * Default snapshot stage.
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 */
export class SnapshotStage extends AbstractStage<
    Stage.SubStage.Snapshot,
    Stage.Args.Snapshot
> {



    /* PROPERTIES
     * ====================================================================== */

    /**
     * Output name for the snapshot zip.
     */
    public readonly filename: string;

    /**
     * Output directory for the snapshot.
     */
    public readonly path: string;

    public readonly subStages: Stage.SubStage.Snapshot[] = [
        'snap',
    ];


    /* Args ===================================== */

    public get ARGS_DEFAULT() {

        return {
            ...AbstractStage.ARGS_DEFAULT,

            ignoreGlobs: ( stage: Stage.Class ) => [
                '.git/**',
                'node_modules/**',
                'dist/**',
                'docs/**',

                `${ stage.config.paths.release.replace( /\/$/g, '' ) }/**`,
                `${ stage.config.paths.snapshot.replace( /\/$/g, '' ) }/**`,

                '**/._*',
                '**/._*/**',
                '**/.DS_Store',
                '**/.smbdelete**',
            ],
        } as const satisfies Stage.Args.Snapshot;
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
        args: Partial<Stage.Args.Snapshot>,
        _pkg?: Node.PackageJson,
        _version?: SemVer,
    ) {
        super( 'snapshot', 'pink', config, params, args, _pkg, _version );

        this.filename = [
            slugify( this.pkg.name.replace( /\//g, '_' ) ),
            slugify( this.version.toString( this.isDraftVersion ).replace( /[\.\+]/g, '-' ) ),
            timestamp( null, { date: true, time: true } ).replace( /[\-:]/g, '' ).replace( /[^\d]+/g, '-' ),
        ].join( '_' );

        this.path = this.fs.pathRelative(
            this.fs.pathResolve( this.config.paths.snapshot, this.filename )
        );
    }



    /* LOCAL METHODS
     * ====================================================================== */



    /* RUNNING METHODS
     * ====================================================================== */

    protected async runSubStage( subStage: Stage.SubStage.Snapshot ) {
        await this[ subStage ]();
    }

    protected async snap() {

        this.console.progress( 'copying files...', 1 );
        this.fs.copy( '*', 2, this.path, null, {
            glob: {
                ignore: typeof this.args.ignoreGlobs === 'function'
                    ? this.args.ignoreGlobs( this )
                    : this.args.ignoreGlobs,
            },
        } );

        await this._zip();
        await this._tidy();
    }

    protected async _zip() {
        this.console.progress( '(NOT IMPLEMENTED) zipping folder...', 1 );
    }

    protected async _tidy() {
        this.console.progress( '(NOT IMPLEMENTED) deleting snapshot folder...', 1 );
    }
}
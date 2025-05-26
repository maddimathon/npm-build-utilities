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

import {
    escRegExpReplace,
    softWrapText,
} from '@maddimathon/utility-typescript/functions';

import type {
    node,

    MessageMaker,
} from '@maddimathon/utility-typescript/classes';

import type {
    CLI,
    Stage,
} from '../../../types/index.js';

import { SemVer } from '../../@internal/index.js';

import { ProjectConfig } from '../../01-config/index.js';

import { AbstractStage } from './abstract/AbstractStage.js';



/**
 * Default release stage.
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 */
export class ReleaseStage extends AbstractStage<
    Stage.SubStage.Release,
    Stage.Args.Release
> {



    /* PROPERTIES
     * ====================================================================== */

    public readonly subStages: Stage.SubStage.Release[] = [
        'changelog',
        'package',
        'replace',
        'commit',
        'github',
        'tidy',
    ];


    /* Args ===================================== */

    public get ARGS_DEFAULT() {

        return {
            ...AbstractStage.ARGS_DEFAULT,
        } as const satisfies Stage.Args.Release;
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
        args: Partial<Stage.Args.Release>,
        _pkg?: Node.PackageJson,
        _version?: SemVer,
    ) {
        super( 'release', 'purple', config, params, args, _pkg, _version );
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


        // corrects package number
        const inputVersionMessage = 'What version is being released?';

        const inputVersionIndent: string = ' '.repeat(
            this.console.nc.msg.args.msg.tab.length
            + inputVersionMessage.length
            + 11
        );

        const inputVersion = ( await this.console.nc.prompt.input( {
            ...promptArgs ?? {},
            message: inputVersionMessage,

            default: this.pkg.version,
            validate: ( value ) => (
                value.trim().match( /^\d+\.\d+\.\d+(\-((alpha|beta)(\.\d+)?|\d+\.\d+\.\d+))?(\+[^\s]+)?$/gi )
                    ? true
                    : softWrapText(
                        'The version should be in [MAJOR].[MINOR].[PATCH] format, optionally suffixed with `-alpha[.#]`, `-beta[.#]`, another valid version code, or metadata prefixed with `+`.',
                        Math.max( 20, ( this.console.nc.msg.args.msg.maxWidth ?? 80 ) - inputVersionIndent.length )
                    ).split( /\n/g ).join( '\n' + inputVersionIndent )
            ),
        } ) ?? '' ).trim();

        if ( inputVersion !== this.pkg.version ) {

            const currentPkgJson: string = this.fs.readFile( 'package.json' );

            this.version = inputVersion;

            this.fs.write(
                'package.json',
                currentPkgJson.replace(
                    /"version":\s*"[^"]*"/gi,
                    escRegExpReplace( `"version": "${ inputVersion }"` )
                ),
                { force: true }
            );
        }

        // returns if prep questions fail
        if ( !this.params.dryrun && this.isSubStageIncluded( 'changelog', 1 ) ) {

            // returns
            if (
                ! await this.console.nc.prompt.bool( {
                    ...promptArgs,
                    message: `Is .releasenotes.md updated?`,
                    default: false,
                } )
            ) {
                process.exit( 0 );
            }
        }
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
                await super.startEndNotice( which, false );
                return this.startPrompters();

            case 'end':
                const maxWidth = this.console.nc.msg.args.msg.maxWidth ?? 120;

                const _endMsg: MessageMaker.BulkMsgs = [
                    [ '✓ ', { flag: false } ],
                    [ 'Released!', { italic: true } ],
                    [ `${ this.pkg.name }@${ version }`, { flag: 'reverse' } ],
                    [ '  🎉 🎉 🎉', { flag: false } ],
                    [ '\n\n', { flag: false } ],
                    [
                        'eventually I will put a link to the github release draft here: ' + 'https://github.com/maddimathon/npm-build-utilities/releases',
                        { bold: false, flag: false, indent: '  ', italic: true, maxWidth }
                    ],
                ];

                this.console.startOrEnd( _endMsg, which, { maxWidth: null } );
                return;
        }

        return super.startEndNotice( which, false );
    }



    /* RUNNING METHODS
     * ====================================================================== */

    protected async runSubStage( subStage: Stage.SubStage.Release ) {
        await this[ subStage ]();
    }

    protected async changelog() {
        this.console.progress( '(NOT IMPLEMENTED) running changelog sub-stage...', 1 );
    }

    protected async commit() {
        this.console.progress( '(NOT IMPLEMENTED) running commit sub-stage...', 1 );
    }

    protected async github() {
        this.console.progress( '(NOT IMPLEMENTED) running github sub-stage...', 1 );
    }

    /**
     * Runs the project's package class.
     */
    protected async package() {
        await this.runStage( 'package', 1 );
    }

    protected async replace() {
        this.console.progress( '(NOT IMPLEMENTED) running replace sub-stage...', 1 );
    }

    protected async tidy() {
        this.console.progress( '(NOT IMPLEMENTED) running tidy sub-stage...', 1 );
    }
}
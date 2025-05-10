#!/usr/bin/env tsx
'use strict';
/**
 * @package @maddimathon/template-npm-library
 * @author Maddi Mathon (www.maddimathon.com)
 * 
 * @license MIT
 */

import type { GlobOptions } from 'glob';

import type * as TU from '../../@types/utilities.js';


import NodeFS from 'node:fs';
import NodePath from 'node:path';

import { DateTime } from 'luxon';

import { globSync } from 'glob';


import {
    newCurrentReplacements,
    newPkgReplacements,
} from '../../vars/replacements.js';

import {
    // Types as TS,
    classes as cls,
    functions as fns,
} from '@maddimathon/utility-typescript';


type CmdArgs = Parameters<cls.node.NodeConsole[ 'cmdArgs' ]>[ 0 ];

type GlobArgs = fns.mergeArgs.Obj & GlobOptions;


export abstract class AbstractStage<
    SubStage extends string | never,
    Args extends AbstractStage.Args<SubStage>,
> extends cls.node.AbstractBuildStage<SubStage, Args> {

    public static get ARGS_ABSTRACT(): AbstractStage.Args<string> {

        return {
            _: [],
            ...cls.node.AbstractBuildStage.abstractArgs( {
                argsRecursive: false,
            } )
        } as AbstractStage.Args<string>;
    }



    /* LOCAL PROPERTIES
     * ====================================================================== */


    /* Meta ------------------ */

    /** 
     * An object of the project’s pacakge.json file.
     */
    #pkg: TU.PackageJson | undefined = undefined;

    /** 
     * An object of the project’s pacakge.json file.
     */
    public get pkg(): TU.PackageJson {

        if ( this.#pkg === undefined ) {
            this.#pkg = JSON.parse(
                this.fns.fs.readFile( 'package.json' )
            ) as TU.PackageJson;
        }

        return this.#pkg;
    }

    /**
     * The package version being prepared.
     */
    public get pkgVersion(): string {

        /** Checks for `-alpha` or `-beta` in the current version. */
        const dashSuffixRegex = /(\-(alpha|beta)(\.\d+)?)(?=(\+[^\s]+)|$)/gi;

        /** Checks for `+...` comments in the current version. */
        const plusSuffixRegex = /(\+[^\s]+)$/gi;

        /** Contents of `+...` comments in the current version. */
        const plusSuffix: string = this.pkg.version.match( plusSuffixRegex )?.[ 0 ] ?? '';

        /** Contents of `-...` version in the current version. */
        const dashSuffix: string = this.pkg.version.match( dashSuffixRegex )?.[ 0 ] ?? '';

        /** Base version, without prelease or comments. */
        let pkgVersion: string = this.pkg.version;

        /** Suffix indicating if this is a draft package/release. */
        let draftSuffix: string = ( this.args.dryrun || !this.args.packaging ) ? '-draft' : '';

        if ( plusSuffix ) {
            pkgVersion = pkgVersion.replace( plusSuffixRegex, '' );
        }

        if ( dashSuffix ) {

            if ( draftSuffix ) {
                draftSuffix = '.draft';
            }

            pkgVersion = pkgVersion.replace( dashSuffixRegex, '' );
        }

        return pkgVersion + dashSuffix + draftSuffix + plusSuffix;
    }

    #releasePath: string | undefined = undefined;

    /**
     * Path to release directory for building a package for the current version.
     */
    public get releasePath(): string {

        if ( this.#releasePath === undefined ) {

            const name = this.pkg.name.replace( /^@([^\/]+)\//, '$1_' );
            const version = this.pkgVersion.replace( /\./gi, '-' );

            this.#releasePath = this.fns.fs.pathRelative( this.fns.fs.pathResolve(
                this.pkg.config.paths.releases,
                `${ name }@${ version }`
            ) );
        }

        return this.#releasePath;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    // constructor (
    //     args: Args,
    //     clr: cls.MessageMaker.Colour = 'black',
    // ) {
    //     super( args, clr );
    // }



    /* LOCAL METHODS
     * ====================================================================== */


    /* MESSAGES ===================================== */

    /**
     * Prints a notice message to the console to signal the start or end of a stage.
     * 
     * @see {@link cls.node.NodeConsole.timestampLog}  Function used to print to console.
     */
    protected startEndNoticeLog(
        which: "start" | "end" | string,
        startMsg: string,
        endMsg: string,
        defaultMsg: string,
        msgArgs: Parameters<typeof this.progressLog>[ 2 ] = {},
        timeArgs: Parameters<typeof this.progressLog>[ 3 ] = {},
    ): void {
        if ( this.args[ 'notice' ] === false ) { return; }

        const depth = ( this.args[ 'log-base-level' ] ?? 0 );

        let linesIn = msgArgs.linesIn ?? 2;
        let linesOut = msgArgs.linesOut ?? 0;

        let msg = defaultMsg;

        if ( which === 'start' ) {
            msg = startMsg;

            if ( depth < 1 ) {
                linesIn += 1;
            }

        } else if ( which === 'end' ) {
            msg = endMsg;
            linesOut += 1;

            if ( depth < 1 ) {
                linesOut += 1;
            }
        }

        msgArgs = {
            bold: true,
            clr: this.clr,
            italic: false,

            linesIn,
            linesOut,

            ...msgArgs,

            depth,
        };

        this.progressLog(
            [ [
                msg,
                { flag: true },
            ] ],
            depth,
            msgArgs,
            timeArgs,
        );
    }


    /* UTILITIES ===================================== */


    /* Building Tools ------------------ */

    protected async compileScss(
        input: string,
        output: string,
        logBaseLevel: number,
        params: CmdArgs = {},
    ): Promise<void> {

        if ( !this.args[ 'css-update' ] ) {
            this.fns.fs.deleteFiles( this.glob( output ) );
        }

        const packaging: boolean | null = this.args.packaging || null;

        const update: boolean = Boolean( (
            this.args[ 'css-update' ]
            || this.args.watchedWatcher
            || this.args.watchedFilename
            || this.args.watchedEvent
        ) && !packaging );

        const args = {
            update: update ? true : null,
            quiet: this.args[ 'sass-quiet' ] ? true : null,
            'no-source-map': packaging ? true : null,
            'embed-sources': packaging ? null : true,
            trace: true,
            ...params,
        };

        this.verboseLog( `compiling ${ input } to ${ output }...`, 0 + logBaseLevel );
        this.fns.nc.cmd( `sass ${ input }:${ output }`, args );

        for ( const o of newCurrentReplacements( this ).concat( newPkgReplacements( this ) ) ) {
            this.replaceInFiles(
                output,
                o.find,
                o.replace,
                1 + logBaseLevel,
            );
        }
    }

    protected async compileTypescript(
        tsconfigPath: string,
        logBaseLevel: number,
        params: CmdArgs = {},
    ): Promise<void> {
        this.verboseLog( `compiling typescript project ${ tsconfigPath }...`, 0 + logBaseLevel );

        const tsconfig: Partial<{
            exclude: string | string[];
            include: string | string[];

            compilerOptions: Partial<{
                baseUrl: string;
                noEmit: boolean;
                outDir: string;
            }>;
        }> = JSON.parse( this.fns.fs.readFile( tsconfigPath ) );

        // deleting current files
        if ( !this.args.watchedEvent && tsconfig.compilerOptions?.noEmit !== true ) {

            const outDir = tsconfig.compilerOptions?.outDir;

            if ( outDir ) {

                const tsconfigDir = tsconfigPath.replace( /\/[^\/]+\.json$/, '/' ).replace( /^[^\/]+\.json$/, './' );
                this.args.debug && this.progressLog( `tsconfigDir = ${ tsconfigDir }`, ( this.args.verbose ? 1 : 0 ) + logBaseLevel );

                const outDirGlobs = this.fns.fs.pathRelative( this.fns.fs.pathResolve( tsconfigDir, outDir.replace( /(\/+\**)?$/, '' ) ) ) + '/**/*';

                this.verboseLog( `deleting current contents (${ outDirGlobs })...`, 1 + logBaseLevel );
                this.fns.fs.deleteFiles( this.glob( outDirGlobs ) );
            }
        }

        const cmdParams: CmdArgs = {
            ...params,
            project: tsconfigPath,
        };

        this.verboseLog( 'running tsc...', 2 + logBaseLevel );
        const tscCmd = `tsc ${ this.fns.nc.cmdArgs( cmdParams, true, false ) }`;

        this.args.debug && this.progressLog( tscCmd, ( this.args.verbose ? 3 : 2 ) + logBaseLevel );
        this.fns.nc.cmd( tscCmd );
    }

    protected replaceInFiles(
        globs: string | string[],
        find: ( string | RegExp ) | ( string | RegExp )[],
        replace: string,
        logBaseLevel: number,
        args: Partial<{ ignoreCase: boolean; }> = {},
    ): void {

        const filesArr: string[] = this.glob( globs, { filesOnly: true } );

        const findArr: ( string | RegExp )[] = Array.isArray( find ) ? find : [ find ];

        this.args.debug && this.progressLog(
            `replacing '${ findArr.join( "'|'" ) }' => '${ replace }'`,
            logBaseLevel,
            {
                linesIn: 0,
                linesOut: 0,
                maxWidth: null,
            },
        );

        for ( const path of filesArr ) {

            const fileContent = this.fns.fs.readFile( path );

            for ( const find of findArr ) {

                const regexp = find instanceof RegExp
                    ? find
                    : new RegExp(
                        fns.escRegExp( find ),
                        `g${ args.ignoreCase ? 'i' : '' }`
                    );

                if ( fileContent.match( regexp ) !== null ) {

                    this.fns.fs.writeFile(
                        path,
                        fileContent.replace(
                            regexp,
                            fns.escRegExpReplace( replace )
                        ),
                        { force: true }
                    );
                }
            }
        }
    }


    /* Files ------------------ */

    /**
     * Copies globbedFiles from one directory to another.
     * 
     * @param _glob         
     * @param _destination  Destination directory.
     * @param _source       Optional. Source directory. Default `'.'`.
     * @param _opts         
     */
    protected copyFiles(
        _glob: string | string[],
        _destination: string,
        _source: string = '.',
        args: Partial<AbstractStage.CopyFilesArgs> = {}
    ): void {
        if ( !Array.isArray( _glob ) ) { _glob = [ _glob ]; }

        // I prefer them as constants
        const [ glob, destination, source ] = [ _glob, _destination, _source ];

        const fullArgs = this.mergeArgs(
            {
                ignoreGlobs: [],
                includeDefaultIgnoreGlobs: false,
            } as AbstractStage.CopyFilesArgs,
            args
        ) as AbstractStage.CopyFilesArgs;

        /** 
         * Resolved versions of the directory paths with trailing slashes.
         */
        const resolved = {
            destination: this.fns.fs.pathResolve( destination ).replace( /\/*$/gi, '/' ),
            source: this.fns.fs.pathResolve( source ).replace( /\/*$/gi, '/' ),
        };

        const ignoreGlobs: string[] = fullArgs.includeDefaultIgnoreGlobs ? [
            ...fullArgs.ignoreGlobs,
        ] : fullArgs.ignoreGlobs;
        ignoreGlobs.push( '**/._*' );

        // Uses NodePath because the resolved paths have already gone through this.fns.fs.pathResolve()
        const globbedFiles: string[] = this.glob(
            glob.map( g => NodePath.resolve( resolved.source, g ) ),
            {
                ignore: ignoreGlobs.map( g => NodePath.resolve( resolved.source, g ) ),
            }
        );

        /**
         * Write the files.
         */
        for ( const file of globbedFiles ) {

            const destFile = file
                .replace(
                    new RegExp( '^' + fns.escRegExp( resolved.source ), 'gi' ),
                    fns.escRegExpReplace( resolved.destination )
                )
                .replace( /\/+$/gi, '' );

            const destDirectory = NodePath.dirname( destFile );

            const stats = NodeFS.statSync( file );

            if ( stats.isDirectory() ) {

                NodeFS.mkdirSync( destDirectory, { recursive: true } );
                this.copyFiles( '*', destFile, file, { ignoreGlobs } );

            } else {
                NodeFS.mkdirSync( destDirectory, { recursive: true } );
                NodeFS.copyFileSync( file, destFile );
            }
        }
    }

    /**
     * Alias for `globSync()`.
     * 
     * @param relative  Whether relative paths should be returned.
     */
    public glob(
        globs: string | string[],
        args: GlobArgs & { filesOnly?: boolean; } = {},
        relative: boolean = false,
    ): string[] {
        const DEFAULT_GlobOptions: GlobArgs = {
            absolute: true,
            dot: true,
            ignore: [
                '**/._*',
                '**/._*/**/*',
                '**/.DS_STORE',
                '**/.smbdelete*',
                '**/.smbdelete*/**/*',
            ],
            realpath: true,
        };

        const globResult = globSync( globs, this.mergeArgs(
            DEFAULT_GlobOptions,
            args,
            false
        ) as GlobArgs ) as string | string[];

        let filepaths: string[] = (
            Array.isArray( globResult )
                ? globResult
                : [ globResult ]
        ).sort();

        if ( args.filesOnly ) {

            filepaths = filepaths.filter(
                path => NodeFS.lstatSync( this.fns.fs.pathResolve( path ) ).isFile()
            );
        }

        return relative ? filepaths.map(
            ( path ) => this.fns.fs.pathRelative( path )
        ) : filepaths;
    }


    /* Formatters ------------------ */

    /**
     * A predictably-formatted datestamp.
     * 
     * @param date    Optional. Default is a new Date object.
     * @param format  Optional. Default `'yyyy-MM-dd'`.
     * 
     * @return
     */
    public datestamp(
        date: Date | null = null,
        format: string | null = null,
    ): string {
        return DateTime.fromJSDate( date ?? new Date() ).toFormat( format ?? 'yyyy-MM-dd' );
    }

    /**
     * A predictably-formatted datetimestamp.
     * 
     * @param date    Optional. Default is a new Date object.
     * @param format  Optional. Default `'yyyy-MM-dd hh:mm'`.
     * 
     * @return
     */
    public datetimestamp(
        date: Date | null = null,
        format: string | null = null,
    ): string {
        return DateTime.fromJSDate( date ?? new Date() ).toFormat( format ?? 'yyyy-MM-dd hh:mm' );
    }

    /**
     * A predictably-formatted timestamp.
     * 
     * @param date    Optional. Default is a new Date object.
     * @param format  Optional. Default `'hh:mm'`.
     * 
     * @return
     */
    public timestamp(
        date: Date | null = null,
        format: string | null = null,
    ): string {
        return DateTime.fromJSDate( date ?? new Date() ).toFormat( format ?? 'hh:mm' );
    }
}

export namespace AbstractStage {

    export type Args<
        SubStage extends string | never,
    > = cls.node.AbstractBuildStage.Args<SubStage> & {

        _: string[];

        /**
         * Passes --update param to sass when compiling; only compiles updates.
         */
        'css-update'?: boolean;

        /**
         * Passes --quiet param to sass when compiling; quiets output.
         */
        'sass-quiet'?: boolean;
    };

    /**
     * Optional configuration for {@link AbstractStage.copyFiles}.
     */
    export type CopyFilesArgs = {

        /** 
         * Default paths to ignore when dealing with files. Relative to root or
         * absolute.
         */
        ignoreGlobs: string[],

        /** 
         * Whether to include the default ignoreGlobs with the input ignore
         * paths.
         */
        includeDefaultIgnoreGlobs: boolean,
    };
}
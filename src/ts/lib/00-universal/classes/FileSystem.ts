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

import { globSync } from 'glob';

import {
    escRegExp,
    mergeArgs,
} from '@maddimathon/utility-typescript/functions';

import { node } from '@maddimathon/utility-typescript/classes';

import type {
    Logger,
} from '../../../types/index.js';

import {
    type FileSystemType,
} from '../../@internal.js';

/**
 * Extends the {@link node.NodeFiles} class with some custom logic useful to this package.
 * 
 * @category Utilities
 * 
 * @since ___PKG_VERSION___
 */
export class FileSystem extends node.NodeFiles {



    /* LOCAL PROPERTIES
     * ====================================================================== */


    /* Args ===================================== */

    /**
     * A completed args object.
     * 
     * @category Args
     */
    public override readonly args: FileSystem.Args;

    /**
     * Default args for this class.
     * 
     * @category Args
     */
    public override get ARGS_DEFAULT() {

        const copy = {
            glob: {},
        } as const satisfies FileSystemType.Copy.Args;

        const glob = {
            absolute: true,
            dot: true,
            ignore: [
                '**/._*',
                '**/._**/*',
                '**/.DS_Store',
                '**/.smbdelete**',
            ],
        } as const satisfies FileSystemType.Glob.Args;

        return {
            ...node.NodeFiles.prototype.ARGS_DEFAULT,

            copy,
            glob,
        } as const satisfies FileSystem.Args;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @param console   Used to output messages within the class.
     * @param args  
     */
    public constructor (
        public readonly console: Logger,
        args: Partial<FileSystem.Args> = {},
    ) {
        super( args, {
            nc: console.nc,
        } );

        this.args = (
            // @ts-expect-error - it is initialized in the super constructor
            this.args
        ) ?? this.buildArgs( args );
    }



    /* METHODS
     * ====================================================================== */

    /** {@inheritDoc FileSystemType.copy} */
    public copy(
        globs: string | string[],
        level: number,
        outputDir: string,
        sourceDir: string | null = null,
        opts: Partial<FileSystemType.Copy.Args> = {},
    ): false | string[] {

        outputDir = './' + outputDir.replace( /(^\.\/|\/$)/g, '' ) + '/';

        if ( sourceDir ) {
            sourceDir = './' + sourceDir.replace( /(^\.\/|\/$)/g, '' ) + '/';
        }

        // this.console.vi.progress( { globs }, level );
        // this.console.vi.progress( { outputDir }, level );
        // this.console.vi.progress( { sourceDir }, level );

        if ( !Array.isArray( globs ) ) {
            globs = [ globs ];
        }

        const copyPaths = this.glob(
            sourceDir ? globs.map( glob => this.pathResolve( sourceDir, glob ) ) : globs,
            opts.glob,
        );

        const sourceDirRegex = sourceDir && new RegExp( '^' + escRegExp( this.pathRelative( sourceDir ) + '/' ), 'gi' );
        // this.console.vi.log( { sourceDirRegex }, level );

        for ( const source of copyPaths ) {

            const source_relative = this.pathRelative( source );

            const destination = this.pathResolve(
                outputDir,
                sourceDirRegex ? source_relative.replace( sourceDirRegex, '' ) : source_relative,
            );

            this.console.verbose(
                `(TESTING) ${ source_relative } → ${ this.pathRelative( destination ) }`,
                level,
                { linesIn: 0, linesOut: 0, maxWidth: null }
            );
        }

        return [];
    }

    /** {@inheritDoc FileSystemType.glob} */
    public glob(
        globs: string | string[],
        opts: FileSystemType.Glob.Args = {},
    ): string[] {

        opts = mergeArgs( this.args.glob, opts, false );

        const globResult = globSync( globs, opts )
            .map( res => typeof res === 'object' ? res.fullpath() : res );

        return globResult;
    }
}

/**
 * Used only for {@link FileSystem}.
 * 
 * @category Utilities
 * 
 * @since ___PKG_VERSION___
 */
export namespace FileSystem {

    /**
     * Optional configuration for {@link FileSystem} class.
     * 
     * @since ___PKG_VERSION___
     */
    export interface Args extends node.NodeFiles.Args {

        /**
         * Defaults for the {@link FileSystem.copy} method.
         */
        copy: Partial<FileSystemType.Copy.Args>;

        /**
         * Defaults for the {@link FileSystem.glob} method.
         */
        glob: FileSystemType.Glob.Args;
    };

    /**
     * Optional class instances to pass to {@link FileSystem} constructor.
     * 
     * @since ___PKG_VERSION___
     */
    export interface Utils extends Omit<NonNullable<ConstructorParameters<typeof node.NodeFiles>[ 1 ]>, "nc"> {
    };
}
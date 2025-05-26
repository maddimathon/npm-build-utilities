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
    escRegExpReplace,
    mergeArgs,
} from '@maddimathon/utility-typescript/functions';

import { node } from '@maddimathon/utility-typescript/classes';

import type {
    Stage,
} from '../../../types/index.js';

import type { FileSystemType } from '../../../types/FileSystemType.js';
import type { LocalError } from '../../../types/LocalError.js';
import type { Logger } from '../../../types/Logger.js';

import {
    AbstractError,
} from '../../@internal/index.js';

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

            force: true,
            recursive: true,
            rename: true,

            glob: {
                absolute: false,
                dot: true,
            },

        } as const satisfies FileSystemType.Copy.Args;

        const glob = {
            absolute: true,
            dot: true,
            ignore: [
                ...FileSystem.globs.SYSTEM,
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

        this.copy = this.copy.bind( this );
        this.delete = this.delete.bind( this );
        this.glob = this.glob.bind( this );
    }



    /* METHODS
     * ====================================================================== */

    /** 
     * {@inheritDoc internal.FileSystemType.copy}
     * 
     * @throws {@link FileSystem.Error}
     */
    public copy(
        globs: string | string[],
        level: number,
        outputDir: string,
        sourceDir: string | null = null,
        args: Partial<FileSystemType.Copy.Args> = {},
    ): false | string[] {
        args = mergeArgs( this.args.copy, args, true );

        outputDir = './' + outputDir.replace( /(^\.\/|\/$)/g, '' ) + '/';

        if ( sourceDir ) {
            sourceDir = './' + sourceDir.replace( /(^\.\/|\/$)/g, '' ) + '/';
        }

        if ( !Array.isArray( globs ) ) {
            globs = [ globs ];
        }

        const copyPaths = this.glob(
            sourceDir ? globs.map( glob => this.pathResolve( sourceDir, glob ) ) : globs,
            args.glob,
        );

        const sourceDirRegex = sourceDir && new RegExp( '^' + escRegExp( this.pathRelative( sourceDir ) + '/' ), 'gi' );

        const output: string[] = [];

        for ( const source of copyPaths ) {

            const source_relative = this.pathRelative( source );

            const destination = this.pathResolve(
                outputDir,
                sourceDirRegex ? source_relative.replace( sourceDirRegex, '' ) : source_relative,
            );

            this.console.debug(
                `(TESTING) ${ source_relative } → ${ this.pathRelative( destination ) }`,
                level,
                { linesIn: 0, linesOut: 0, maxWidth: null }
            );

            const t_output = this.copyFile( source, destination, args );

            // throws
            if ( !t_output ) {

                throw new FileSystem.Error(
                    [
                        'this.copyFile returned falsey',
                        'source = ' + source,
                        'destination = ' + this.pathRelative( destination ),
                    ].join( '\n' ),
                    {
                        class: 'FileSystem',
                        method: 'copy',
                    },
                );
            }

            output.push( t_output );
        }

        return output;
    }

    /** {@inheritDoc internal.FileSystemType.delete} */
    public override delete(
        globs: string | string[],
        level: number,
        dryRun?: boolean,
        args: FileSystemType.Glob.Args = {},
    ) {
        try {
            return super.delete( this.glob( globs, args ), level, dryRun );
        } catch ( error ) {

            if (
                error
                && typeof error === 'object'
                && 'message' in error
                && String( error.message )?.match( /^\s*ENOTEMPTY\b/g )
            ) {
            } else {
                throw error;
            }
        }
    }

    /** {@inheritDoc internal.FileSystemType.glob} */
    public glob(
        globs: string | string[],
        args: FileSystemType.Glob.Args = {},
    ): string[] {

        args = mergeArgs( this.args.glob, args, false );

        const globResult = globSync( globs, args )
            .map( res => typeof res === 'object' ? res.fullpath() : res );

        return globResult.filter( path => !path.match( /(^|\/)\._/g ) );
    }

    /** {@inheritDoc internal.FileSystemType.minify} */
    public minify(
        globs: string | string[],
        format: "css" | "html" | "js" | "scss" | "ts",
        level: number,
        args?: FileSystemType.Glob.Args,
        renamer?: ( ( path: string ) => string ),
    ): {
        source: string;
        output: string;
    }[] {
        this.console.log( '(NOT IMPLEMENTED) FileSystem.minify()', level );
        this.console.vi.log( { globs }, 1 + level );
        this.console.vi.log( { format }, 1 + level );
        this.console.vi.log( { args }, 1 + level );
        this.console.vi.log( { renamer }, 1 + level );

        return [];
    }

    /** {@inheritDoc internal.FileSystemType.prettier} */
    public prettier(
        globs: string | string[],
        format: "css" | "html" | "js" | "scss" | "ts",
        level: number,
        args?: FileSystemType.Glob.Args,
    ): string[] {
        this.console.log( '(NOT IMPLEMENTED) FileSystem.prettier()', level );
        this.console.vi.log( { globs }, 1 + level );
        this.console.vi.log( { format }, 1 + level );
        this.console.vi.log( { args }, 1 + level );

        return [];
    }

    /** {@inheritDoc internal.FileSystemType.replaceInFiles} */
    public replaceInFiles(
        globs: string | string[],
        replace: [ string | RegExp, string ] | [ string | RegExp, string ][],
        level: number,
        args?: FileSystemType.Glob.Args,
    ): string[] {
        // returns
        if ( !replace.length ) {
            this.console.verbose( 'FileSystem.replaceInFiles() - no replacements passed', level );
            this.console.vi.debug( { replace }, ( this.console.params.verbose ? 1 : 0 ) + level );
            return [];
        }

        const replaced: string[] = [];

        const replacements = (
            Array.isArray( replace[ 0 ] )
                ? replace as [ string | RegExp, string ][]
                : [ replace as [ string | RegExp, string ] ]
        ).filter( ( [ find, repl ] ) => find && typeof repl !== 'undefined' );

        // returns
        if ( !replacements.length ) {
            this.console.verbose( 'FileSystem.replaceInFiles() - no valid replacement args passed', level );
            this.console.vi.debug( { replace }, ( this.console.params.verbose ? 1 : 0 ) + level );
            this.console.vi.debug( { replacements }, ( this.console.params.verbose ? 1 : 0 ) + level );
            return [];
        }

        const files = this.glob( globs, args ).filter( ( path ) => {
            const _stats = this.getStats( path );

            // returns
            if ( !_stats || !_stats.isFile() || _stats.isSymbolicLink() ) {
                return false;
            }

            return true;
        } );

        // returns
        if ( !files.length ) {
            this.console.verbose( 'FileSystem.replaceInFiles() - no files matched by globs', level );
            this.console.vi.debug( { globs }, ( this.console.params.verbose ? 1 : 0 ) + level );
            return [];
        }

        if ( this.console.params.debug && this.console.params.verbose ) {

            const _level = ( this.console.params.verbose ? 1 : 0 ) + level;

            let i = 1;
            for ( const [ find, repl ] of replacements ) {
                this.console.verbose( 'set of replacements #' + i, _level );
                this.console.vi.verbose( { find }, 1 + _level );
                this.console.vi.verbose( { repl }, 1 + _level );
                i++;
            }
        }

        for ( const path of files ) {

            let _content = this.readFile( path );
            let _write = false;

            // continues
            if ( !_content ) {
                continue;
            }

            // this.console.verbose( 'rewriting ' + this.pathRelative( path ), 1 + level );

            // const _level = ( this.console.params.verbose ? 1 : 0 ) + level;

            // let i = 1;
            for ( const [ find, repl ] of replacements ) {

                const _regex = find instanceof RegExp
                    ? find
                    : new RegExp( escRegExp( find ), 'g' );

                if ( !!_content.match( _regex ) ) {

                    // this.console.verbose(
                    //     'replacements # ' + i + ' — ' + this.console.vi.stringify( { find }, { includePrefix: false } ) + ' → ' + this.console.vi.stringify( { repl }, { includePrefix: false } ),
                    //     1 + _level,
                    //     { joiner: '\n', maxWidth: null },
                    // );

                    _content = _content.replace( _regex, escRegExpReplace( String( repl ) ) );
                    _write = true;
                }
                // i++;
            }

            if ( _write ) {

                this.write(
                    path,
                    _content,
                    { force: true, rename: false },
                );
            }
        }

        return replaced;
    }
}

/**
 * Used only for {@link FileSystem}.
 * 
 * @category Class-Helpers
 * 
 * @since ___PKG_VERSION___
 */
export namespace FileSystem {

    /**
     * Arrays of utility globs used within the library.
     */
    export namespace globs {

        /** 
         * 
         */
        export const IGNORE_COPIED = ( stage: Stage.Class ) => [
            `${ stage.config.paths.release.replace( /\/$/g, '' ) }/**`,
            `${ stage.config.paths.snapshot.replace( /\/$/g, '' ) }/**`,
        ];

        /** 
         * Files to ignore 
         */
        export const IGNORE_COMPILED = [
            `./docs/**`,
            `./dist/**`,
        ];

        /** 
         * Files that we probably want to ignore within an npm project.
         */
        export const IGNORE_PROJECT = [

            '.git/**',
            '**/.git/**',

            '.scripts/**',
            '**/.scripts/**',

            '.vscode/**/*.code-snippets',
            '.vscode/**/settings.json',

            'node_modules/**',
            '**/node_modules/**',
        ];

        /** 
         * System files that we *never, ever* want to include.
         */
        export const SYSTEM = [
            '._*',
            '._*/**',
            '**/._*',
            '**/._*/**',
            '**/.DS_Store',
            '**/.smbdelete**',
        ];

    };

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
     * An extension of the utilities error used by the {@link FileSystem} class.
     * 
     * @category Errors
     * 
     * @since ___PKG_VERSION___
     */
    export class Error extends AbstractError<Error.Args> {



        /* LOCAL PROPERTIES
         * ================================================================== */

        // public readonly code: Error.Code;


        /* Args ===================================== */

        public override readonly name: string = 'FileSystem Error';

        public get ARGS_DEFAULT() {

            return {
                ...AbstractError.prototype.ARGS_DEFAULT,
            } as const satisfies Error.Args;
        }



        /* CONSTRUCTOR
         * ================================================================== */

        // public constructor (
        //     message: string,
        //     // code: Error.Code,
        //     context: null | AbstractError.Context,
        //     args?: Partial<Error.Args> & { cause?: LocalError.Input; },
        // ) {
        //     super( message, context, args );
        //     // this.code = code;
        // }



        /* LOCAL METHODS
         * ================================================================== */
    }

    /**
     * Used only for {@link FileSystem.Error}.
     * 
     * @category Errors
     * 
     * @since ___PKG_VERSION___
     */
    export namespace Error {

        /**
         * All allowed error code strings.
         */
        export type Code =
            // | typeof INVALID_INPUT
            | never;

        // /**
        //  * Error code for
        //  */
        // export const INVALID_INPUT = '4';

        /**
         * Optional configuration for {@link Error} class.
         * 
         * @since ___PKG_VERSION___
         */
        export interface Args extends LocalError.Args {
        };
    };

    /**
     * Optional class instances to pass to {@link FileSystem} constructor.
     * 
     * @since ___PKG_VERSION___
     */
    export interface Utils extends Omit<NonNullable<ConstructorParameters<typeof node.NodeFiles>[ 1 ]>, "nc"> {
    };
}
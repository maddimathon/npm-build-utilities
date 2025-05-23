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

import { node } from '@maddimathon/utility-typescript/classes';

import type {
    Stage,
} from '../../../types/index.js';

import {
    FileSystemType,
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

        return {
            ...node.NodeFiles.prototype.ARGS_DEFAULT,
        } as const satisfies FileSystem.Args;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @param console   Used to output messages within the class.
     * @param args  
     */
    public constructor (
        public readonly console: Stage.Console,
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

    /**
     * Copies files from one directory to another, maintaing their relative
     * directory structure.
     */
    public copy(
        globs: string | string[],
        opts: FileSystemType.Glob.Args,
    ): string | string[] {
        this.console.progress( `(NOT IMPLEMENTED) FileSystem.copy()`, 1 );

        return [];
    }

    /**
     * Gets the valid paths matched against the input globs.
     */
    public glob(
        input: string | string[],
        opts: FileSystemType.Glob.Args,
    ): string | string[] {
        this.console.progress( `(NOT IMPLEMENTED) FileSystem.glob()`, 1 );

        return [];
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
    export interface Args extends node.NodeFiles.Args { };

    /**
     * Optional class instances to pass to {@link FileSystem} constructor.
     * 
     * @since ___PKG_VERSION___
     */
    export interface Utils extends Omit<NonNullable<ConstructorParameters<typeof node.NodeFiles>[ 1 ]>, "nc"> {
    };
}
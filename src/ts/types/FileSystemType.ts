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

import { GlobOptions } from 'glob';

import {
    node,
} from '@maddimathon/utility-typescript/classes';

/**
 * Shape of the file/path utility class.
 *
 * Defined here so that the type can easily be used before the
 * {@link FileSystem} class is defined.
 *
 * @category Types
 *
 * @internal
 */
export interface FileSystemType extends node.NodeFiles {

    /**
     * Copies files from one directory to another, maintaing their relative
     * directory structure.
     */
    copy(
        globs: string | string[],
        level: number,
        outputDir: string,
        sourceDir?: string | null,
        args?: Partial<FileSystemType.Copy.Args>,
    ): false | string[];

    /**
     * Deletes given globs.
     * 
     * @param globs   Paths to delete.
     * @param level   Depth level for this message (above the value of 
     *                {@link CLI.Params.log-base-level}).
     * @param dryRun  If true, files that would be deleted are printed to the 
     *                console and not deleted.
     * @param args    Optional glob configuration.
     */
    delete(
        globs: string | string[],
        level: number,
        dryRun?: boolean,
        args?: FileSystemType.Glob.Args,
    ): ReturnType<node.NodeFiles[ 'delete' ]>;

    /**
     * Gets the valid paths matched against the input globs.
     */
    glob(
        input: string | string[],
        args?: FileSystemType.Glob.Args,
    ): string[];

    /**
     * Runs minify on the given file globs.
     */
    minify(
        globs: string | string[],
        format: "css" | "html" | "js" | "scss" | "ts",
        level: number,
        args?: FileSystemType.Glob.Args,
        renamer?: ( ( path: string ) => string ),
    ): {
        source: string;
        output: string;
    }[];

    /**
     * Runs prettier on the given file globs.
     */
    prettier(
        globs: string | string[],
        format: "css" | "html" | "js" | "scss" | "ts",
        level: number,
        args?: FileSystemType.Glob.Args,
    ): string[];

    /**
     * Replaces the given text or regex in the given file globs.
     */
    replaceInFiles(
        globs: string | string[],
        replace: [ string | RegExp, string ] | [ string | RegExp, string ][],
        level: number,
        args?: FileSystemType.Glob.Args,
    ): string[];
}

/**
 * Types for the {@link FileSystemType} interface.
 * 
 * @category Types
 * 
 * @internal
 */
export namespace FileSystemType {

    /**
     * Types for {@link FileSystem.copy} method.
     * 
     * @since ___PKG_VERSION___
     */
    export namespace Copy {

        /**
         * Optional configuration for {@link FileSystem.copy} method.
         * 
         * @since ___PKG_VERSION___
         */
        export interface Args extends node.NodeFiles.CopyFileArgs {
            glob: Glob.Args;
        };
    };

    /**
     * Types for {@link FileSystem.glob} method.
     * 
     * @since ___PKG_VERSION___
     */
    export namespace Glob {

        /**
         * Optional configuration for {@link FileSystem.glob} method.
         * 
         * @since ___PKG_VERSION___
         * 
         * @interface
         */
        export type Args = GlobOptions & Partial<{
        }>;
    };
}
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

import { GlobOptions } from 'glob';

import {
    node,
} from '@maddimathon/utility-typescript/classes';

export interface FileSystemType extends node.NodeFiles {

    /**
     * Copies files from one directory to another, maintaing their relative
     * directory structure.
     */
    copy(
        globs: string | string[],
        opts: FileSystemType.Glob.Args,
    ): string | string[];

    /**
     * Gets the valid paths matched against the input globs.
     */
    glob(
        input: string | string[],
        opts: FileSystemType.Glob.Args,
    ): string | string[];
}

export namespace FileSystemType {

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
         */
        export type Args = GlobOptions & {
        };
    };
}
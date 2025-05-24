/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-draft
 * @license MIT
 */
import { GlobOptions } from 'glob';
import { node } from '@maddimathon/utility-typescript/classes';
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
    copy(globs: string | string[], opts: FileSystemType.Glob.Args): string | string[];
    /**
     * Gets the valid paths matched against the input globs.
     */
    glob(input: string | string[], opts: FileSystemType.Glob.Args): string | string[];
}
/**
 * Types for the {@link FileSystemType} interface.
 *
 * @category Types
 *
 * @internal
 */
export declare namespace FileSystemType {
    /**
     * Types for {@link FileSystem.glob} method.
     *
     * @since 0.1.0-draft
     */
    namespace Glob {
        /**
         * Optional configuration for {@link FileSystem.glob} method.
         *
         * @since 0.1.0-draft
         */
        type Args = GlobOptions & {};
    }
}
//# sourceMappingURL=FileSystemType.d.ts.map
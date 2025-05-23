/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/npm-build-utilities@0.1.0-draft
 * @license MIT
 */
import { GlobOptions } from 'glob';
import { node } from '@maddimathon/utility-typescript/classes';
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
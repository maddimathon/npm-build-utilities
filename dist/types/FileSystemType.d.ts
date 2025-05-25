/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-alpha.draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
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
    copy(globs: string | string[], level: number, outputDir: string, sourceDir?: string | null, args?: Partial<FileSystemType.Copy.Args>): false | string[];
    /**
     * Deletes given globs.
     *
     * @category Filers
     *
     * @param paths   Paths to delete. Absolute or relative to root dir.
     * @param level   Depth level for this message (above the value of
     *                {@link CLI.Params.log-base-level}).
     * @param dryRun  If true, files that would be deleted are printed to the
     *                console and not deleted.
     */
    delete(globs: string | string[], level: number, dryRun?: boolean, args?: FileSystemType.Glob.Args): ReturnType<node.NodeFiles['delete']>;
    /**
     * Gets the valid paths matched against the input globs.
     */
    glob(input: string | string[], args?: FileSystemType.Glob.Args): string[];
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
     * Types for {@link FileSystem.copy} method.
     *
     * @since 0.1.0-alpha.draft
     */
    namespace Copy {
        /**
         * Optional configuration for {@link FileSystem.copy} method.
         *
         * @since 0.1.0-alpha.draft
         */
        interface Args extends node.NodeFiles.CopyFileArgs {
            glob: Glob.Args;
        }
    }
    /**
     * Types for {@link FileSystem.glob} method.
     *
     * @since 0.1.0-alpha.draft
     */
    namespace Glob {
        /**
         * Optional configuration for {@link FileSystem.glob} method.
         *
         * @since 0.1.0-alpha.draft
         *
         * @interface
         */
        type Args = GlobOptions & Partial<{}>;
    }
}
//# sourceMappingURL=FileSystemType.d.ts.map
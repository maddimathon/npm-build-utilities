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
import type { GlobOptions } from 'glob';
import type * as prettier from "prettier";
import type { node } from '@maddimathon/utility-typescript/classes';
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
     * @param globs   Paths to delete.
     * @param level   Depth level for this message (above the value of
     *                {@link CLI.Params.log-base-level}).
     * @param dryRun  If true, files that would be deleted are printed to the
     *                console and not deleted.
     * @param args    Optional glob configuration.
     */
    delete(globs: string | string[], level: number, dryRun?: boolean, args?: FileSystemType.Glob.Args): ReturnType<node.NodeFiles['delete']>;
    /**
     * Gets the valid paths matched against the input globs.
     */
    glob(input: string | string[], args?: FileSystemType.Glob.Args): string[];
    /**
     * Runs minify on the given file globs.
     */
    minify(globs: string | string[], format: FileSystemType.Minify.Format, level: number, args?: Partial<FileSystemType.Minify.Args>, renamer?: (path: string) => string): Promise<{
        source: string;
        output: string;
    }[]>;
    /**
     * Runs prettier on the given file globs.
     */
    prettier(globs: string | string[], format: FileSystemType.Prettier.Format, args?: FileSystemType.Prettier.Args): Promise<string[]>;
    /**
     * Replaces the given text or regex in the given file globs.
     */
    replaceInFiles(globs: string | string[], replace: [string | RegExp, string] | [string | RegExp, string][], level: number, args?: FileSystemType.Glob.Args): string[];
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
     * Optional configuration for {@link FileSystemType} classes.
     *
     * @since 0.1.0-alpha.draft
     */
    interface Args extends node.NodeFiles.Args {
        /**
         * Defaults for the {@link FileSystemType.copy} method.
         */
        copy: Partial<Copy.Args>;
        /**
         * Defaults for the {@link FileSystemType.glob} method.
         */
        glob: Glob.Args;
        /**
         * Defaults for the {@link FileSystemType.minify} method.
         */
        minify: Partial<Minify.Args> | ((format: Minify.Format) => Partial<Minify.Args>);
        /**
         * Defaults for the {@link FileSystemType.prettier} method.
         */
        prettier: Partial<Prettier.Args> | ((format: Prettier.Format) => Partial<Prettier.Args>);
    }
    /**
     * Types for {@link FileSystem.copy} method.
     *
     * @since 0.1.0-alpha.draft
     */
    namespace Copy {
        /**
         * Optional configuration for {@link FileSystemType.copy} method.
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
    /**
     * Types for {@link FileSystem.minify} method.
     *
     * @since 0.1.0-alpha.draft
     */
    namespace Minify {
        /**
         * Optional configuration for {@link FileSystem.minify} method.
         *
         * @since 0.1.0-alpha.draft
         *
         * @interface
         */
        interface Args {
            css: {
                type?: string;
                'clean-css'?: {
                    [key: string]: boolean | string | null | undefined;
                };
            };
            html: {
                [key: string]: boolean | string | null | undefined;
            };
            js: {
                type?: string;
                putout?: {
                    [key: string]: boolean | string | null | undefined;
                };
                terser?: {
                    [key: string]: boolean | string | null | undefined;
                };
                esbuild?: {
                    [key: string]: boolean | string | null | undefined;
                };
            };
            glob: Glob.Args;
        }
        /**
         * File type options for minify.
         */
        type Format = "css" | "html" | "js" | "json";
    }
    /**
     * Types for {@link FileSystem.prettier} method.
     *
     * @since 0.1.0-alpha.draft
     */
    namespace Prettier {
        /**
         * Optional configuration for {@link FileSystem.prettier} method.
         *
         * @since 0.1.0-alpha.draft
         *
         * @interface
         */
        interface Args extends prettier.Options {
            glob: Glob.Args;
        }
        /**
         * File type options for prettier.
         */
        type Format = "css" | "html" | "js" | "json" | "md" | "mdx" | "scss" | "ts" | "yaml";
    }
}
//# sourceMappingURL=FileSystemType.d.ts.map
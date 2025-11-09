/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.8
 * @license MIT
 */
import type { GlobOptions } from 'glob';
import type * as prettier from "prettier";
import type { node } from '@maddimathon/utility-typescript/classes';
import type { Logger } from './Logger.js';
/**
 * Shape of the file/path utility class.
 *
 * Defined here so that the type can easily be used before the
 * {@link FileSystem} class is defined.
 *
 * @category Types
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export interface FileSystemType extends node.NodeFiles {
    /**
     * Used to output messages within the class.
     *
     * @category Classes
     */
    readonly console: Logger;
    /**
     * Copies files from one directory to another, maintaing their relative
     * directory structure.
     *
     * @category Filers
     *
     * @see {@link node.NodeFiles.copyFile}  Used to copy the matched paths.
     *
     * @param globs      Glob patterns for paths to copy.
     * @param level      Depth level for output to the console.
     * @param outputDir  Path to directory where matched files will be copied.
     * @param sourceDir  Relative source directory. If any, the globs are
     *                   resolved as relative to that directory and the path/dir
     *                   structure copied to the outputDir is relative to this
     *                   sourceDir.
     * @param args       Overrides for default options.
     *
     * @return  Array of paths to the newly-copied files/etc.
     */
    copy(globs: string | string[], level: number, outputDir: string, sourceDir?: string | null, args?: Partial<FileSystemType.Copy.Args>): string[];
    /**
     * Deletes given globs (via {@link node.NodeFiles}.delete).
     *
     * @category Filers
     *
     * @param globs   Glob patterns for paths to delete.
     * @param level   Depth level for output to the console.
     * @param dryRun  If true, files that would be deleted are printed to the
     *                console and not deleted.
     * @param args    Optional glob configuration.
     */
    delete(globs: string | string[], level: number, dryRun?: boolean, args?: Partial<FileSystemType.Glob.Args>): ReturnType<node.NodeFiles['delete']>;
    /**
     * Gets the valid paths matched against the input globs.
     *
     * @category Path-makers
     *
     * @param globs  Glob patterns to match.
     * @param args   Optional glob configuration.
     *
     * @return  Matched paths.
     */
    glob(globs: string | string[], args?: Partial<FileSystemType.Glob.Args>): string[];
    /**
     * Runs minify on the given file globs.
     *
     * @category Transformers
     *
     * @param globs    Glob patterns for paths to minify.
     * @param format   File format for the input globs.
     * @param level    Depth level for output to the console.
     * @param args     Overrides for default options.
     * @param renamer  Function used to define the new basename for the minified
     *                 files, if any.
     *
     * @return  Paths to the minified files (both source and output).
     */
    minify(globs: string | string[], format: FileSystemType.Minify.Format, level: number, args?: Partial<FileSystemType.Minify.Args>, renamer?: (path: string) => string): Promise<{
        source: string;
        output: string;
    }[]>;
    /**
     * Runs prettier on the given file globs.
     *
     * @category Transformers
     *
     * @param globs   Glob patterns for paths to run through prettier.
     * @param format  File format for the input globs.
     * @param args    Overrides for default options.
     *
     * @return  Paths to the formatted files.
     */
    prettier(globs: string | string[], format: FileSystemType.Prettier.Format, args?: Partial<FileSystemType.Prettier.Args>): Promise<string[]>;
    /**
     * Replaces the given text or regex in the given file globs.
     *
     * @category Transformers
     *
     * @param globs    Glob patterns for paths to replace in.
     * @param replace  Replacements to make. The first tuple item is a string
     *                 or RegExp to find and the second item is a string to
     *                 replace.
     * @param level    Depth level for output to the console.
     * @param args     Optional glob configuration.
     *
     * @return  Paths to the replaced files.
     */
    replaceInFiles(globs: string | string[], replace: [string | RegExp, string] | [string | RegExp, string][], level: number, args?: Partial<FileSystemType.Glob.Args>): string[];
}
/**
 * Types for the {@link FileSystemType} interface.
 *
 * @category Types
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export declare namespace FileSystemType {
    /**
     * Optional configuration for {@link FileSystemType} classes.
     *
     * @since 0.1.0-alpha
     */
    interface Args extends node.NodeFiles.Args {
        /**
         * Defaults for the {@link FileSystemType.copy} method.
         */
        copy: Partial<Copy.Args>;
        /**
         * Defaults for the {@link FileSystemType.glob} method.
         */
        glob: Partial<Glob.Args>;
        /**
         * Defaults for the {@link FileSystemType.minify} method.
         */
        minify: Partial<Minify.Args> | (<F extends Minify.Format>(format: F) => Partial<Minify.Args[F] & Minify.Args['glob']>);
        /**
         * Defaults for the {@link FileSystemType.prettier} method.
         */
        prettier: Partial<Prettier.Args> | ((format: Prettier.Format) => Partial<Prettier.Args>)
        /** Test comment */
         | Prettier.Args.MultiFormat;
    }
    /**
     * Types for {@link FileSystemType.copy} method.
     *
     * @since 0.1.0-alpha
     */
    namespace Copy {
        /**
         * Optional configuration for {@link FileSystemType.copy} method.
         *
         * @since 0.1.0-alpha
         */
        interface Args extends node.NodeFiles.CopyFileArgs {
            /**
             * Optional argument overrides passed to {@link FileSystemType.glob}
             * while matching paths to copy.
             */
            glob: Partial<Glob.Args>;
        }
    }
    /**
     * Types for {@link FileSystemType.glob} method.
     *
     * @since 0.1.0-alpha
     */
    namespace Glob {
        /**
         * Optional configuration for {@link FileSystemType.glob} method.
         *
         * @since 0.1.0-alpha
         */
        interface Args extends Required<GlobOptions> {
            /**
             * Whether to only return files (i.e., do not include directory
             * paths).
             */
            filesOnly: boolean;
        }
    }
    /**
     * Types for {@link FileSystemType.minify} method.
     *
     * @since 0.1.0-alpha
     */
    namespace Minify {
        /**
         * Optional configuration for {@link FileSystemType.minify} method.
         *
         * @since 0.1.0-alpha
         */
        interface Args {
            /**
             * {@include ./FileSystemType.docs.md#MinifyArgsProp}
             */
            css: {
                type?: string;
                'clean-css'?: {
                    [key: string]: boolean | string | null | undefined;
                };
            };
            /**
             * {@include ./FileSystemType.docs.md#MinifyArgsProp}
             */
            html: {
                [key: string]: boolean | string | null | undefined;
            };
            /**
             * {@include ./FileSystemType.docs.md#MinifyArgsProp}
             */
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
            /**
             * {@include ./FileSystemType.docs.md#MinifyArgsProp}
             */
            json: {};
            /**
             * Optional argument overrides passed to {@link FileSystemType.glob}
             * while matching paths to minify.
             */
            glob: Partial<Glob.Args>;
        }
        /**
         * File type options for minify.
         *
         * @since 0.1.0-alpha
         */
        type Format = "css" | "html" | "js" | "json";
    }
    /**
     * Types for {@link FileSystemType.prettier} method.
     *
     * @since 0.1.0-alpha
     */
    namespace Prettier {
        /**
         * Optional configuration for {@link FileSystemType.prettier} method.
         *
         * @since 0.1.0-alpha
         */
        interface Args extends Required<prettier.Options> {
            glob: Partial<Glob.Args>;
        }
        /**
         * Utility types for the {@link Prettier.Args} interface.
         *
         * @since 0.1.0-alpha
         */
        namespace Args {
            /**
             * {@include ./FileSystemType.docs.md#MultiFormatArgs}
             *
             * @since 0.1.0-alpha
             *
             * @interface
             */
            type MultiFormat = {
                _: Partial<Args>;
            } & {
                [F in Format]?: Partial<Args>;
            };
        }
        /**
         * File type options for prettier.
         *
         * @since 0.1.0-alpha
         */
        type Format = "css" | "html" | "js" | "json" | "md" | "mdx" | "scss" | "ts" | "yaml";
    }
}
//# sourceMappingURL=FileSystemType.d.ts.map
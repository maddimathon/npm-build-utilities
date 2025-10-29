/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.4
 * @license MIT
 */
import * as prettier from "prettier";
import type { Objects } from '@maddimathon/utility-typescript/types';
import { node } from '@maddimathon/utility-typescript/classes';
import type { Stage } from '../../../types/index.js';
import type { FileSystemType } from '../../../types/FileSystemType.js';
import type { Logger } from '../../../types/Logger.js';
import { AbstractError } from '../../@internal/index.js';
/**
 * Extends the {@link node.NodeFiles} class with some custom logic useful to this package.
 *
 * @category Utilities
 *
 * @since 0.1.0-alpha
 */
export declare class FileSystem extends node.NodeFiles {
    /**
     * Default {@link prettier} configuration object.
     *
     * @category Args
     *
     * @since 0.2.0-alpha.2
     */
    static get prettierConfig(): {
        bracketSameLine: false;
        bracketSpacing: true;
        experimentalOperatorPosition: "start";
        experimentalTernaries: true;
        htmlWhitespaceSensitivity: "strict";
        jsxSingleQuote: true;
        printWidth: number;
        proseWrap: "preserve";
        semi: true;
        singleAttributePerLine: true;
        singleQuote: true;
        tabWidth: number;
        trailingComma: "all";
        useTabs: false;
        overrides: {
            css: {
                singleQuote: false;
            };
            html: {
                printWidth: number;
                singleQuote: false;
            };
            md: {
                printWidth: number;
            };
            mdx: {
                printWidth: number;
            };
            js: undefined;
            json: undefined;
            scss: undefined;
            ts: undefined;
            yaml: undefined;
        };
        toJSON: (this: prettier.Options & {
            overrides: { [Key in FileSystemType.Prettier.Format]?: prettier.Options; };
        }, format?: FileSystemType.Prettier.Format) => Omit<prettier.Options, "overrides"> & {
            toJSON?: /*elided*/ any;
            overrides: {
                files: string | string[];
                options: prettier.Options;
            }[];
        };
    };
    /**
     * Instance used to log messages within the class.
     *
     * @category Classes
     */
    readonly console: Logger;
    readonly args: FileSystem.Args;
    get ARGS_DEFAULT(): {
        readonly argsRecursive: true;
        readonly copy: {
            readonly force: true;
            readonly recursive: true;
            readonly rename: true;
            readonly glob: {
                readonly absolute: false;
                readonly dot: true;
                readonly filesOnly: false;
            };
        };
        readonly glob: {
            readonly absolute: true;
            readonly dot: true;
            readonly ignore: ["._*", "._*/**", "**/._*", "**/._*/**", "**/.DS_Store", "**/.smbdelete**"];
        };
        readonly minify: {
            readonly css: {};
            readonly html: {};
            readonly js: {};
            readonly json: {};
            readonly glob: {};
        };
        readonly prettier: {
            readonly _: {
                bracketSameLine: false;
                bracketSpacing: true;
                experimentalOperatorPosition: "start";
                experimentalTernaries: true;
                htmlWhitespaceSensitivity: "strict";
                jsxSingleQuote: true;
                printWidth: number;
                proseWrap: "preserve";
                semi: true;
                singleAttributePerLine: true;
                singleQuote: true;
                tabWidth: number;
                trailingComma: "all";
                useTabs: false;
                overrides: {
                    css: {
                        singleQuote: false;
                    };
                    html: {
                        printWidth: number;
                        singleQuote: false;
                    };
                    md: {
                        printWidth: number;
                    };
                    mdx: {
                        printWidth: number;
                    };
                    js: undefined;
                    json: undefined;
                    scss: undefined;
                    ts: undefined;
                    yaml: undefined;
                };
                toJSON: (this: prettier.Options & {
                    overrides: { [Key in FileSystemType.Prettier.Format]?: prettier.Options; };
                }, format?: FileSystemType.Prettier.Format) => Omit<prettier.Options, "overrides"> & {
                    toJSON?: /*elided*/ any;
                    overrides: {
                        files: string | string[];
                        options: prettier.Options;
                    }[];
                };
            };
            readonly css: {
                singleQuote: false;
            };
            readonly html: {
                printWidth: number;
                singleQuote: false;
            };
            readonly js: undefined;
            readonly json: undefined;
            readonly md: {
                printWidth: number;
            };
            readonly mdx: {
                printWidth: number;
            };
            readonly scss: undefined;
            readonly ts: undefined;
            readonly yaml: undefined;
        };
        readonly copyFile: {
            readonly force: true;
            readonly rename: true;
            readonly recursive: false;
        };
        readonly root: "./";
        readonly readDir: {
            readonly recursive: false;
        };
        readonly readFile: {};
        readonly write: {
            force: boolean;
            rename: boolean;
        };
    };
    buildArgs(args?: Partial<FileSystemType.Args> | Objects.RecursivePartial<FileSystemType.Args>): FileSystem.Args;
    /**
     * @category Constructor
     *
     * @param console  Instance used to log messages and debugging info.
     * @param args     Override arguments.
     */
    constructor(console: Logger, args?: Partial<FileSystemType.Args>);
    /**
     * {@inheritDoc internal.FileSystemType.copy}
     *
     * @category Filers
     *
     * @throws {@link FileSystem.Error} — If copying a file fails.
     */
    copy(globs: string | string[], level: number, outputDir: string, sourceDir?: string | null, args?: Partial<FileSystemType.Copy.Args>): string[];
    /**
     * Deletes given globs (via {@link node.NodeFiles}.delete).
     *
     * This catches any errors from {@link node.NodeFiles}.delete, ignores
     * ENOTEMPTY errors, and re-throws the rest.
     *
     * @category Filers
     *
     * @param globs   Glob patterns for paths to delete.
     * @param level   Depth level for output to the console.
     * @param dryRun  If true, files that would be deleted are printed to the
     *                console and not deleted.
     * @param args    Optional glob configuration.
     */
    delete(globs: string | string[], level: number, dryRun?: boolean, args?: Partial<FileSystemType.Glob.Args>): void;
    /**
     * {@inheritDoc internal.FileSystemType.glob}
     *
     * @category Path-makers
     */
    glob(globs: string | string[], args?: Partial<FileSystemType.Glob.Args>): string[];
    /**
     * {@inheritDoc internal.FileSystemType.minify}
     *
     * @category Transformers
     */
    minify(globs: string | string[], format: FileSystemType.Minify.Format, level: number, args?: Partial<FileSystemType.Minify.Args>, renamer?: (path: string) => string): Promise<{
        source: string;
        output: string;
    }[]>;
    /**
     * {@inheritDoc internal.FileSystemType.prettier}
     *
     * @category Transformers
     *
     * @throws {@link FileSystem.Error} — If no parser was given or could be
     *         automatically assigned based on the format (this is unlikely if
     *         you respect the {@link FileSystemType.Prettier.Format} type).
     */
    prettier(globs: string | string[], format: FileSystemType.Prettier.Format, args?: Partial<FileSystemType.Prettier.Args>): Promise<string[]>;
    /**
     * {@inheritDoc internal.FileSystemType.replaceInFiles}
     *
     * @category Transformers
     */
    replaceInFiles(globs: string | string[], replace: [string | RegExp, string] | [string | RegExp, string][], level: number, args?: Partial<FileSystemType.Glob.Args>): string[];
}
/**
 * Used only for {@link FileSystem}.
 *
 * @category Utilities
 *
 * @since 0.1.0-alpha
 */
export declare namespace FileSystem {
    /**
     * Rather than the input arguments (i.e., {@link FileSystemType.Args}), this
     * is the shape of the object built by {@link FileSystem.buildArgs}.
     *
     * @since 0.1.0-alpha
     *
     * @internal
     */
    interface Args extends Omit<FileSystemType.Args, "prettier"> {
        /**
         * Defaults for the {@link FileSystemType.prettier} method.
         */
        prettier: {
            [F in FileSystemType.Prettier.Format]: Partial<FileSystemType.Prettier.Args>;
        };
    }
    /**
     * An extension of the utilities error used by the {@link FileSystem} class.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha
     */
    class Error extends AbstractError {
        readonly name: string;
        constructor(message: string, method: string, args?: {
            cause?: AbstractError.Input;
        });
    }
    /**
     * Arrays of utility globs used within the library.
     *
     * @category Utilities
     *
     * @since 0.1.0-alpha
     */
    namespace globs {
        /**
         * Files that are copied into subdirectories (e.g., releases and
         * snapshots).
         *
         * @since 0.1.0-alpha
         *
         * @source
         */
        const IGNORE_COPIED: (stage: Stage) => string[];
        /**
         * Compiled files to ignore.
         *
         * @since 0.1.0-alpha
         *
         * @source
         */
        const IGNORE_COMPILED: (stage: Stage) => string[];
        /**
         * Files that we probably want to ignore within an npm project.
         *
         * @since 0.1.0-alpha
         */
        const IGNORE_PROJECT: readonly [".git/**", "**/.git/**", ".scripts/**", "**/.scripts/**", ".vscode/**/*.code-snippets", ".vscode/**/settings.json", "node_modules/**", "**/node_modules/**"];
        /**
         * System files that we *never, ever* want to include.
         *
         * @since 0.1.0-alpha
         */
        const SYSTEM: readonly ["._*", "._*/**", "**/._*", "**/._*/**", "**/.DS_Store", "**/.smbdelete**"];
    }
    /**
     * Utility functions and constants for the {@link FileSystem.minify} method.
     *
     * @category Transformers
     *
     * @since 0.1.0-alpha
     */
    namespace minify {
        /**
         * Default args for the {@link FileSystem.minify} method
         *
         * @since 0.1.0-alpha
         */
        const ARGS_DEFAULT: {
            readonly css: {};
            readonly html: {};
            readonly js: {};
            readonly json: {};
            readonly glob: {};
        };
    }
    /**
     * Utility functions for the {@link FileSystem.prettier} method.
     *
     * @category Transformers
     *
     * @since 0.1.0-alpha
     */
    namespace prettier {
        /**
         * Default args for the {@link FileSystem.prettier} method
         *
         * @since 0.1.0-alpha
         *
         * @deprecated 0.2.0-alpha.2 — Replaced by static accessor {@link FileSystem.prettierConfig}.
         */
        const ARGS_DEFAULT: {
            _: {
                bracketSameLine: false;
                bracketSpacing: true;
                experimentalOperatorPosition: "start";
                experimentalTernaries: true;
                htmlWhitespaceSensitivity: "strict";
                jsxSingleQuote: true;
                printWidth: number;
                proseWrap: "preserve";
                semi: true;
                singleAttributePerLine: true;
                singleQuote: true;
                tabWidth: number;
                trailingComma: "all";
                useTabs: false;
                overrides: {
                    css: {
                        singleQuote: false;
                    };
                    html: {
                        printWidth: number;
                        singleQuote: false;
                    };
                    md: {
                        printWidth: number;
                    };
                    mdx: {
                        printWidth: number;
                    };
                    js: undefined;
                    json: undefined;
                    scss: undefined;
                    ts: undefined;
                    yaml: undefined;
                };
                toJSON: (this: import("prettier").Options & {
                    overrides: { [Key in FileSystemType.Prettier.Format]?: import("prettier").Options; };
                }, format?: FileSystemType.Prettier.Format) => Omit<import("prettier").Options, "overrides"> & {
                    toJSON?: /*elided*/ any;
                    overrides: {
                        files: string | string[];
                        options: import("prettier").Options;
                    }[];
                };
            };
            css: {
                singleQuote: false;
            };
            html: {
                printWidth: number;
                singleQuote: false;
            };
            js: undefined;
            json: undefined;
            md: {
                printWidth: number;
            };
            mdx: {
                printWidth: number;
            };
            scss: undefined;
            ts: undefined;
            yaml: undefined;
        };
    }
}
//# sourceMappingURL=FileSystem.d.ts.map
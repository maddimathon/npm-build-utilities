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
import { node } from '@maddimathon/utility-typescript/classes';
import type { Stage } from '../../../types/index.js';
import type { FileSystemType } from '../../../types/FileSystemType.js';
import type { LocalError } from '../../../types/LocalError.js';
import type { Logger } from '../../../types/Logger.js';
import { AbstractError } from '../../@internal/index.js';
/**
 * Extends the {@link node.NodeFiles} class with some custom logic useful to this package.
 *
 * @category Utilities
 *
 * @since 0.1.0-alpha.draft
 */
export declare class FileSystem extends node.NodeFiles {
    readonly console: Logger;
    /**
     * A completed args object.
     *
     * @category Args
     */
    readonly args: FileSystemType.Args;
    /**
     * Default args for this class.
     *
     * @category Args
     */
    get ARGS_DEFAULT(): {
        readonly copy: {
            readonly force: true;
            readonly recursive: true;
            readonly rename: true;
            readonly glob: {
                readonly absolute: false;
                readonly dot: true;
            };
        };
        readonly glob: {
            readonly absolute: true;
            readonly dot: true;
            readonly ignore: string[];
        };
        readonly minify: {
            readonly css: {
                readonly type: "clean-css";
                readonly 'clean-css': {
                    readonly compatibility: "*";
                };
            };
            readonly html: {
                readonly collapseBooleanAttributes: false;
                readonly collapseWhitespace: true;
                readonly minifyCSS: true;
                readonly minifyJS: true;
                readonly removeAttributeQuotes: true;
                readonly removeCDATASectionsFromCDATA: true;
                readonly removeComments: true;
                readonly removeCommentsFromCDATA: true;
                readonly removeEmptyAttributes: false;
                readonly removeEmptyElements: false;
                readonly removeOptionalTags: false;
                readonly removeRedundantAttributes: false;
                readonly removeScriptTypeAttributes: false;
                readonly removeStyleLinkTypeAttributes: false;
                readonly useShortDoctype: true;
            };
            readonly js: {
                readonly type: "putout";
                readonly putout: {
                    readonly quote: "'";
                    readonly mangle: false;
                    readonly mangleClassNames: false;
                    readonly removeUnusedVariables: false;
                    readonly removeConsole: false;
                    readonly removeUselessSpread: false;
                };
            };
            readonly glob: {
                readonly ignore: string[];
            };
        };
        readonly prettier: typeof FileSystem.prettier.argsDefault;
        readonly argsRecursive: true;
        readonly copyFileArgs: {
            readonly force: true;
            readonly rename: true;
            readonly recursive: false;
        };
        readonly root: "./";
        readonly readDirArgs: {
            readonly recursive: false;
        };
        readonly readFileArgs: {};
        readonly writeArgs: {
            force: boolean;
            rename: boolean;
        };
    };
    /**
     * @param console   Used to output messages within the class.
     * @param args
     */
    constructor(console: Logger, args?: Partial<FileSystemType.Args>);
    /**
     * {@inheritDoc internal.FileSystemType.copy}
     *
     * @throws {@link FileSystem.Error}
     */
    copy(globs: string | string[], level: number, outputDir: string, sourceDir?: string | null, args?: Partial<FileSystemType.Copy.Args>): false | string[];
    /** {@inheritDoc internal.FileSystemType.delete} */
    delete(globs: string | string[], level: number, dryRun?: boolean, args?: FileSystemType.Glob.Args): void;
    /** {@inheritDoc internal.FileSystemType.glob} */
    glob(globs: string | string[], args?: FileSystemType.Glob.Args): string[];
    /** {@inheritDoc internal.FileSystemType.minify} */
    minify(globs: string | string[], format: FileSystemType.Minify.Format, level: number, args?: Partial<FileSystemType.Minify.Args>, renamer?: (path: string) => string): Promise<{
        source: string;
        output: string;
    }[]>;
    /** {@inheritDoc internal.FileSystemType.prettier} */
    prettier(globs: string | string[], format: FileSystemType.Prettier.Format, args?: Partial<FileSystemType.Prettier.Args>): Promise<string[]>;
    /** {@inheritDoc internal.FileSystemType.replaceInFiles} */
    replaceInFiles(globs: string | string[], replace: [string | RegExp, string] | [string | RegExp, string][], level: number, args?: FileSystemType.Glob.Args): string[];
}
/**
 * Used only for {@link FileSystem}.
 *
 * @category Class-Helpers
 *
 * @since 0.1.0-alpha.draft
 */
export declare namespace FileSystem {
    /**
     * An extension of the utilities error used by the {@link FileSystem} class.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha.draft
     */
    class Error extends AbstractError<LocalError.Args> {
        readonly name: string;
        get ARGS_DEFAULT(): any;
        constructor(message: string, method: string, args?: Partial<LocalError.Args> & {
            cause?: LocalError.Input;
        });
    }
    /**
     * Arrays of utility globs used within the library.
     *
     * @since 0.1.0-alpha.draft
     */
    namespace globs {
        /**
         * Files that are copied into subdirectories (e.g., releases and
         * snapshots).
         */
        const IGNORE_COPIED: (stage: Stage.Class) => string[];
        /**
         * Compiled files to ignore.
         */
        const IGNORE_COMPILED: string[];
        /**
         * Files that we probably want to ignore within an npm project.
         */
        const IGNORE_PROJECT: string[];
        /**
         * System files that we *never, ever* want to include.
         */
        const SYSTEM: string[];
    }
    /**
     * Utilities for the {@link FileSystem.minify} method.
     *
     * @since 0.1.0-alpha.draft
     */
    namespace minify {
        const argsDefault: {
            readonly css: {
                readonly type: "clean-css";
                readonly 'clean-css': {
                    readonly compatibility: "*";
                };
            };
            readonly html: {
                readonly collapseBooleanAttributes: false;
                readonly collapseWhitespace: true;
                readonly minifyCSS: true;
                readonly minifyJS: true;
                readonly removeAttributeQuotes: true;
                readonly removeCDATASectionsFromCDATA: true;
                readonly removeComments: true;
                readonly removeCommentsFromCDATA: true;
                readonly removeEmptyAttributes: false;
                readonly removeEmptyElements: false;
                readonly removeOptionalTags: false;
                readonly removeRedundantAttributes: false;
                readonly removeScriptTypeAttributes: false;
                readonly removeStyleLinkTypeAttributes: false;
                readonly useShortDoctype: true;
            };
            readonly js: {
                readonly type: "putout";
                readonly putout: {
                    readonly quote: "'";
                    readonly mangle: false;
                    readonly mangleClassNames: false;
                    readonly removeUnusedVariables: false;
                    readonly removeConsole: false;
                    readonly removeUselessSpread: false;
                };
            };
            readonly glob: {
                readonly ignore: string[];
            };
        };
    }
    /**
     * Utility functions for the {@link FileSystem.prettier} method.
     *
     * @since 0.1.0-alpha.draft
     */
    namespace prettier {
        function argsDefault(format: FileSystemType.Prettier.Format): {
            readonly bracketSameLine: false;
            readonly bracketSpacing: true;
            readonly experimentalOperatorPosition: "start";
            readonly experimentalTernaries: false;
            readonly htmlWhitespaceSensitivity: "strict";
            readonly jsxSingleQuote: false;
            readonly printWidth: 80;
            readonly proseWrap: "preserve";
            readonly semi: true;
            readonly singleAttributePerLine: true;
            readonly singleQuote: true;
            readonly tabWidth: 4;
            readonly trailingComma: "all";
            readonly useTabs: false;
            readonly glob: {};
        } | {
            readonly singleQuote: false;
            readonly bracketSameLine: false;
            readonly bracketSpacing: true;
            readonly experimentalOperatorPosition: "start";
            readonly experimentalTernaries: false;
            readonly htmlWhitespaceSensitivity: "strict";
            readonly jsxSingleQuote: false;
            readonly printWidth: 80;
            readonly proseWrap: "preserve";
            readonly semi: true;
            readonly singleAttributePerLine: true;
            readonly tabWidth: 4;
            readonly trailingComma: "all";
            readonly useTabs: false;
            readonly glob: {};
        } | {
            readonly printWidth: 10000;
            readonly bracketSameLine: false;
            readonly bracketSpacing: true;
            readonly experimentalOperatorPosition: "start";
            readonly experimentalTernaries: false;
            readonly htmlWhitespaceSensitivity: "strict";
            readonly jsxSingleQuote: false;
            readonly proseWrap: "preserve";
            readonly semi: true;
            readonly singleAttributePerLine: true;
            readonly singleQuote: true;
            readonly tabWidth: 4;
            readonly trailingComma: "all";
            readonly useTabs: false;
            readonly glob: {};
        };
    }
}
//# sourceMappingURL=FileSystem.d.ts.map
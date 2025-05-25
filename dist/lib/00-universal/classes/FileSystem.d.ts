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
import type { LocalError, Logger } from '../../../types/index.js';
import type { FileSystemType } from '../../../types/FileSystemType.js';
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
    readonly args: FileSystem.Args;
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
            readonly ignore: ["._*", "._**/**", "**/._*", "**/._**/**", "**/.DS_Store", "**/.smbdelete**"];
        };
        readonly argsRecursive: false;
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
    constructor(console: Logger, args?: Partial<FileSystem.Args>);
    /**
     * {@inheritDoc FileSystemType.copy}
     *
     * @throws {@link FileSystem.Error}
     */
    copy(globs: string | string[], level: number, outputDir: string, sourceDir?: string | null, args?: Partial<FileSystemType.Copy.Args>): false | string[];
    /** {@inheritDoc FileSystemType.delete} */
    delete(globs: string | string[], level: number, dryRun?: boolean, args?: FileSystemType.Glob.Args): void;
    /** {@inheritDoc FileSystemType.glob} */
    glob(globs: string | string[], args?: FileSystemType.Glob.Args): string[];
}
/**
 * Used only for {@link FileSystem}.
 *
 * @category Utilities
 *
 * @since 0.1.0-alpha.draft
 */
export declare namespace FileSystem {
    /**
     * Optional configuration for {@link FileSystem} class.
     *
     * @since 0.1.0-alpha.draft
     */
    interface Args extends node.NodeFiles.Args {
        /**
         * Defaults for the {@link FileSystem.copy} method.
         */
        copy: Partial<FileSystemType.Copy.Args>;
        /**
         * Defaults for the {@link FileSystem.glob} method.
         */
        glob: FileSystemType.Glob.Args;
    }
    /**
     * An extension of the utilities error used by the {@link FileSystem} class.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha.draft
     */
    class Error extends AbstractError<Error.Args> {
        readonly name: string;
        get ARGS_DEFAULT(): any;
        constructor(message: string, context: null | AbstractError.Context, args?: Partial<Error.Args> & {
            cause?: LocalError.Input;
        });
    }
    /**
     * Used only for {@link FileSystem.Error}.
     *
     * @category Errors
     *
     * @since 0.1.0-alpha.draft
     */
    namespace Error {
        /**
         * All allowed error code strings.
         */
        type Code = never;
        /**
         * Optional configuration for {@link Error} class.
         *
         * @since 0.1.0-alpha.draft
         */
        interface Args extends LocalError.Args {
        }
    }
    /**
     * Optional class instances to pass to {@link FileSystem} constructor.
     *
     * @since 0.1.0-alpha.draft
     */
    interface Utils extends Omit<NonNullable<ConstructorParameters<typeof node.NodeFiles>[1]>, "nc"> {
    }
}
//# sourceMappingURL=FileSystem.d.ts.map
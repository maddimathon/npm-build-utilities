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
import { node } from '@maddimathon/utility-typescript/classes';
import type { Logger } from '../../../types/index.js';
import { type FileSystemType } from '../../@internal.js';
/**
 * Extends the {@link node.NodeFiles} class with some custom logic useful to this package.
 *
 * @category Utilities
 *
 * @since 0.1.0-draft
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
        readonly argsRecursive: false;
        readonly root: "./";
        readonly writeFileArgs: {
            readonly force: false;
            readonly rename: false;
        };
    };
    /**
     * @param console   Used to output messages within the class.
     * @param args
     */
    constructor(console: Logger, args?: Partial<FileSystem.Args>);
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
 * Used only for {@link FileSystem}.
 *
 * @category Utilities
 *
 * @since 0.1.0-draft
 */
export declare namespace FileSystem {
    /**
     * Optional configuration for {@link FileSystem} class.
     *
     * @since 0.1.0-draft
     */
    interface Args extends node.NodeFiles.Args {
    }
    /**
     * Optional class instances to pass to {@link FileSystem} constructor.
     *
     * @since 0.1.0-draft
     */
    interface Utils extends Omit<NonNullable<ConstructorParameters<typeof node.NodeFiles>[1]>, "nc"> {
    }
}
//# sourceMappingURL=FileSystem.d.ts.map
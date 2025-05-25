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
import type { Logger } from '../../../types/index.js';
import { type FileSystemType } from '../../@internal.js';
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
            readonly glob: {};
        };
        readonly glob: {
            readonly absolute: true;
            readonly dot: true;
            readonly ignore: ["**/._*", "**/._**/*", "**/.DS_Store", "**/.smbdelete**"];
        };
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
    /** {@inheritDoc FileSystemType.copy} */
    copy(globs: string | string[], level: number, outputDir: string, sourceDir?: string | null, opts?: Partial<FileSystemType.Copy.Args>): false | string[];
    /** {@inheritDoc FileSystemType.glob} */
    glob(globs: string | string[], opts?: FileSystemType.Glob.Args): string[];
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
     * Optional class instances to pass to {@link FileSystem} constructor.
     *
     * @since 0.1.0-alpha.draft
     */
    interface Utils extends Omit<NonNullable<ConstructorParameters<typeof node.NodeFiles>[1]>, "nc"> {
    }
}
//# sourceMappingURL=FileSystem.d.ts.map
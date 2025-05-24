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
/**
 * Extends the {@link node.NodeFiles} class with some custom logic useful to this package.
 *
 * @category Utilities
 *
 * @since 0.1.0-alpha.draft
 */
export class FileSystem extends node.NodeFiles {
    console;
    /* LOCAL PROPERTIES
     * ====================================================================== */
    /* Args ===================================== */
    /**
     * A completed args object.
     *
     * @category Args
     */
    args;
    /**
     * Default args for this class.
     *
     * @category Args
     */
    get ARGS_DEFAULT() {
        return {
            ...node.NodeFiles.prototype.ARGS_DEFAULT,
        };
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param console   Used to output messages within the class.
     * @param args
     */
    constructor(console, args = {}) {
        super(args, {
            nc: console.nc,
        });
        this.console = console;
        this.args = (
        // @ts-expect-error - it is initialized in the super constructor
        this.args) ?? this.buildArgs(args);
    }
    /* METHODS
     * ====================================================================== */
    /**
     * Copies files from one directory to another, maintaing their relative
     * directory structure.
     */
    copy(globs, opts) {
        this.console.progress(`(NOT IMPLEMENTED) FileSystem.copy()`, 1);
        return [];
    }
    /**
     * Gets the valid paths matched against the input globs.
     */
    glob(input, opts) {
        this.console.progress(`(NOT IMPLEMENTED) FileSystem.glob()`, 1);
        return [];
    }
}
/**
 * Used only for {@link FileSystem}.
 *
 * @category Utilities
 *
 * @since 0.1.0-alpha.draft
 */
(function (FileSystem) {
    ;
    ;
})(FileSystem || (FileSystem = {}));
//# sourceMappingURL=FileSystem.js.map
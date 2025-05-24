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
import type { LocalError, Logger } from '../../types/index.js';
/**
 * @param tryer     Function to run inside the try {}.
 * @param level
 * @param console   Instance used to log debugging information.
 * @param params    Parameters passed to the tryer function, if any.
 * @param callback  Used to handle the error.  Note: if the callback does not throw or exit, the caught error is re-thrown.
 */
export declare function catchOrReturn<Params extends never[], Return extends unknown>(tryer: (...params: Params) => Return, level: number, console: Logger, params?: Params, callback?: (null | LocalError.Handler | [LocalError.Handler, Partial<LocalError.Handler.Args>])): Return;
export declare function catchOrReturn<Params extends unknown[], Return extends unknown>(tryer: (...params: Params) => Return, level: number, console: Logger, params: Params, callback?: (null | LocalError.Handler | [LocalError.Handler, Partial<LocalError.Handler.Args>])): Return;
//# sourceMappingURL=catchOrReturn.d.ts.map
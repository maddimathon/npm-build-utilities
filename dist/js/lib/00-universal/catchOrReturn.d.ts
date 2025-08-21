/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.2.0-alpha.2
 * @license MIT
 */
import type { FileSystemType } from '../../types/FileSystemType.js';
import type { Logger } from '../../types/Logger.js';
import { type AbstractError } from '../@internal/index.js';
/**
 * If the `tryer` function has no params, then they are optional.
 *
 * @typeParam T_Params  Parameter type for the `tryer` function.
 * @typeParam T_Return  Return type for the `tryer` function.
 *
 * @param tryer     Function to run inside the try {}.
 * @param level     Depth level for output to the console.
 * @param console   Instance used to log messages and debugging info.
 * @param fs        Instance used to work with paths and files.
 * @param params    Parameters passed to the tryer function, if any.
 * @param callback  Used to handle the error. Note: if the callback does not
 *                  throw or exit, the caught error is re-thrown.
 *
 * @return  The `tryer` function’s return.
 */
export declare function catchOrReturn<T_Params extends never[], T_Return extends unknown>(tryer: () => T_Return, level: number, console: Logger, fs: FileSystemType, params?: NoInfer<T_Params>, callback?: (AbstractError.Handler | [AbstractError.Handler, Partial<AbstractError.Handler.Args>])): T_Return;
/**
 * If the `tryer` function *has* params, then they are required.
 */
export declare function catchOrReturn<T_Params extends unknown[], T_Return extends unknown>(tryer: (...params: T_Params) => T_Return, level: number, console: Logger, fs: FileSystemType, params: NoInfer<T_Params>, callback?: (AbstractError.Handler | [AbstractError.Handler, Partial<AbstractError.Handler.Args>])): T_Return;
//# sourceMappingURL=catchOrReturn.d.ts.map
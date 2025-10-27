/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.2
 * @license MIT
 */
import type { Json } from '@maddimathon/utility-typescript/types';
import type { FileSystemType } from '../../types/FileSystemType.js';
import type { Logger } from '../../types/Logger.js';
import { FileSystem } from './classes/index.js';
/**
 * Gets a copy of the package.json object for the current npm project.
 *
 * @category Config
 *
 * @param args  A {@link FileSystem} instance to use or arguments to use to
 *              construct one.
 *
 * @return  The parsed package.json file contents.
 *
 * @throws {@link ProjectError} — If no {@link FileSystem} instance was passed
 *                                or there was not enough information to
 *                                construct one.
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export declare function getPackageJson(args: FileSystem | {
    console?: undefined | Logger;
    fs: FileSystem;
} | {
    console: Logger;
    fs?: undefined | FileSystemType.Args;
}): Partial<Json.PackageJson>;
//# sourceMappingURL=getPackageJson.d.ts.map
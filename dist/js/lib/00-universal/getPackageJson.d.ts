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
import type { Node } from '@maddimathon/utility-typescript/types';
import type { FileSystemType } from '../../types/FileSystemType.js';
import type { Logger } from '../../types/Logger.js';
import { FileSystem } from './classes/index.js';
/**
 * Gets a copy of the package.json object for the current npm project.
 *
 * @category Config
 *
 * @param args  A {@link FileSystem} instance to use or arguments to use to
 * construct one.
 *
 * @throws ProjectError  If no {@link FileSystem} instance was passed or there
 *                       was not enough information to construct one.
 *
 * @since 0.1.0-alpha.draft
 *
 * @internal
 */
export declare function getPackageJson(args: FileSystem | {
    console?: Logger;
    fs: FileSystem;
} | {
    console: Logger;
    fs?: undefined | FileSystemType.Args;
}): Partial<Node.PackageJson>;
//# sourceMappingURL=getPackageJson.d.ts.map
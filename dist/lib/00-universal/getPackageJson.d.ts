/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-draft
 * @license MIT
 */
import type { Node } from '@maddimathon/utility-typescript/types';
import type { Logger } from '../../types/index.js';
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
 * @since 0.1.0-draft
 *
 * @internal
 */
export declare function getPackageJson(args: FileSystem | {
    console?: Logger;
    fs: FileSystem;
} | {
    console: Logger;
    fs?: undefined | FileSystem.Args;
}): Node.PackageJson;
//# sourceMappingURL=getPackageJson.d.ts.map
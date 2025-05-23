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
import type { Node } from '@maddimathon/utility-typescript/types';
import type { Stage } from '../../types/index.js';
import { FileSystem } from './classes/index.js';
/**
 * Gets a copy of the package.json object for the current npm project.
 *
 * @param args  A {@link FileSystem} instance to use or arguments to use to
 * construct one.
 *
 * @throws ProjectError  If no {@link FileSystem} instance was passed or there
 *                       was not enough information to construct one.
 */
export declare function getPackageJson(args: FileSystem | {
    console?: Stage.Console;
    fs: FileSystem;
} | {
    console: Stage.Console;
    fs?: undefined | FileSystem.Args;
}): Node.PackageJson;
//# sourceMappingURL=getPackageJson.d.ts.map
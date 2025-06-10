/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type {
    Json,
} from '@maddimathon/utility-typescript/types';

// import type {
// } from '../../types/index.js';

import type { FileSystemType } from '../../types/FileSystemType.js';
import type { Logger } from '../../types/Logger.js';

import {
    ProjectError,
} from '../@internal/index.js';

import {
    FileSystem,
} from './classes/index.js';


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
export function getPackageJson(
    args: FileSystem | {
        console?: undefined | Logger,
        fs: FileSystem,
    } | {
        console: Logger,
        fs?: undefined | FileSystemType.Args,
    },
): Partial<Json.PackageJson> {

    let fs: FileSystem | undefined;

    if ( args instanceof FileSystem ) {
        fs = args;
    } else {

        if ( args.fs instanceof FileSystem ) {
            fs = args.fs;
        } else if ( args.console ) {
            fs = new FileSystem( args.console, args.fs );
        }
    }

    // throws
    if ( !fs ) {

        throw new ProjectError(
            'No appropriate FileSystem instance found or constructable.',
            {
                function: 'getPackageJson',
            },
            0
        );
    }

    return JSON.parse( fs.readFile( 'package.json' ) ) as Json.PackageJson;
}
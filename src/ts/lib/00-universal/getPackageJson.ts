/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type { Node } from '@maddimathon/utility-typescript/types';

import type {
    Logger,
} from '../../types/index.js';

import {
    ProjectError,
} from '../@internal/index.js';

import {
    FileSystem,
} from './classes/index.js';


/**
 * Gets a copy of the package.json object for the current npm project.
 *
 * @param args  A {@link FileSystem} instance to use or arguments to use to
 * construct one.
 *
 * @throws ProjectError  If no {@link FileSystem} instance was passed or there
 *                       was not enough information to construct one.
 * 
 * @internal
 */
export function getPackageJson(
    args: FileSystem | {
        console?: Logger,
        fs: FileSystem,
    } | {
        console: Logger,
        fs?: undefined | FileSystem.Args,
    },
): Node.PackageJson {

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

    return JSON.parse( fs.readFile( 'package.json' ) ) as Node.PackageJson;
}
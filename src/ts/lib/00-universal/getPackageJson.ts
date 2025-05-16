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

import { node } from '@maddimathon/utility-typescript/classes';

import { getFileSystem } from './getFileSystem.js';

/**
 * Gets a copy of the package.json object for the current npm project.
 */
export function getPackageJson( _?: {
    nc?: node.NodeConsole,
    fs?: node.NodeFiles,
} ) {
    const fs = _?.fs ?? getFileSystem( _?.nc );
    return JSON.parse( fs.readFile( 'package.json' ) ) as Node.PackageJson;
}
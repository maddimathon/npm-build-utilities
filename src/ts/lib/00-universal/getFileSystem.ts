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

import { node } from '@maddimathon/utility-typescript/classes';

/**
 * Gets an instances of {@link node.NodeFiles} to use within the package.
 */
export function getFileSystem( nc?: node.NodeConsole ) {
    return new node.NodeFiles( {}, { nc } );
}
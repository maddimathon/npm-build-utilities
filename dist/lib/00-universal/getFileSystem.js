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
import { node } from '@maddimathon/utility-typescript/classes';
/**
 * Gets an instances of {@link node.NodeFiles} to use within the package.
 */
export function getFileSystem(nc) {
    return new node.NodeFiles({}, { nc });
}
//# sourceMappingURL=getFileSystem.js.map
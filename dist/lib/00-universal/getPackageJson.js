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
import { getFileSystem } from './getFileSystem.js';
/**
 * Gets a copy of the package.json object for the current npm project.
 */
export function getPackageJson(_) {
    var _a;
    const fs = (_a = _ === null || _ === void 0 ? void 0 : _.fs) !== null && _a !== void 0 ? _a : getFileSystem(_ === null || _ === void 0 ? void 0 : _.nc);
    return JSON.parse(fs.readFile('package.json'));
}
//# sourceMappingURL=getPackageJson.js.map
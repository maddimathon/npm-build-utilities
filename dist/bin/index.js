#!/usr/bin/env node
/**
 * NPM Build Utilities (CLI)
 *
 * @package @maddimathon/npm-build-utilities@0.1.0-draft
 * @author Maddi Mathon (www.maddimathon.com)
 * @homepage https://maddimathon.github.io/npm-build-utilities
 *
 * @license MIT
 *
 * @since 1.1.0+tmpl
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/npm-build-utilities@0.1.0-draft
 * @license MIT
 */
var _a;
import minimist from 'minimist';
import { NodeFunctions } from '@maddimathon/utility-typescript/classes/node';
const args = minimist(process.argv.slice(2));
const F = new NodeFunctions();
// const project = new Project();
const scriptName = (_a = args._[0]) !== null && _a !== void 0 ? _a : '';
switch (scriptName) {
    default:
        F.nc.log('The cli for this package is not yet implemented.', { clr: 'purple' });
        break;
}
//# sourceMappingURL=index.js.map
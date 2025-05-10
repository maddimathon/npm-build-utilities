#!/usr/bin/env node
/**
 * NPM Library Template (Node CLI)
 *
 * @package @maddimathon/template-npm-library@1.2.1+tmpl
 * @author Maddi Mathon (www.maddimathon.com)
 * @homepage https://maddimathon.github.io/template-npm-library
 *
 * @license MIT
 *
 * @since 1.1.0+tmpl
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/template-npm-library@1.2.1+tmpl
 * @license MIT
 */
var _a;
import minimist from 'minimist';
import sayHello from './sayHello.js';
const args = minimist(process.argv.slice(2));
const scriptName = (_a = args._[0]) !== null && _a !== void 0 ? _a : '';
switch (scriptName) {
    default:
        sayHello(args);
        break;
}
//# sourceMappingURL=index.js.map
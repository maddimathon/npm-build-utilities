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
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/npm-build-utilities@0.1.0-draft
 * @license MIT
 */
var _a;
import minimist from 'minimist';
import help from './help.js';
import { parseParamsCLI, Project, } from '../index.js';
import { getConfig } from './lib/index.js';
const params = minimist(process.argv.slice(2));
const scriptName = ((_a = params._) === null || _a === void 0 ? void 0 : _a[0]);
switch (scriptName) {
    case 'debug':
    case 'snapshot':
    case 'compile':
    case 'test':
    case 'document':
    case 'build':
    case 'package':
    case 'release':
        const fullParams = parseParamsCLI(params);
        const project = new Project(await getConfig(fullParams, await Project.getConsole({
            name: 'Project',
            params: fullParams,
        })), fullParams);
        await project.run(scriptName);
        break;
    case 'help':
    default:
        await help(params);
        break;
}
//# sourceMappingURL=index.js.map
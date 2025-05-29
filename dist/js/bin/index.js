#!/usr/bin/env node
/**
 * NPM Build Utilities (CLI)
 *
 * @package @maddimathon/build-utilities@0.1.0-alpha.draft
 * @author Maddi Mathon (www.maddimathon.com)
 * @homepage https://maddimathon.github.io/npm-build-utilities
 *
 * @license MIT
 *
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import minimist from 'minimist';
import help from './help.js';
import { parseParamsCLI, Project } from '../lib/index.js';
import { getConfig } from './lib/index.js';
const params = parseParamsCLI(minimist(process.argv.slice(2)));
const scriptName = params._?.[0];
switch (scriptName) {
    case 'debug':
    case 'snapshot':
    case 'compile':
    case 'test':
    case 'document':
    case 'build':
    case 'package':
    case 'release':
        const project = new Project(await getConfig(params), params);
        await project.run(scriptName);
        break;
    case 'help':
    default:
        await help(params);
        break;
}
//# sourceMappingURL=index.js.map

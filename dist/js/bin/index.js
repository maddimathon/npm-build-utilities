#!/usr/bin/env node
/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.1.draft
 * @license MIT
 */
import minimist from 'minimist';
import { parseParamsCLI } from '../lib/01-config/parseParamsCLI.js';
import { Project } from '../lib/04-project/classes/Project.js';
import { getConfig } from './lib/getConfig.js';
process.on('uncaughtException', Project.uncaughtErrorListener);
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
        const help = (await import('./help.js')).default;
        await help(params);
        break;
}
//# sourceMappingURL=index.js.map
